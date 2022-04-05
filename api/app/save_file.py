import os

from flask import current_app


def save_file(data, name, ext, save=True, user=None):
    """
    Used to generate and/or save files to the flask instance.
    user: provide to store in a subdirectory with the username
    """
    if not os.path.exists(current_app.instance_path):
        os.mkdir(current_app.instance_path)
    if not os.path.exists(os.path.join(current_app.instance_path, "files")):
        os.mkdir(os.path.join(current_app.instance_path, "files"))

    if user is not None:
        if not os.path.exists(
            os.path.join(current_app.instance_path, "files", user)
        ):
            os.mkdir(os.path.join(current_app.instance_path, "files", user))
        filename = os.path.join(
            current_app.instance_path, "files", user, f"{name}.{ext}"
        )
    else:
        filename = os.path.join(
            current_app.instance_path, "files", f"{name}.{ext}"
        )
    if data and save:
        data.save(filename)
    return filename