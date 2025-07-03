
from index import app,  db
from flask import  request, jsonify
from models.model_company import *
from models.all_schemas import company_schema, companies_schema
import os
import uuid
from werkzeug.utils import secure_filename
from flask_jwt_extended import (
     create_access_token
)
# -------------------- RUTAS COMPANY --------------------

@app.route('/api/companies', methods=['POST'])
def create_company():
    data = request.get_json()
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Campos obligatorios faltantes"}), 400

    company_id = str(uuid.uuid4())
    company = Company(
        id_company=company_id,
        name=data['name'],
        email=data['email'],
        phone=data.get('phone'),
        company_name=data.get('company_name'),
        rif=data.get('rif'),
        address=data.get('address'),
        password=data['password'],
    )
    try:
        db.session.add(company)
        db.session.commit()
        return company_schema.jsonify(company), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al guardar empresa", "error": str(e)}), 500

@app.route('/api/companies/login', methods=['POST'])
def login_company():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    company = Company.query.filter_by(email=email).first()
    if not company or not company.check_password(password):
        return jsonify({"message": "Credenciales inválidas"}), 401

    token = create_access_token(identity=company.id_company)
    return jsonify({
        "access_token": token,
        "company": company_schema.dump(company)
    }), 200

@app.route('/api/companies', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    return companies_schema.jsonify(companies), 200
