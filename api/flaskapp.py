from app import create_app, db


app = create_app()

if __name__ == "__main__":
	app.run(
		use_debugger=False,
		use_reloader=False,
		passthrough_errors=True,
	)

@app.shell_context_processor
def shell_context():
	from app import models

	ctx = {
		"db": db,
	}
	for attr in dir(models):
		model = getattr(models, attr)
		if hasattr(model, "__bases__") and db.Model in getattr(
			model, "__bases__"
		):
			ctx[attr] = model
	return ctx







