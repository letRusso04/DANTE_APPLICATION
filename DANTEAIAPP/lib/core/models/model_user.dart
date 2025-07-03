class UserModel {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? jobTitle;
  final String? gender;
  final String? birthDate;
  final String role;
  final String? avatarUrl;
  final bool isActive;
  final bool isVerified;
  final String? createdAt;
  final String? updatedAt;
  final String? companyId;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.jobTitle,
    this.gender,
    this.birthDate,
    required this.role,
    this.avatarUrl,
    required this.isActive,
    required this.isVerified,
    this.createdAt,
    this.updatedAt,
    this.companyId,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id_user'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      jobTitle: json['job_title'],
      gender: json['gender'],
      birthDate: json['birth_date'],
      role: json['role'] ?? 'Usuario',
      avatarUrl: json['avatar_url'],
      isActive: json['is_active'] ?? true,
      isVerified: json['is_verified'] ?? false,
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      companyId: json['company_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_user': id,
      'name': name,
      'email': email,
      'phone': phone,
      'job_title': jobTitle,
      'gender': gender,
      'birth_date': birthDate,
      'role': role,
      'avatar_url': avatarUrl,
      'is_active': isActive,
      'is_verified': isVerified,
      'created_at': createdAt,
      'updated_at': updatedAt,
      'company_id': companyId,
    };
  }
}
