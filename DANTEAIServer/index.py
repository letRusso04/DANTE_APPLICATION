
from flask import Flask
import os
from app.extensions import db, ma, jwt
from app.config import Config  # <-- Importamos la clase

app = Flask(__name__)

# Config DB
app = Flask(__name__)
app.config.from_object(Config)

# Vincula la app con las extensiones
db.init_app(app)
ma.init_app(app)
jwt.init_app(app)

# IMPORTACION DE TODOS LOS MODELOS
from models.model_user import User
from models.model_product import Product
from models.model_company import Company
from models.model_category import Category
from models.model_client import Client
from models.model_ticket import SupportTicket
from models.model_message import Message

from routes.category_routes import *
from routes.client_routes import *
from routes.company_routes import *
from routes.ticket_routes import *
from routes.message_routes import *
from routes.ticket_routes import *
from routes.product_routes import *

if __name__ == '__main__':
    with app.app_context():
        db.create_all()


    app.run(debug=True, host='0.0.0.0')