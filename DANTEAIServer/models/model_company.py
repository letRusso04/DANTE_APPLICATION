from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Company(db.Model):
    __tablename__ = 'companies'
    id_company = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(50))
    company_name = db.Column(db.String(150))
    rif = db.Column(db.String(50))
    address = db.Column(db.String(250))
    password_hash = db.Column(db.String(256))

    def __init__(self, id_company, name, email, phone, company_name, rif, address, password=None):
        self.id_company = id_company
        self.name = name
        self.email = email
        self.phone = phone
        self.company_name = company_name
        self.rif = rif
        self.address = address
        if password:
            self.set_password(password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

