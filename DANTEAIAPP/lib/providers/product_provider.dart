import 'dart:convert';
import 'dart:io';
import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_product.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProductsProvider with ChangeNotifier {
  List<ProductModel> _products = [];
  bool isLoading = false;

  List<ProductModel> get products => _products;

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

  Future<void> fetchProducts() async {
    isLoading = true;
    notifyListeners();

    final token = await _getToken();
    final companyId = await _getCompanyId();
    if (token == null || companyId == null) return;

    final url = Uri.parse('$API_URL/products?company_id=$companyId');
    final res = await http.get(
      url,
      headers: {'Authorization': 'Bearer $token'},
    );

    if (res.statusCode == 200) {
      final List<dynamic> data = json.decode(res.body);
      _products = data.map((e) => ProductModel.fromJson(e)).toList();
    }

    isLoading = false;
    notifyListeners();
  }

  Future<bool> createProduct({
    required String name,
    required String description,
    required double price,
    required int stock,
    required String categoryId,
    File? imageFile,
  }) async {
    final token = await _getToken();
    final companyId = await _getCompanyId();
    if (token == null || companyId == null) return false;

    final uri = Uri.parse('$API_URL/products');
    final request = http.MultipartRequest('POST', uri)
      ..headers['Authorization'] = 'Bearer $token'
      ..fields['name'] = name
      ..fields['description'] = description
      ..fields['price'] = price.toString()
      ..fields['stock'] = stock.toString()
      ..fields['category_id'] = categoryId
      ..fields['company_id'] = companyId;

    if (imageFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );
    }

    final res = await request.send();
    if (res.statusCode == 201) {
      await fetchProducts();
      return true;
    }
    return false;
  }

  List<ProductModel> productsByCategory(String categoryId) {
    return _products.where((p) => p.categoryId == categoryId).toList();
  }

  Future<bool> updateProduct({
    required String productId,
    String? name,
    String? description,
    double? price,
    int? stock,
    String? categoryId,
    File? imageFile,
  }) async {
    final token = await _getToken();
    if (token == null) return false;

    final uri = Uri.parse('$API_URL/products/$productId');
    final request = http.MultipartRequest('PUT', uri)
      ..headers['Authorization'] = 'Bearer $token';

    if (name != null) request.fields['name'] = name;
    if (description != null) request.fields['description'] = description;
    if (price != null) request.fields['price'] = price.toString();
    if (stock != null) request.fields['stock'] = stock.toString();
    if (categoryId != null) request.fields['category_id'] = categoryId;

    if (imageFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );
    }

    final res = await request.send();
    if (res.statusCode == 200) {
      await fetchProducts();
      return true;
    }
    return false;
  }

  Future<bool> deleteProduct(String productId) async {
    final token = await _getToken();
    if (token == null) return false;

    final url = Uri.parse('$API_URL/products/$productId');
    final res = await http.delete(
      url,
      headers: {'Authorization': 'Bearer $token'},
    );

    if (res.statusCode == 204) {
      _products.removeWhere((p) => p.id == productId);
      notifyListeners();
      return true;
    }
    return false;
  }
}
