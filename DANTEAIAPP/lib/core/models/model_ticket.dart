import 'package:danteai/core/models/model_user.dart';

class SupportTicketModel {
  final String id;
  final String subject;
  final String description;
  final String status;
  final DateTime createdAt;
  final DateTime? updatedAt; // <-- Puede venir null
  final String userId;
  final UserModel? user;

  SupportTicketModel({
    required this.id,
    required this.subject,
    required this.description,
    required this.status,
    required this.createdAt,
    this.updatedAt,
    required this.userId,
    this.user,
  });

  factory SupportTicketModel.fromJson(Map<String, dynamic> json) {
    return SupportTicketModel(
      id: json['id'] as String,
      subject: json['subject'] as String,
      description: json['description'] as String,
      status: json['status'] as String,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
      userId: json['user_id'] as String,
      user: json['user'] != null ? UserModel.fromJson(json['user']) : null,
    );
  }
}
