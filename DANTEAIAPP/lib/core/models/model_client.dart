import 'dart:convert';

class ClientModel {
  final String id;
  final String companyId;
  final String name;
  final String email;
  final String? phone;
  final String? address;
  final String? documentType;
  final String? documentNumber;
  final bool isActive;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final String? avatar; // <-- nuevo campo

  ClientModel({
    required this.id,
    required this.companyId,
    required this.name,
    required this.email,
    this.phone,
    this.address,
    this.documentType,
    this.documentNumber,
    this.isActive = true,
    this.createdAt,
    this.updatedAt,
    this.avatar, // <-- nuevo campo en constructor
  });

  factory ClientModel.fromJson(Map<String, dynamic> json) {
    return ClientModel(
      id: json['id'],
      companyId: json['company_id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      address: json['address'],
      documentType: json['document_type'],
      documentNumber: json['document_number'],
      isActive: json['is_active'] ?? true,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : null,
      avatar: json['avatar'], // <-- agregar aquí
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'company_id': companyId,
      'name': name,
      'email': email,
      'phone': phone,
      'address': address,
      'document_type': documentType,
      'document_number': documentNumber,
      'is_active': isActive,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'avatar': avatar, // <-- agregar aquí
    };
  }

  static List<ClientModel> listFromJson(String body) {
    final List parsed = json.decode(body);
    return parsed.map((json) => ClientModel.fromJson(json)).toList();
  }
}
