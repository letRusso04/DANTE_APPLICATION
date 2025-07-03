import 'dart:convert';
import 'package:danteai/core/models/model_ticket.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:danteai/core/config/config_server.dart';

class SupportTicketProvider extends ChangeNotifier {
  List<SupportTicketModel> _tickets = [];
  bool _isLoading = false;

  List<SupportTicketModel> get tickets => _tickets;
  bool get isLoading => _isLoading;

  // CREATE
  Future<SupportTicketModel?> createTicket({
    required String subject,
    required String description,
    required String userId,
  }) async {
    final url = Uri.parse('$API_URL/support/tickets');
    final body = jsonEncode({
      'subject': subject,
      'description': description,
      'user_id': userId,
    });

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: body,
      );

      if (response.statusCode == 201) {
        final json = jsonDecode(response.body);
        final newTicket = SupportTicketModel.fromJson(json);
        _tickets.insert(0, newTicket);
        notifyListeners();
        return newTicket;
      } else {
        throw Exception('Error al crear ticket');
      }
    } catch (e) {
      debugPrint('createTicket error: $e');
      return null;
    }
  }

  // READ ALL / FETCH con usuario anidado
  Future<void> fetchTickets({String? userId}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final query = userId != null ? '?user_id=$userId' : '';
      final url = Uri.parse('$API_URL/support/tickets$query');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print("data llega2 $data");
        _tickets = data
            .map((json) => SupportTicketModel.fromJson(json))
            .toList();
      } else {
        throw Exception('Error al obtener tickets');
      }
    } catch (e) {
      debugPrint('fetchTickets error: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  // READ ONE con usuario anidado
  Future<SupportTicketModel?> fetchTicketById(String ticketId) async {
    try {
      final url = Uri.parse('$API_URL/support/tickets/$ticketId');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        return SupportTicketModel.fromJson(json);
      } else {
        throw Exception('Error al obtener el ticket');
      }
    } catch (e) {
      debugPrint('fetchTicketById error: $e');
      return null;
    }
  }

  // UPDATE
  Future<bool> updateTicket(SupportTicketModel ticket) async {
    final url = Uri.parse('$API_URL/support/tickets/${ticket.id}');
    final body = jsonEncode({
      'subject': ticket.subject,
      'description': ticket.description,
      'status': ticket.status,
    });

    try {
      final response = await http.put(
        url,
        headers: {'Content-Type': 'application/json'},
        body: body,
      );

      if (response.statusCode == 200) {
        // Actualizar el ticket en la lista
        final index = _tickets.indexWhere((t) => t.id == ticket.id);
        if (index != -1) {
          _tickets[index] = ticket;
          notifyListeners();
        }
        return true;
      } else {
        throw Exception('Error al actualizar ticket');
      }
    } catch (e) {
      debugPrint('updateTicket error: $e');
      return false;
    }
  }

  // DELETE
  Future<bool> deleteTicket(String ticketId) async {
    final url = Uri.parse('$API_URL/support/tickets/$ticketId');

    try {
      final response = await http.delete(url);
      if (response.statusCode == 200) {
        _tickets.removeWhere((t) => t.id == ticketId);
        notifyListeners();
        return true;
      } else {
        throw Exception('Error al eliminar ticket');
      }
    } catch (e) {
      debugPrint('deleteTicket error: $e');
      return false;
    }
  }
}
