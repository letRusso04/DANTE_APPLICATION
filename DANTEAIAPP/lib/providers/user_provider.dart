import 'dart:convert';
import 'dart:io';
import 'package:danteai/core/models/model_user.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mime/mime.dart';
import 'package:danteai/core/config/config_server.dart';
import 'package:path/path.dart';
import 'package:http_parser/http_parser.dart';

class UsersProvider with ChangeNotifier {
  final String baseUrl = "$API_URL/users";
  List<UserModel> _users = [];
  bool _isLoading = false;
  String? _errorMessage;
  UserModel? _currentUser; // Usuario actual en memoria

  UserModel? get currentUser => _currentUser;

  List<UserModel> get users => _users;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

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

  Future<bool> updateUser({
    required String id,
    String? name,
    String? email,
    String? password,
    String? phone,
    String? jobTitle,
    String? gender,
    String? birthDate,
    bool? isActive,
    bool? isVerified,
    String? role,
    File? avatarFile,
  }) async {
    final token = await _getToken();
    if (token == null) return false;

    try {
      http.Response res;

      if (avatarFile != null) {
        final uri = Uri.parse('$baseUrl/$id');
        final request = http.MultipartRequest('PUT', uri)
          ..headers['Authorization'] = 'Bearer $token';

        if (name != null) request.fields['name'] = name;
        if (email != null) request.fields['email'] = email;
        if (password != null) request.fields['password'] = password;
        if (phone != null) request.fields['phone'] = phone;
        if (jobTitle != null) request.fields['job_title'] = jobTitle;
        if (gender != null) request.fields['gender'] = gender;
        if (birthDate != null) request.fields['birth_date'] = birthDate;
        if (isActive != null) request.fields['is_active'] = isActive.toString();
        if (isVerified != null)
          request.fields['is_verified'] = isVerified.toString();
        if (role != null) request.fields['role'] = role;

        request.files.add(
          await http.MultipartFile.fromPath('avatar', avatarFile.path),
        );

        final streamedResponse = await request.send();
        res = await http.Response.fromStream(streamedResponse);
      } else {
        final body = <String, dynamic>{};

        if (name != null) body['name'] = name;
        if (email != null) body['email'] = email;
        if (password != null) body['password'] = password;
        if (phone != null) body['phone'] = phone;
        if (jobTitle != null) body['job_title'] = jobTitle;
        if (gender != null) body['gender'] = gender;
        if (birthDate != null) body['birth_date'] = birthDate;
        if (isActive != null) body['is_active'] = isActive;
        if (isVerified != null) body['is_verified'] = isVerified;
        if (role != null) body['role'] = role;

        res = await http.put(
          Uri.parse('$baseUrl/$id'),
          headers: _headers(token),
          body: jsonEncode(body),
        );
      }

      if (res.statusCode == 200) {
        final Map<String, dynamic> json = jsonDecode(res.body);
        final updatedUser = UserModel.fromJson(json);

        // Actualizar la lista local
        final index = _users.indexWhere((u) => u.id == id);
        if (index >= 0) {
          _users[index] = updatedUser;
          notifyListeners();
        }

        // Si el usuario actualizado es el actual en sesión, actualizamos _currentUser
        if (_currentUser != null && _currentUser!.id == id) {
          _currentUser = updatedUser;
        }

        return true;
      } else {
        debugPrint('Error al actualizar usuario: ${res.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Excepción al actualizar usuario: $e');
      return false;
    }
  }

  Future<bool> changePassword(
    String currentPassword,
    String newPassword,
  ) async {
    final token = await _getToken();
    final user = _currentUser;
    if (token == null || user == null) return false;

    final url = Uri.parse('$baseUrl/${user.id}/change-password');
    try {
      final res = await http.put(
        url,
        headers: _headers(token),
        body: jsonEncode({
          'current_password': currentPassword,
          'new_password': newPassword,
        }),
      );

      if (res.statusCode == 200) {
        // Puedes actualizar algo si quieres, o simplemente devolver true
        return true;
      } else {
        debugPrint('Error al cambiar contraseña: ${res.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Excepción en changePassword: $e');
      return false;
    }
  }

  Future<bool> updateAvatar(File file) async {
    final token = await _getToken(); // Tu método para obtener el JWT
    if (token == null) return false;

    final uri = Uri.parse('$baseUrl/me/avatar');

    final request = http.MultipartRequest('PUT', uri);
    request.headers['Authorization'] = 'Bearer $token';

    final mimeType = lookupMimeType(file.path);
    final multipartFile = await http.MultipartFile.fromPath(
      'avatar',
      file.path,
      contentType: mimeType != null ? MediaType.parse(mimeType) : null,
      filename: basename(file.path),
    );

    request.files.add(multipartFile);

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      // Suponiendo que el backend retorna el user actualizado
      final updatedUser = UserModel.fromJson(jsonDecode(response.body));
      _currentUser = updatedUser;
      notifyListeners();
      return true;
    } else {
      print('Error al subir avatar: ${response.body}');
      return false;
    }
  }

  Map<String, String> _headers(String token) => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  };
  // NUEVO: LOGIN USUARIO
  Future<bool> loginUser({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final uri = Uri.parse('$baseUrl/login');
      final res = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (res.statusCode == 200) {
        final Map<String, dynamic> json = jsonDecode(res.body);

        final token = json['access_token'];
        final userJson = json['user'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);
        await prefs.setString('user', jsonEncode(userJson));

        _currentUser = UserModel.fromJson(userJson);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Error de login: Datos invalidos';
      }
    } catch (e) {
      _errorMessage = 'Error de conexión: $e';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  // NUEVO: LOGOUT USUARIO
  Future<void> logoutUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');

    _currentUser = null;
    _users = [];
    notifyListeners();
  }

  Future<void> fetchUsers() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final token = await _getToken();
    final companyId = await _getCompanyId();

    if (token == null || companyId == null) {
      _errorMessage = 'No hay sesión activa o empresa.';
      _isLoading = false;
      notifyListeners();
      return;
    }

    try {
      final uri = Uri.parse('$baseUrl?company_id=$companyId');
      final res = await http.get(uri, headers: _headers(token));

      if (res.statusCode == 200) {
        final List<dynamic> data = jsonDecode(res.body);
        _users = data.map((u) => UserModel.fromJson(u)).toList();
      } else {
        _errorMessage = 'Error al cargar usuarios: ${res.statusCode}';
      }
    } catch (e) {
      _errorMessage = 'Error de conexión: $e';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> createUser({
    required String name,
    required String email,
    required String password,
    String? phone,
    String? jobTitle,
    String? gender,
    String? birthDate,
    File? avatarFile,
  }) async {
    final token = await _getToken();
    final companyId = await _getCompanyId();

    if (token == null || companyId == null) return false;

    // Aseguramos formato yyyy-MM-dd
    if (birthDate != null) {
      birthDate = birthDate.split('T').first.split(' ').first;
    }

    try {
      http.Response res;

      if (avatarFile != null) {
        final uri = Uri.parse(baseUrl);
        final request = http.MultipartRequest('POST', uri)
          ..headers['Authorization'] = 'Bearer $token'
          ..fields['name'] = name
          ..fields['email'] = email
          ..fields['password'] = password
          ..fields['role'] = 'Usuario'
          ..fields['company_id'] = companyId;

        if (phone != null) request.fields['phone'] = phone;
        if (jobTitle != null) request.fields['job_title'] = jobTitle;
        if (gender != null) request.fields['gender'] = gender;
        if (birthDate != null) request.fields['birth_date'] = birthDate;

        request.files.add(
          await http.MultipartFile.fromPath('avatar', avatarFile.path),
        );

        final streamedResponse = await request.send();
        res = await http.Response.fromStream(streamedResponse);
      } else {
        final body = {
          'name': name,
          'email': email,
          'password': password,
          'role': 'Usuario',
          'company_id': companyId,
          'phone': phone,
          'job_title': jobTitle,
          'gender': gender,
          'birth_date': birthDate,
        };

        body.removeWhere((key, value) => value == null);

        res = await http.post(
          Uri.parse(baseUrl),
          headers: _headers(token),
          body: jsonEncode(body),
        );
      }

      if (res.statusCode == 201) {
        final Map<String, dynamic> json = jsonDecode(res.body);
        final newUser = UserModel.fromJson(json);
        _users.add(newUser);
        notifyListeners();
        return true;
      } else {
        debugPrint('Error al crear usuario: ${res.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Excepción al crear usuario: $e');
      return false;
    }
  }

  Future<bool> deleteUser(String id) async {
    final token = await _getToken();
    if (token == null) return false;

    try {
      final res = await http.delete(
        Uri.parse('$baseUrl/$id'),
        headers: _headers(token),
      );
      if (res.statusCode == 200 || res.statusCode == 204) {
        _users.removeWhere((u) => u.id == id);
        notifyListeners();
        return true;
      } else {
        debugPrint('Error al eliminar usuario: ${res.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Excepción al eliminar usuario: $e');
      return false;
    }
  }
}
