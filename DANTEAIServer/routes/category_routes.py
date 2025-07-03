
from index import app, db
from app.init import allowed_file
from flask import  request, jsonify
from models.model_category import Category
from models.all_schemas import category_schema, categories_schema
import os
import uuid

# -------------------- RUTAS CATEGORY --------------------
@app.route('/api/categories', methods=['POST'])
def create_category():
    name = request.form.get('name')
    description = request.form.get('description', '')
    company_id = request.form.get('company_id')
    image_file = request.files.get('image')

    if not name or not company_id:
        return jsonify({"message": "Faltan campos obligatorios"}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({"message": "Categoría ya registrada"}), 400

    filename = None
    if image_file and allowed_file(image_file.filename):
        ext = os.path.splitext(image_file.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        image_dir = os.path.join(app.instance_path, 'uploads', 'avatars')
        os.makedirs(image_dir, exist_ok=True)
        ext = os.path.splitext(image_file.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        image_path = os.path.join(image_dir, filename)
        image_file.save(image_path)
    elif image_file:
        return jsonify({"message": "Extensión de imagen no permitida"}), 400

    try:
        category = Category(
            id_category=str(uuid.uuid4()),
            name=name,
            description=description,
            image=filename,
            company_id=company_id,
        )
        db.session.add(category)
        db.session.commit()
        return category_schema.jsonify(category), 201
    except Exception as e:
        db.session.rollback()
        print("[ERROR crear categoría]", e)
        return jsonify({"message": "Error al crear categoría", "error": str(e)}), 500


@app.route('/api/categories', methods=['GET'])
def get_categories():
    company_id = request.args.get('company_id')
    print(company_id)
    if company_id:
        categories = Category.query.filter_by(company_id=company_id).order_by(Category.created_at.desc()).all()
    else:
        categories = Category.query.order_by(Category.created_at.desc()).all()

    return categories_schema.jsonify(categories), 200


@app.route('/api/categories/<id>', methods=['GET'])
def get_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"message": "Categoría no encontrada"}), 404
    return category_schema.jsonify(category), 200


@app.route('/api/categories/<id>', methods=['PUT'])
def update_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"message": "Categoría no encontrada"}), 404

    # Para actualizar con multipart/form-data y posible imagen
    if 'multipart/form-data' in request.content_type:
        name = request.form.get('name', category.name)
        description = request.form.get('description', category.description)
        image_file = request.files.get('image')
        if image_file and allowed_file(image_file.filename):
            ext = os.path.splitext(image_file.filename)[1]
            filename = f"{uuid.uuid4().hex}{ext}"
            image_path = os.path.join(app.instance_path, 'uploads', 'avatars')
            image_file.save(image_path)
            category.image = filename
        elif image_file:
            return jsonify({"message": "Extensión de imagen no permitida"}), 400
    else:
        data = request.get_json()
        name = data.get('name', category.name)
        description = data.get('description', category.description)

    category.name = name
    category.description = description

    try:
        db.session.commit()
        return category_schema.jsonify(category), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar categoría", "error": str(e)}), 500


@app.route('/api/categories/<id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"message": "Categoría no encontrada"}), 404

    try:
        db.session.delete(category)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al eliminar categoría", "error": str(e)}), 500
