import 'dart:convert';
import 'dart:io';
import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_category.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class CategoryProvider with ChangeNotifier {
  List<CategoryModel> _categories = [];
  bool _isLoading = false;

  List<CategoryModel> get categories => _categories;
  bool get isLoading => _isLoading;

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

  Future<void> fetchCategories() async {
    _isLoading = true;
    notifyListeners();

    final token = await _getToken();
    final companyId = await _getCompanyId();
    final url = Uri.parse('$API_URL/categories?company_id=$companyId');

    try {
      final res = await http.get(
        url,
        headers: {HttpHeaders.authorizationHeader: 'Bearer $token'},
      );

      if (res.statusCode == 200) {
        final List<dynamic> jsonList = json.decode(res.body);
        print("lista $jsonList");
        _categories = jsonList.map((e) => CategoryModel.fromJson(e)).toList();
      } else {
        throw Exception("Error al cargar categorías");
      }
    } catch (e) {
      print("Error al obtener categorías: $e");
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> createCategory({
    required String name,
    required String description,
    File? imageFile,
  }) async {
    final token = await _getToken();
    final companyId = await _getCompanyId();
    final uri = Uri.parse('$API_URL/categories');

    var request = http.MultipartRequest('POST', uri);
    request.headers[HttpHeaders.authorizationHeader] = 'Bearer $token';
    request.fields['name'] = name;
    request.fields['description'] = description;
    request.fields['company_id'] = companyId!;

    if (imageFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );
    }

    try {
      final response = await request.send();
      if (response.statusCode == 201) {
        await fetchCategories();
        return true;
      }
    } catch (e) {
      print("Error creando categoría: $e");
    }

    return false;
  }

  Future<bool> updateCategory({
    required String id,
    required String name,
    required String description,
    File? imageFile,
  }) async {
    final token = await _getToken();
    final uri = Uri.parse('$API_URL/categories/$id');

    var request = http.MultipartRequest('PUT', uri);
    request.headers[HttpHeaders.authorizationHeader] = 'Bearer $token';
    request.fields['name'] = name;
    request.fields['description'] = description;

    if (imageFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );
    }

    try {
      final response = await request.send();
      if (response.statusCode == 200) {
        await fetchCategories();
        return true;
      }
    } catch (e) {
      print("Error actualizando categoría: $e");
    }

    return false;
  }

  Future<bool> deleteCategory(String id) async {
    final token = await _getToken();
    final uri = Uri.parse('$API_URL/categories/$id');

    try {
      final response = await http.delete(
        uri,
        headers: {HttpHeaders.authorizationHeader: 'Bearer $token'},
      );

      if (response.statusCode == 204) {
        _categories.removeWhere((cat) => cat.id == id);
        notifyListeners();
        return true;
      }
    } catch (e) {
      print("Error eliminando categoría: $e");
    }

    return false;
  }
}
