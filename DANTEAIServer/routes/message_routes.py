
from index import app,  db
from flask import  request, jsonify
from models.model_message import *
from models.all_schemas import message_schema, messages_schema



# Crear mensaje
@app.route('/api/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    content = data.get('content')

    if not sender_id or not receiver_id or not content:
        return jsonify({'message': 'sender_id, receiver_id y content son requeridos'}), 400

    message = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)

    db.session.add(message)
    db.session.commit()

    return message_schema.jsonify(message), 201

# Obtener conversación entre dos usuarios
@app.route('/api/messages/<user_id>', methods=['GET'])
def get_conversation(user_id):
    other_user_id = request.args.get('other_user_id')
    if not other_user_id:
        return jsonify({'message': 'Parámetro other_user_id es requerido'}), 400

    messages = Message.query.filter(
        ((Message.sender_id == user_id) & (Message.receiver_id == other_user_id)) |
        ((Message.sender_id == other_user_id) & (Message.receiver_id == user_id))
    ).order_by(Message.created_at.asc()).all()

    return messages_schema.jsonify(messages), 200

# Marcar como leído
@app.route('/api/messages/<message_id>/read', methods=['PUT'])
def mark_message_as_read(message_id):
    message = Message.query.get(message_id)
    if not message:
        return jsonify({"message": "Mensaje no encontrado"}), 404

    message.is_read = True
    db.session.commit()

    return message_schema.jsonify(message), 200

# Eliminar mensaje
@app.route('/api/messages/<message_id>', methods=['DELETE'])
def delete_message(message_id):
    message = Message.query.get(message_id)
    if not message:
        return jsonify({"message": "Mensaje no encontrado"}), 404

    db.session.delete(message)
    db.session.commit()
    return jsonify({'message': 'Mensaje eliminado'}), 200