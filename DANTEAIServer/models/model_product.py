from app.extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'
    id_product = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    category_id = db.Column(db.String, db.ForeignKey('categories.id_category'), nullable=False)
    company_id = db.Column(db.String, db.ForeignKey('companies.id_company'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = db.relationship('Category', backref=db.backref('products', lazy=True))
    company = db.relationship('Company', backref=db.backref('products', lazy=True))

