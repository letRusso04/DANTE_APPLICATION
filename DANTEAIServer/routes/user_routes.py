from app.init import allowed_file
from index import app, db
from flask import  request, jsonify, abort, send_from_directory
from models.model_user import *
from models.model_message import Message
from models.all_schemas import user_schema, users_schema, company_schema
import os
import uuid
from werkzeug.utils import secure_filename
from flask_jwt_extended import (
   create_access_token
)
import mimetypes
from sqlalchemy import func
# -------------------- RUTAS USERS --------------------
@app.route('/api/users/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email y contraseña son obligatorios"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Credenciales inválidas"}), 401

    # Crear token con id_user
    token = create_access_token(identity=user.id_user)

    user_data = user_schema.dump(user)
    # Puedes personalizar qué datos devolver aquí, por ejemplo quitar password hash
    # user_schema ya excluye password_hash, así que está ok.

    # También incluir info de company en user_data si quieres:
    if user.company:
        user_data['company'] = company_schema.dump(user.company)

    return jsonify({
        "access_token": token,
        "user": user_data
    }), 200

@app.route('/api/users/<string:id_user>/change-password', methods=['PUT'])
def change_password(id_user):
    user = User.query.get(id_user)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"message": "Faltan campos"}), 400

    if not user.check_password(current_password):
        return jsonify({"message": "Contraseña actual incorrecta"}), 401

    user.set_password(new_password)
    try:
        db.session.commit()
        return jsonify({"message": "Contraseña actualizada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error actualizando contraseña", "error": str(e)}), 500


@app.route('/api/users', methods=['GET'])
def get_users():
    company_id = request.args.get('company_id')
    if not company_id:
        return users_schema.jsonify([]), 200
    users = User.query.filter_by(company_id=company_id).all()
    return users_schema.jsonify(users), 200


