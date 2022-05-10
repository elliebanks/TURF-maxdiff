import os

from flask import request, jsonify, current_app, send_file
from sqlalchemy.ext.mutable import MutableDict
from app import db
from app.api.errors import error_response
from app.main import bp
from app.models import MaxDiffProject, SubGroup
from app.save_file import  save_file
from mdfunctions import process_raw_util_xl_file, calc_reach_metrics, get_incremental_reach, \
	process_subgroup_file, filter_for_subgroup, generate_turf_chart_csv


# CHECK DB FOR CLAIMS WHEN APP LOADS
@bp.route('/api/check_db_for_claims', methods=["GET"])
def check_db_for_claims():
	# find first project in the db, if there is one
	mdp = MaxDiffProject().query.first()
	print(mdp)
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

# UPLOAD, PROCESS MAXDIFF SCORE FILE AND SAVE TO DATABASE
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


# CALCULATE MD REACH SCORES
@bp.route('/api/request_maxdiff_reach_scores', methods=['POST'])
def md_reach_scores():
	mdp = MaxDiffProject().query.first()
	project_config = mdp.config
	claims = project_config['claims']
	maxdiff_scores = project_config['maxdiff_scores']
	weights = project_config['weights']
	metric_calculations = calc_reach_metrics(maxdiff_scores, claims, weights)
	print(metric_calculations['Summary_Metrics'])
	data = jsonify(metric_calculations)
	return data

# CALCULATE MD SUMMARY METRICS BASED ON CLAIMS OFFERED
@bp.route('/api/request_maxdiff_summary_metrics', methods=['POST'])
def md_summary_metrics():
	mdp = MaxDiffProject().query.first()
	get_config = mdp.config
	claims = get_config['claims']
	maxdiff_scores = get_config['maxdiff_scores']
	weights = get_config['weights']
	claims_offered_dict = request.get_json() or {}
	# print(claims_offered_dict)
	claims_offered_list = list(claims_offered_dict.keys())
	# print(claims_offered_list)
	# current_offerings = [claim in claims_on_list for claim in claims]
	metric_calculations = calc_reach_metrics(maxdiff_scores, claims_offered_list, weights)
	# print(metric_calculations['Summary_Metrics'])
	data = jsonify(metric_calculations)
	return data

# DELETE MD PROJECT FROM DB
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

@bp.route("/api/delete_subgroup_file", methods=["DELETE"])
def delete_subgroup_file_from_db():
	sgp = SubGroup().query.first()
	if sgp is None:
		return error_response(400)
	else:
		db.session.delete(sgp)
		db.session.commit()
		return jsonify([])




# UPLOAD, PROCESS SUBGROUP FILE AND SAVE TO DATABASE
@bp.route('/api/request_load_subgroup', methods=['POST'])
def request_load_subgroup():
	subgroup_fn = save_file(None, "subgroup", "xlsx")
	request.files["subgroup"].save(subgroup_fn)
	results = process_subgroup_file(subgroup_fn)
	# print(results)
	subgroups = results['subgroups']
	print(subgroups)
	utilities = results['utilities']
	# print(utilities)
	data = jsonify(subgroups)
	sgp = SubGroup()
	sgp.config = MutableDict({
		'subgroups': subgroups,
		'utilities': utilities,
	})
	print(sgp.config)
	db.session.add(sgp)
	db.session.commit()
	return data

# CHECK DB FOR SUBGROUP FILE WHEN PAGE LOADS
@bp.route('/api/check_db_for_subgroup', methods=["GET"])
def check_db_for_subgroup():
	# find first project in the db, if there is one
	sgp = SubGroup().query.first()
	print(sgp)
	# if there is no project found in the db, we have no claims. Return empty list for rendering of Upload File page
	if sgp is None:
		# print(mdp)
		return jsonify([])
	else:
		# if there is a project found in the db, get the list of claims from the project's config
		project_config = sgp.config
		subgroups= project_config['subgroups']
		# print(project_config)
		# print(project_config['utilities'])
		# print(claims)
		# jsonify the list of claims in order to be an acceptable response for the front end & return the data for rendering of Data Table
		data = jsonify(subgroups)
		return data

