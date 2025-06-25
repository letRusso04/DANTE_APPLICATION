class Empresa {
  final String id;
  final String nombre;
  final String email;
  final String logoUrl; // opcional
  final String token; // recibido tras autenticación

  Empresa({
    required this.id,
    required this.nombre,
    required this.email,
    required this.logoUrl,
    required this.token,
  });

  factory Empresa.fromJson(Map<String, dynamic> json) => Empresa(
    id: json['id'],
    nombre: json['nombre'],
    email: json['email'],
    logoUrl: json['logo_url'] ?? '',
    token: json['token'],
  );
}
