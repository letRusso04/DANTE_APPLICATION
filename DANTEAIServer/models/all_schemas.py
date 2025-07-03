from app.extensions import ma
from flask_marshmallow import Marshmallow
from models.model_user import User
from models.model_category import Category
from models.model_client import Client
from models.model_company import Company
from models.model_message import Message
from models.model_product import Product
from models.model_ticket import SupportTicket



class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash",)

    company_id = ma.auto_field()

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True
        include_fk = True



class CompanySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        load_instance = True
        exclude = ("password_hash",)

class CategorySchema(ma.SQLAlchemyAutoSchema):
    company = ma.Nested(CompanySchema)
    class Meta:
        model = Category
        load_instance = True

class ClientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Client
        load_instance = True
        include_fk = True

    # Añade el campo avatar para incluirlo en la serialización
    avatar = ma.String()
client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)


class UserSimpleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ("id_user", "name", "email", "phone", "avatar_url")  # Campos expuestos
class SupportTicketSchema(ma.SQLAlchemyAutoSchema):
    user = ma.Nested(UserSimpleSchema)  # Esto incluirá la info del usuario embebida
    user_id = ma.auto_field()

    class Meta:
        model = SupportTicket
        load_instance = True
        include_fk = True

class MessageUserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ("id_user", "name", "email", "avatar_url")

class MessageSchema(ma.SQLAlchemyAutoSchema):
    sender = ma.Nested(MessageUserSchema)
    receiver = ma.Nested(MessageUserSchema)

    class Meta:
        model = Message
        load_instance = True
        include_fk = True

message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

support_ticket_schema = SupportTicketSchema()
support_tickets_schema = SupportTicketSchema(many=True)

company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)