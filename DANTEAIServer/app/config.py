# config.py

import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'DanteAligheriSystem')

    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:admin@localhost:5432/dantealigheridb'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Upload folders
    AVATAR_UPLOAD_FOLDER = os.path.join(os.path.abspath('instance'), 'uploads', 'avatars')
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

    # Extensiones de archivo permitidas
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}