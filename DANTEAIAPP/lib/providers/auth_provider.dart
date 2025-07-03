import 'dart:convert';
import 'package:danteai/core/config/config_server.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  static final String _baseUrl = API_URL;

  // REGISTRO
  static Future<bool> register(Map<String, dynamic> data) async {
    final url = Uri.parse("$_baseUrl/companies");
    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    return res.statusCode == 201;
  }

  static Future<Map<String, dynamic>?> login(
    String email,
    String password,
  ) async {
    final url = Uri.parse("$_baseUrl/companies/login");
    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({"email": email, "password": password}),
    );
    print("status: ${res.body}");
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);

      // Guardar token en SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['access_token']);

      return data;
    }
    return null;
  }

  // ACTUALIZAR DATOS DE CUENTA
  static Future<bool> updateAccount(
    String id,
    String token,
    Map<String, dynamic> data,
  ) async {
    final url = Uri.parse("$_baseUrl/companies/$id");
    final res = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );
    return res.statusCode == 200;
  }

  static Future<bool> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    return true;
  }

  // ELIMINAR CUENTA
  static Future<bool> deleteAccount(String id, String token) async {
    final url = Uri.parse("$_baseUrl/companies/$id");
    final res = await http.delete(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    return res.statusCode == 204;
  }

  // OBTENER TODAS LAS EMPRESAS (opcional si lo usas)
  static Future<List<Map<String, dynamic>>?> getAllCompanies(
    String token,
  ) async {
    final url = Uri.parse("$_baseUrl/companies");
    final res = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (res.statusCode == 200)
      return List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return null;
  }
}
