class Company {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String company;
  final String rif;
  final String address;

  Company({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.company,
    required this.rif,
    required this.address,
  });

  factory Company.fromJson(Map<String, dynamic> json) => Company(
    id: json['id'],
    name: json['name'],
    email: json['email'],
    phone: json['phone'],
    company: json['company_name'],
    rif: json['rif'],
    address: json['address'],
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'phone': phone,
    'company_name': company,
    'rif': rif,
    'address': address,
  };
}
