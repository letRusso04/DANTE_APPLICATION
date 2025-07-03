
from index import app, db
from app.init import allowed_file

from flask import  request, jsonify
from models.model_product import *
from models.all_schemas import product_schema, products_schema
import os
import uuid


# --------------------- PRODUCTOS ----------

@app.route('/api/products', methods=['POST'])
def create_product():
    name = request.form.get('name')
    description = request.form.get('description', '')
    price = request.form.get('price', type=float)
    stock = request.form.get('stock', type=int)
    category_id = request.form.get('category_id')
    company_id = request.form.get('company_id')
    image_file = request.files.get('image')

    if not all([name, price, stock, category_id, company_id]):
        return jsonify({"message": "Faltan campos requeridos"}), 400

    filename = None
    if image_file and allowed_file(image_file.filename):
        ext = os.path.splitext(image_file.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        image_path = os.path.join(app.config['AVATAR_UPLOAD_FOLDER'], filename)
        image_file.save(image_path)

    product = Product(
        id_product=str(uuid.uuid4()),
        name=name,
        description=description,
        price=price,
        stock=stock,
        image=filename,
        category_id=category_id,
        company_id=company_id,
    )

    try:
        db.session.add(product)
        db.session.commit()
        return product_schema.jsonify(product), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al crear producto", "error": str(e)}), 500
    

@app.route('/api/products', methods=['GET'])
def get_products():
    company_id = request.args.get('company_id')
    if company_id:
        products = Product.query.filter_by(company_id=company_id).order_by(Product.created_at.desc()).all()
    else:
        products = Product.query.order_by(Product.created_at.desc()).all()
    return products_schema.jsonify(products), 200

@app.route('/api/products/<id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Producto no encontrado"}), 404

    if 'multipart/form-data' in request.content_type:
        name = request.form.get('name', product.name)
        description = request.form.get('description', product.description)
        price = request.form.get('price', type=float) or product.price
        stock = request.form.get('stock', type=int) or product.stock
        is_active = request.form.get('is_active', 'true').lower() == 'true'
        category_id = request.form.get('category_id', product.category_id)
        image_file = request.files.get('image')

        if image_file and allowed_file(image_file.filename):
            ext = os.path.splitext(image_file.filename)[1]
            filename = f"{uuid.uuid4().hex}{ext}"
            image_path = os.path.join(app.config['AVATAR_UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            product.image = filename

    else:
        data = request.get_json()
        name = data.get('name', product.name)
        description = data.get('description', product.description)
        price = data.get('price', product.price)
        stock = data.get('stock', product.stock)
        is_active = data.get('is_active', product.is_active)
        category_id = data.get('category_id', product.category_id)

    product.name = name
    product.description = description
    product.price = price
    product.stock = stock
    product.is_active = is_active
    product.category_id = category_id

    try:
        db.session.commit()
        return product_schema.jsonify(product), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar", "error": str(e)}), 500

@app.route('/api/products/<id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Producto no encontrado"}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al eliminar", "error": str(e)}), 500    

