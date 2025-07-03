from app.extensions import db
from datetime import datetime
from sqlalchemy.orm import relationship, backref
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id_user = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(20))
    job_title = db.Column(db.String(100))
    gender = db.Column(db.String(20))
    birth_date = db.Column(db.Date)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='Usuario')
    avatar_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    company_id = db.Column(db.String, db.ForeignKey('companies.id_company'), nullable=False)
    company = relationship('Company', backref=backref('users', lazy=True))

    def __init__(self, id_user, name, email, password, company_id,
                 role='Usuario', avatar_url=None, phone=None, job_title=None, gender=None, birth_date=None):
        self.id_user = id_user
        self.name = name
        self.email = email
        self.phone = phone
        self.job_title = job_title
        self.gender = gender
        self.birth_date = birth_date
        self.role = role
        self.avatar_url = avatar_url
        self.company_id = company_id
        self.set_password(password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
