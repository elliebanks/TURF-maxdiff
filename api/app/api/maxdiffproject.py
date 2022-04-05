import os

from flask import request, jsonify, current_app
from sqlalchemy.ext.mutable import MutableDict
from app import db
from app.api.errors import error_response
from app.main import bp
from app.models import MaxDiffProject
from app.save_file import  save_file
from mdfunctions import process_raw_util_xl_file, calc_reach_metrics


@bp.route('/api/request_load_pickle_sim', methods=['POST'])
def request_load_pickle_sim():
	fn = save_file(None, "maxdiff", "xlsx")
	request.files["maxdiff"].save(fn)
	result = process_raw_util_xl_file(fn)
	claims = result['claims']
	utilities = result['utilities']
	weights = result['weights']
	maxdiff_scores = result['maxdiff_scores']
	data = jsonify(claims)
	print(data)
	mdp = MaxDiffProject()
	mdp.config = MutableDict({
		'claims': claims,
		'utilities': utilities,
		'weights': weights,
		'maxdiff_scores': maxdiff_scores
	})
	print(mdp.config)
	db.session.add(mdp)
	db.session.commit()
	return data

@bp.route('/api/get_reach_scores', methods=['POST'])
def get_reach_scores():
	mdp = MaxDiffProject().query.first()
	project_config = mdp.config
	claims = project_config['claims']
	maxdiff_scores = project_config['maxdiff_scores']
	weights = project_config['weights']
	metric_calculations = calc_reach_metrics(maxdiff_scores, claims, weights)
	print(metric_calculations['Summary_Metrics'])
	data = jsonify(metric_calculations)
	return data

@bp.route('/api/get_summary_metrics', methods=['POST'])
def get_summary_metrics():
	mdp = MaxDiffProject().query.first()
	get_config = mdp.config
	claims = get_config['claims']
	maxdiff_scores = get_config['maxdiff_scores']
	weights = get_config['weights']
	claims_offered_dict = request.get_json() or {}
	print(claims_offered_dict)
	claims_offered_list = list(claims_offered_dict.keys())
	print(claims_offered_list)
	# current_offerings = [claim in claims_on_list for claim in claims]
	metric_calculations = calc_reach_metrics(maxdiff_scores, claims_offered_list, weights)
	print(metric_calculations['Summary_Metrics'])
	data = jsonify(metric_calculations)
	return data



@bp.route('/api/check_db_for_claims', methods=["GET"])
def check_db_for_claims():
	# find first project in the db, if there is one
	mdp = MaxDiffProject().query.first()
	# if there is no project found in the db, we have no claims. Return empty list for rendering of Upload File page
	if mdp is None:
		print(mdp)
		return jsonify([])
	else:
		# if there is a project found in the db, get the list of claims from the project's config
		project_config = mdp.config
		claims= project_config['claims']
		print(claims)
		# jsonify the list of claims in order to be an acceptable response for the front end & return the data for rendering of Data Table
		data = jsonify(claims)
		return data

@bp.route("/api/export_to_csv", methods=["GET", "POST"])
def export_to_csv():
	csv_data = request.get_json() or {}
	print(csv_data)
	if not os.path.exists(current_app.instance_path):
		os.mkdir(current_app.instance_path)
	if not os.path.exists(os.path.join(current_app.instance_path, "files")):
		os.mkdir(os.path.join(current_app.instance_path, "files"))
	csv_fn = os.path.join(
		current_app.instance_path, "files", "SideBySideView.csv"
	)




@bp.route('/api/project', methods=["DELETE"])
def delete_project_from_db():
	# check the db to find the project
	mdp = MaxDiffProject().query.first()
	# if no project is found return error response
	if mdp is None:
		return error_response(400)
	# if project is found: delete project from db, commit to db, return empty list for front end to render Upload File page
	else:
		db.session.delete(mdp)
		db.session.commit()
		return jsonify([])

