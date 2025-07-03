from app.extensions import db
import uuid
from datetime import datetime

class SupportTicket(db.Model):
    __tablename__ = 'support_tickets'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    subject = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Abierto')  # Abierto, En Progreso, Cerrado
    user_id = db.Column(db.String(36), db.ForeignKey('users.id_user'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    user = db.relationship('User', backref='support_tickets')