from app.extensions import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'
    id_category = db.Column(db.String, primary_key=True)
    typeon = db.Column(db.Integer, nullable=False) 
    name = db.Column(db.String(120), nullable=False, unique=True)
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))
    company_id = db.Column(db.String, db.ForeignKey('companies.id_company'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = db.relationship('Company', backref=db.backref('categories', lazy=True))

    def __init__(self, id_category,typeon, name, description=None, image=None, company_id=None):
        self.id_category = id_category
        self.typeon = typeon
        self.name = name
        self.description = description
        self.image = image
        self.company_id = company_id

