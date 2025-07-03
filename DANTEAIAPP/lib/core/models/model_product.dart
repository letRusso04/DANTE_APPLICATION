class ProductModel {
  final String id;
  final String name;
  final String description;
  final double price;
  final int stock;
  final String? imageUrl;
  final bool isActive;
  final String categoryId;
  final String companyId;
  final DateTime createdAt;
  final DateTime updatedAt;

  ProductModel({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stock,
    required this.categoryId,
    required this.companyId,
    required this.createdAt,
    required this.updatedAt,
    this.imageUrl,
    this.isActive = true,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id_product'],
      name: json['name'],
      description: json['description'],
      price: (json['price'] as num).toDouble(),
      stock: json['stock'],
      imageUrl: json['image'],
      isActive: json['is_active'] ?? true,
      categoryId: json['category_id'],
      companyId: json['company_id'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() => {
    'id_product': id,
    'name': name,
    'description': description,
    'price': price,
    'stock': stock,
    'image': imageUrl,
    'is_active': isActive,
    'category_id': categoryId,
    'company_id': companyId,
    'created_at': createdAt.toIso8601String(),
    'updated_at': updatedAt.toIso8601String(),
  };
}
