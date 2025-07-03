import 'dart:convert';
import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_client.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path/path.dart';
import 'dart:io';

class ClientsProvider with ChangeNotifier {
  final List<ClientModel> _clients = [];
  bool isLoading = false;

  List<ClientModel> get clients => [..._clients];
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<String?> _getCompanyId() async {
    final prefs = await SharedPreferences.getInstance();
    final companyData = prefs.getString('company');

    if (companyData != null) {
      final companyJson = jsonDecode(companyData);
      return companyJson['id_company'];
    }
    return null;
  }

  Future<void> fetchClients() async {
    isLoading = true;
    notifyListeners();

    final token = await _getToken();
    final companyId = await _getCompanyId();
    final url = Uri.parse('$API_URL/clients?company_id=$companyId');

    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      _clients.clear();
      _clients.addAll(ClientModel.listFromJson(response.body));
    }

    isLoading = false;
    notifyListeners();
  }

  Future<bool> createClient({
    required String name,
    required String email,
    String? phone,
    String? address,
    String? documentType,
    String? documentNumber,
    File? imageFile,
  }) async {
    final token = await _getToken();
    final companyId = await _getCompanyId();

    final uri = Uri.parse('$API_URL/clients');

    final request = http.MultipartRequest('POST', uri);

    // Headers con Authorization
    request.headers['Authorization'] = 'Bearer $token';

    // Campos normales (form fields)
    request.fields['name'] = name;
    request.fields['email'] = email;
    if (phone != null) request.fields['phone'] = phone;
    if (address != null) request.fields['address'] = address;
    if (documentType != null) request.fields['document_type'] = documentType;
    if (documentNumber != null)
      request.fields['document_number'] = documentNumber;
    if (companyId != null) request.fields['company_id'] = companyId;

    // Adjuntar imagen si existe
    if (imageFile != null) {
      final fileStream = http.ByteStream(imageFile.openRead());
      final length = await imageFile.length();

      final multipartFile = http.MultipartFile(
        'avatar', // nombre esperado en el backend
        fileStream,
        length,
        filename: basename(imageFile.path),
      );

      request.files.add(multipartFile);
    }

    // Enviar petición
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      final client = ClientModel.fromJson(jsonDecode(response.body));
      _clients.insert(0, client);
      notifyListeners();
      return true;
    } else {
      print(
        'Error al crear cliente: ${response.statusCode} - ${response.body}',
      );
      return false;
    }
  }

  Future<bool> updateClient(
    String id, {
    String? name,
    String? email,
    String? phone,
    String? address,
    String? documentType,
    String? documentNumber,
    bool? isActive,
  }) async {
    final token = await _getToken();
    final url = Uri.parse('$API_URL/clients/$id');

    final response = await http.put(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'name': name,
        'email': email,
        'phone': phone,
        'address': address,
        'document_type': documentType,
        'document_number': documentNumber,
        'is_active': isActive,
      }),
    );

    if (response.statusCode == 200) {
      final updatedClient = ClientModel.fromJson(jsonDecode(response.body));
      final index = _clients.indexWhere((c) => c.id == id);
      if (index != -1) {
        _clients[index] = updatedClient;
        notifyListeners();
      }
      return true;
    }

    return false;
  }

  Future<bool> deleteClient(String id) async {
    final token = await _getToken();
    final url = Uri.parse('$API_URL/clients/$id');

    final response = await http.delete(
      url,
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 204) {
      _clients.removeWhere((c) => c.id == id);
      notifyListeners();
      return true;
    }

    return false;
  }

  ClientModel? getClientById(String id) {
    return _clients.firstWhere(
      (c) => c.id == id,
      orElse: () => null as ClientModel,
    );
  }
}
