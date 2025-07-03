from index import app,  db
from flask import  request, jsonify, abort
from models.model_ticket import *
from models.all_schemas import support_ticket_schema, support_tickets_schema



# -------------------- TICKET -------------------
@app.route('/api/support/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    subject = data.get('subject')
    description = data.get('description')
    user_id = data.get('user_id')  # ahora debe venir explícito en el JSON

    if not subject or not description or not user_id:
        return jsonify({'msg': 'subject, description and user_id are required'}), 400

    ticket = SupportTicket(subject=subject, description=description, user_id=user_id)
    db.session.add(ticket)
    db.session.commit()

    return support_ticket_schema.jsonify(ticket), 201

@app.route('/api/support/tickets', methods=['GET'])
def get_tickets():
    tickets = SupportTicket.query.order_by(SupportTicket.created_at.desc()).all()

    return support_tickets_schema.jsonify(tickets), 200

@app.route('/api/support/tickets/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    ticket = SupportTicket.query.get(ticket_id)
    if not ticket:
        abort(404, 'Ticket no encontrado')
    return support_ticket_schema.jsonify(ticket), 200

@app.route('/api/support/tickets/<ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    ticket = SupportTicket.query.get(ticket_id)
    if not ticket:
        abort(404, 'Ticket no encontrado')
    data = request.json

    ticket.subject = data.get('subject', ticket.subject)
    ticket.description = data.get('description', ticket.description)
    ticket.status = data.get('status', ticket.status)
    db.session.commit()

    return support_ticket_schema.jsonify(ticket), 200

@app.route('/api/support/tickets/<ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    ticket = SupportTicket.query.get(ticket_id)
    if not ticket:
        abort(404, 'Ticket no encontrado')
    db.session.delete(ticket)
    db.session.commit()
    return jsonify({'msg': 'Ticket eliminado'}), 200