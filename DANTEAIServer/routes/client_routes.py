
from index import app,  db
from flask import  request, jsonify
from models.model_client import *
from models.all_schemas import client_schema, clients_schema
import os
import uuid
from werkzeug.utils import secure_filename

@app.route('/api/clients', methods=['POST'])
def create_client():
    company_id = request.form.get('company_id')
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    address = request.form.get('address')
    document_type = request.form.get('document_type')
    document_number = request.form.get('document_number')
    category_id = request.form.get('category_id')

    file = request.files.get('avatar')
    avatar_filename = None
    if file:
        filename = secure_filename(file.filename)
        unique_name = f"{uuid.uuid4()}_{filename}"
        upload_folder = app.config['AVATAR_UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, unique_name)
        file.save(file_path)
        avatar_filename = unique_name

    client = Client(
        id=str(uuid.uuid4()),
        company_id=company_id,
        category_id=category_id,
        name=name,
        email=email,
        phone=phone,
        address=address,
        document_type=document_type,
        document_number=document_number,
        avatar=avatar_filename,
        is_active=True,
    )

    db.session.add(client)
    db.session.commit()

    return client_schema.jsonify(client), 201


@app.route('/api/clients', methods=['GET'])
def get_clients():
    # Obtener company_id desde query param
    company_id = request.args.get('company_id')
    if not company_id:
        return {"msg": "Falta el parámetro company_id"}, 400
    
    clients = Client.query.filter_by(company_id=company_id).order_by(Client.created_at.desc()).all()
    return clients_schema.jsonify(clients), 200

@app.route('/api/clients/<id>', methods=['GET'])
def get_client(id):
    client = Client.query.get(id)
    if not client:
        return jsonify({"message": "Cliente no encontrado"}), 404
    return client_schema.jsonify(client), 200

@app.route('/api/clients/<id>', methods=['PUT'])
def update_client(id):
    client = Client.query.get(id)
    if not client:
        return jsonify({"message": "Cliente no encontrado"}), 404

    # Leer campos desde request.form
    client.name = request.form.get('name', client.name)
    client.email = request.form.get('email', client.email)
    client.phone = request.form.get('phone', client.phone)
    client.address = request.form.get('address', client.address)
    client.document_type = request.form.get('document_type', client.document_type)
    client.document_number = request.form.get('document_number', client.document_number)
    client.category_id = request.form.get('category_id', client.category_id)
    client.company_id = request.form.get('company_id', client.company_id)

    # Procesar avatar si viene uno nuevo
    if 'avatar' in request.files:
        avatar = request.files['avatar']
        if avatar.filename != '':
            from werkzeug.utils import secure_filename
            import os, uuid

            UPLOAD_FOLDER = os.path.join(app.instance_path, 'uploads', 'avatars')
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)

            filename = f"{uuid.uuid4()}_{secure_filename(avatar.filename)}"
            avatar_path = os.path.join(UPLOAD_FOLDER, filename)
            avatar.save(avatar_path)

            # Elimina el avatar anterior si existe
            if client.avatar:
                old_path = os.path.join(UPLOAD_FOLDER, client.avatar)
                if os.path.exists(old_path):
                    os.remove(old_path)

            client.avatar = filename

    try:
        db.session.commit()
        return client_schema.jsonify(client), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar cliente", "error": str(e)}), 500



@app.route('/api/clients/<id>', methods=['DELETE'])
def delete_client(id):
    client = Client.query.get(id)
    if not client:
        return jsonify({"message": "Cliente no encontrado"}), 404

    try:
        db.session.delete(client)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al eliminar cliente", "error": str(e)}), 500
