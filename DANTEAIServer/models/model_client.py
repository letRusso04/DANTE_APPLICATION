from app.extensions import db
from datetime import datetime

class Client(db.Model):
    __tablename__ = 'clients'

    id = db.Column(db.String(36), primary_key=True)
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id_company'), nullable=False)

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    document_type = db.Column(db.String(20))  # e.g., DNI, RIF, Passport
    document_number = db.Column(db.String(50), unique=True)

    avatar = db.Column(db.String(255))  # <- Nuevo campo para la imagen (ruta/nombre)

    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Relaciones
    company = db.relationship('Company', backref=db.backref('clients', lazy=True))