@app.route('/api/users/<string:user_id>/avatar', methods=['PUT'])
def update_avatar(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if 'avatar' not in request.files:
        return jsonify({"msg": "No se envió ningún archivo"}), 400

    avatar = request.files['avatar']

    if avatar.filename == '':
        return jsonify({"msg": "Nombre de archivo vacío"}), 400

    if not avatar.content_type.startswith('image/'):
        return jsonify({"msg": "El archivo debe ser una imagen"}), 400

    filename = secure_filename(avatar.filename)
    ext = os.path.splitext(filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{ext}"

    upload_dir = os.path.join(app.instance_path, 'uploads', 'avatars')
    os.makedirs(upload_dir, exist_ok=True)

    if user.avatar_url:
        old_path = os.path.join(upload_dir, user.avatar_url)
        if os.path.exists(old_path):
            os.remove(old_path)

    file_path = os.path.join(upload_dir, unique_filename)
    avatar.save(file_path)

    user.avatar_url = unique_filename
    db.session.commit()

    return user_schema.dump(user), 200


@app.route('/api/users/<id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    return user_schema.jsonify(user), 200

@app.route('/api/users', methods=['POST'])
def create_user():
    # Diferenciar si es JSON o multipart/form-data
    if 'application/json' in request.content_type:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'Usuario')
        company_id = data.get('company_id')
        phone = data.get('phone')
        job_title = data.get('job_title')
        gender = data.get('gender')
        birth_date = data.get('birth_date')
        avatar_url = None
    else:
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        role = request.form.get('role', 'Usuario')
        company_id = request.form.get('company_id')
        phone = request.form.get('phone')
        job_title = request.form.get('job_title')
        gender = request.form.get('gender')
        birth_date = request.form.get('birth_date')
        avatar_url = None

        if 'avatar' in request.files:
            file = request.files['avatar']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")

                uploads_folder = os.path.join(app.instance_path, 'uploads', 'avatars')
                os.makedirs(uploads_folder, exist_ok=True)  # crear carpeta si no existe

                file_path = os.path.join(uploads_folder, filename)
                try:
                    file.save(file_path)
                    avatar_url = filename
                except Exception as e:
                    return jsonify({"message": "Error guardando el avatar", "error": str(e)}), 500

    # Validar campos obligatorios
    if not name or not email or not password or not company_id:
        return jsonify({"message": "Faltan campos obligatorios"}), 400

    # Verificar si email ya existe
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email ya registrado"}), 400

    try:
        user = User(
            id_user=str(uuid.uuid4()),
            name=name,
            email=email,
            password=password,
            role=role,
            company_id=company_id,
            avatar_url=avatar_url,
            phone=phone,
            job_title=job_title,
            gender=gender,
            birth_date=datetime.strptime(birth_date, '%Y-%m-%d') if birth_date else None
        )
        db.session.add(user)
        db.session.commit()
        return user_schema.jsonify(user), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creando usuario", "error": str(e)}), 500
@app.route('/api/users/<id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    is_json = 'application/json' in request.content_type
    data = request.get_json() if is_json else request.form
    updated = False

    # --- Email ---
    if 'email' in data:
        new_email = data['email'].strip().lower()
        current_email = (user.email or "").strip().lower()
        if new_email != current_email:
            existing_user = User.query.filter(
                func.lower(User.email) == new_email.lower(),
                User.id_user != id
            ).first()
            if existing_user:
                return jsonify({"message": "El correo ya está registrado por otro usuario"}), 400
            user.email = new_email
            updated = True
    # Estado activo
    if 'is_active' in data:
        is_active = data['is_active']
        if isinstance(is_active, str):
            is_active = is_active.lower() == 'true'
        if is_active != user.is_active:
            user.is_active = is_active
            updated = True

    # Estado verificado
    if 'is_verified' in data:
        is_verified = data['is_verified']
        if isinstance(is_verified, str):
            is_verified = is_verified.lower() == 'true'
        if is_verified != user.is_verified:
            user.is_verified = is_verified
            updated = True
    # --- Otros campos ---
    campos = [
        ('name', 'name'),
        ('role', 'role'),
        ('phone', 'phone'),
        ('job_title', 'job_title'),
        ('gender', 'gender'),
    ]
    for campo_front, campo_model in campos:
        if campo_front in data:
            valor_nuevo = data.get(campo_front)
            valor_actual = getattr(user, campo_model)
            if str(valor_actual) != str(valor_nuevo):
                setattr(user, campo_model, valor_nuevo)
                updated = True

    # --- Fecha de nacimiento ---
    if 'birth_date' in data:
        try:
            nueva_fecha = datetime.strptime(data['birth_date'], '%Y-%m-%d')
            if user.birth_date != nueva_fecha:
                user.birth_date = nueva_fecha
                updated = True
        except Exception:
            pass

    # --- Contraseña ---
    if 'password' in data and data['password']:
        user.set_password(data['password'])
        updated = True

    # --- Imagen/avatar ---
    if not is_json and 'avatar' in request.files:
        avatar = request.files['avatar']
        if avatar and avatar.filename != '':
            if avatar.content_type.startswith('image/'):
                filename = secure_filename(avatar.filename)
                ext = os.path.splitext(filename)[1]
                unique_filename = f"{uuid.uuid4().hex}{ext}"

                upload_dir = os.path.join(app.instance_path, 'uploads', 'avatars')
                os.makedirs(upload_dir, exist_ok=True)

                # Eliminar antiguo
                if user.avatar_url:
                    old_path = os.path.join(upload_dir, user.avatar_url)
                    if os.path.exists(old_path):
                        os.remove(old_path)

                # Guardar nuevo
                avatar.save(os.path.join(upload_dir, unique_filename))
                user.avatar_url = unique_filename
                updated = True
            else:
                return jsonify({"message": "El archivo debe ser una imagen"}), 400

    if not updated:
        return jsonify({"message": "No hay cambios para actualizar"}), 200

    try:
        db.session.commit()
        return user_schema.jsonify(user), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "Error actualizando", "error": str(e)}), 500

@app.route('/api/users/<id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    try:
        # Borrar mensajes donde el usuario es receptor o emisor
        Message.query.filter(
            (Message.receiver_id == id) | (Message.sender_id == id)
        ).delete(synchronize_session=False)
        db.session.delete(user)
        db.session.commit()
        return '', 204
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "Error eliminando", "error": str(e)}), 500
@app.route('/api/uploads/avatars/<filename>')
def uploaded_file(filename):
    file_path = os.path.join(app.instance_path, 'uploads', 'avatars')
    print(f"[DEBUG] Ruta del archivo solicitado: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"[ERROR] Archivo no encontrado: {file_path}")
        abort(404)

    mimetype, _ = mimetypes.guess_type(file_path)
    print(f"[DEBUG] Mimetype detectado: {mimetype}")
    
    if not mimetype:
        mimetype = 'application/octet-stream'
        print(f"[WARNING] Mimetype no detectado, se usa fallback: {mimetype}")

    print(f"[INFO] Enviando archivo: {filename} con mimetype: {mimetype}")
    return send_from_directory(app.config['AVATAR_UPLOAD_FOLDER'], filename, mimetype=mimetype)
