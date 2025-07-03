// providers/messages_provider.dart

import 'dart:convert';
import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_message.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class MessagesProvider with ChangeNotifier {
  List<MessageModel> _conversation = [];

  List<MessageModel> get conversation => _conversation;

  // Obtener conversación entre 2 usuarios
  Future<void> getConversation(String userId, String otherUserId) async {
    final url = Uri.parse(
      '$API_URL/messages/$userId?other_user_id=$otherUserId',
    );

    final response = await http.get(url);
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      _conversation = data.map((item) => MessageModel.fromJson(item)).toList();
      notifyListeners();
    } else {
      throw Exception('Error al obtener conversación');
    }
  }

  // Crear un nuevo mensaje
  Future<bool> createMessage({
    required String senderId,
    required String receiverId,
    required String content,
  }) async {
    final url = Uri.parse('$API_URL/messages');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'sender_id': senderId,
        'receiver_id': receiverId,
        'content': content,
      }),
    );

    if (response.statusCode == 201) {
      final message = MessageModel.fromJson(jsonDecode(response.body));
      _conversation.add(message);
      notifyListeners();
      return true;
    } else {
      return false;
    }
  }

  // Marcar mensaje como leído
  Future<bool> markAsRead(String messageId) async {
    final url = Uri.parse('$API_URL/messages/$messageId/read');
    final response = await http.put(url);

    return response.statusCode == 200;
  }

  // Eliminar un mensaje
  Future<bool> deleteMessage(String messageId) async {
    final url = Uri.parse('$API_URL/messages/$messageId');
    final response = await http.delete(url);

    if (response.statusCode == 200) {
      _conversation.removeWhere((msg) => msg.id == messageId);
      notifyListeners();
      return true;
    } else {
      return false;
    }
  }
}