# CALCULATE REACH AND FAVORITE SCORES (ALL CLAIMS) FOR EACH SUBGROUP
@bp.route('/api/subgroup_reach_scores', methods=['POST'])
def subgroup_reach_scores():
	subgroup = request.get_json() # get the selected subgroup from the front end
	# print(subgroup)
	sg = [group for group in subgroup.values()] #subgroup inside of a list
	selected_sg = sg[0] # just the subgroup, not in a dict (will need to be converted to string for filtering)
	sgp = SubGroup().query.first() # get the subgroup file config
	mdp = MaxDiffProject().query.first() # get the maxdiff project config
	mdp_config = mdp.config # utils, md scores, weights & claims for the project
	claims = mdp_config['claims']
	sgp_config = sgp.config # utils and subgroups from subgroup file
	# sgp_utils = sgp.config['utilities']
	results = filter_for_subgroup(sgp_config, mdp_config, selected_sg)
	# print(results)
	filtered_md = results['filtered_md_scores']
	filtered_weight = results['filtered_weights']
	calc_sg = calc_reach_metrics(filtered_md, claims, filtered_weight)
	# print(calc_sg)
	data = jsonify(calc_sg)
	return data

@bp.route('/api/request_subgroup_summary_metrics', methods=['POST'])
def sg_summary_metrics():
	mdp = MaxDiffProject().query.first()
	mdp_config = mdp.config
	sgp = SubGroup().query.first()
	sgp_config = sgp.config
	data_from_frontend = request.get_json() or {}
	# print(data_from_frontend)
	subgroup = data_from_frontend['selectedSubgroup']
	# print(subgroup)
	claims_offered_dict = data_from_frontend['offeredClaims']
	claims_offered_list = list(claims_offered_dict.keys())
	# print(claims_offered_list)
	filter_results = filter_for_subgroup(sgp_config, mdp_config, subgroup)
	filtered_md_scores = filter_results['filtered_md_scores']
	filtered_weights = filter_results['filtered_weights']
	filtered_respid = filter_results['filtered_respid']
	number_of_respondents_per_subgroup = len(filtered_respid)
	# print(number_of_respondents_per_subgroup)
	metric_calculations = calc_reach_metrics(filtered_md_scores, claims_offered_list, filtered_weights)
	# print(metric_calculations['Summary_Metrics'])
	# number_of_respondents_for_frontend = jsonify(number_of_respondents_per_subgroup)
	# metrics_for_frontend = jsonify(metric_calculations)
	data = jsonify({"summary_metrics" : metric_calculations, "number_of_respondents" : number_of_respondents_per_subgroup})
	return data







@bp.route("/api/export_chart_to_csv", methods=["GET", "POST"])
def export_chart_to_csv():
	chart_data = request.get_json() or {}
	print(chart_data)
	if not os.path.exists(current_app.instance_path):
		os.mkdir(current_app.instance_path)
	if not os.path.exists(os.path.join(current_app.instance_path, "files")):
		os.mkdir(os.path.join(current_app.instance_path, "files"))
	csv_fn = os.path.join(
		current_app.instance_path, "files", "TURF_Chart_Simulation.csv"
	)
	turf_chart_df = generate_turf_chart_csv(chart_data)
	turf_chart_df.to_csv(csv_fn, index=False)
	print(turf_chart_df)
	return send_file(
		csv_fn,
		mimetype=(
			"text/csv"
		),
		as_attachment=True,
		cache_timeout=0,
	)


@bp.route("/api/calc_incremental_reach", methods=["GET", "POST"])
def incremental_reach():
	mdp = MaxDiffProject().query.first()
	get_config = mdp.config
	maxdiff_scores = get_config['maxdiff_scores']
	weights = get_config['weights']
	maximize_reach_data = request.get_json() or {}
	# print(maximize_reach_data)
	items_to_turn_on = maximize_reach_data["numberItemsTurnOn"]
	num_items_to_turn_on = int(items_to_turn_on)
	claims_offered_dict = maximize_reach_data["claimsOn"]
	# print(claims_offered_dict)
	claims_considered_dict = maximize_reach_data["claimsConsidered"]
	claims_considered_list = list(claims_considered_dict.keys())
	claims_offered_list = list(claims_offered_dict.keys())
	# print(claims_offered_list)
	metric_calculations = calc_reach_metrics(maxdiff_scores, claims_offered_list, weights)
	# print(metric_calculations)
	calc_max_reach = get_incremental_reach(maxdiff_scores, claims_considered_list, claims_offered_list, num_items_to_turn_on, weights)
	# print(calc_max_reach)
	data = jsonify(calc_max_reach)
	return data

