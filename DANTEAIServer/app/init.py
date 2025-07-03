import os


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Carpetas de subida
def get_avatar_upload_folder(app):
    path = os.path.join(app.instance_path, 'uploads', 'avatars')
    os.makedirs(path, exist_ok=True)
    return path

def get_general_upload_folder():
    path = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(path, exist_ok=True)
    return path

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS