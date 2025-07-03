class CategoryModel {
  final String id;
  final String name;
  final String description;
  final String? imageUrl;
  final String companyId;

  CategoryModel({
    required this.id,
    required this.name,
    required this.description,
    required this.companyId,
    this.imageUrl,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id_category'],
      name: json['name'],
      description: json['description'] ?? '',
      companyId: json['company']?['id_company'] ?? '',
      imageUrl: json['image'], // ← CORREGIDO AQUÍ
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'company_id': companyId,
    'image_url': imageUrl,
  };
}
