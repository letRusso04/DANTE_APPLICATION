// Este es un archivo base para rediseñar el Panel de Control de Usuarios
// con una apariencia moderna, elegante y conectado completamente a tu API REST.
// Se basa en tu lógica, estructura y Providers existentes.

import 'dart:io';

import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_user.dart';
import 'package:danteai/features/users/widgets/LoginAsUserDialog.dart';
import 'package:danteai/providers/user_provider.dart';
import 'package:danteai/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class UsersPanelPage extends StatefulWidget {
  const UsersPanelPage({Key? key}) : super(key: key);

  @override
  State<UsersPanelPage> createState() => _UsersPanelPageState();
}

class _UsersPanelPageState extends State<UsersPanelPage> {
  String _searchTerm = '';

  @override
  void initState() {
    super.initState();
    Provider.of<UsersProvider>(context, listen: false).fetchUsers();
  }

  void _handleLogout() async {
    final result = await AuthProvider.logout();
    if (result && mounted) {
      GoRouter.of(context).go('/login');
    }
  }

  void _openCreateUserDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent, // clave para quitar el blanco

      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => const AddUserDialog(),
    );
  }

  void _openCreateUserModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent, // clave para quitar el blanco
      builder: (_) => const AddUserDialog(),
    );
  }

  void _showLoginAsUserDialog(UserModel user) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => LoginAsUserDialog(user: user),
    );
  }

  @override
  Widget build(BuildContext context) {
    final usersProvider = Provider.of<UsersProvider>(context);
    final users = usersProvider.users
        .where((u) => u.name.toLowerCase().contains(_searchTerm.toLowerCase()))
        .toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0E0E0E),
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.logout, color: Colors.white),
          onPressed: _handleLogout,
        ),
        title: const Text(
          'Gestión de Usuarios',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color.fromARGB(240, 240, 240, 255),
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add, color: Colors.white),
            onPressed: _openCreateUserDialog,
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              onChanged: (val) => setState(() => _searchTerm = val),
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Buscar usuarios...',
                hintStyle: const TextStyle(color: Colors.grey),
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                filled: true,
                fillColor: const Color(0xFF1A1A1A),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
        ),
      ),
      body: usersProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : users.isEmpty
          ? const Center(
              child: Text(
                'No se encontraron usuarios',
                style: TextStyle(color: Colors.white70),
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(12.0),
              child: GridView.builder(
                itemCount: users.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.75,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemBuilder: (context, index) {
                  final user = users[index];

                  return InkWell(
                    onTap: () => _showLoginAsUserDialog(user),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E1E1E),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              radius: 40,
                              backgroundImage:
                                  user.avatarUrl?.isNotEmpty == true
                                  ? NetworkImage('$API_AVATAR${user.avatarUrl}')
                                  : const AssetImage(
                                          'assets/avatar_placeholder.png',
                                        )
                                        as ImageProvider,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              user.name,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              user.email,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: user.role == 'Usuario'
                                    ? const Color.fromARGB(255, 22, 82, 24)
                                    : Colors.red,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                user.role,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton.icon(
                              onPressed: () => _showLoginAsUserDialog(user),
                              icon: const Icon(Icons.login),
                              label: const Text(
                                "Conectar",
                                style: TextStyle(color: Colors.white),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color.fromARGB(
                                  255,
                                  1,
                                  2,
                                  59,
                                ),
                                minimumSize: const Size.fromHeight(36),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}

class AddUserDialog extends StatefulWidget {
  const AddUserDialog({Key? key}) : super(key: key);

  @override
  State<AddUserDialog> createState() => _AddUserDialogState();
}

class _AddUserDialogState extends State<AddUserDialog> {
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _picker = ImagePicker();

  String _name = '';
  String _email = '';
  String _password = '';
  String _phone = '';
  String _selectedCountryCode = '+1';
  String _jobTitle = '';
  String _gender = 'Masculino';
  DateTime? _birthDate;
  XFile? _imageFile;

  final List<String> _countryCodes = [
    '+1', // USA, Canada, Puerto Rico
    '+52', // Mexico
    '+507', // Panama
    '+505', // Nicaragua
    '+506', // Costa Rica
    '+503', // El Salvador
    '+502', // Guatemala
    '+504', // Honduras
    '+58', // Venezuela
    '+57', // Colombia
    '+56', // Chile
    '+55', // Brazil
    '+54', // Argentina
    '+53', // Cuba
    '+51', // Peru
    '+591', // Bolivia
    '+598', // Uruguay
    '+595', // Paraguay
    '+593', // Ecuador
    '+592', // Guyana
    '+597', // Suriname
    '+596', // Martinique
  ];

  Future<void> _pickImage() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
    );
    if (picked != null) setState(() => _imageFile = picked);
  }

  Future<void> _pickBirthDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (context, child) => Theme(data: ThemeData.dark(), child: child!),
    );
    if (picked != null) setState(() => _birthDate = picked);
  }

  @override
  Widget build(BuildContext context) {
    final avatar = _imageFile != null
        ? CircleAvatar(
            radius: 40,
            backgroundImage: FileImage(File(_imageFile!.path)),
          )
        : const CircleAvatar(
            radius: 40,
            backgroundColor: Color(0xFF2C2C2C),
            child: Icon(Icons.person, color: Colors.grey, size: 40),
          );

    return Dialog(
      backgroundColor: const Color(0xFF1E1E1E),
      insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 28),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              avatar,
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: _pickImage,
                icon: const Icon(Icons.upload),
                label: const Text("Seleccionar avatar"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                ),
              ),
              const SizedBox(height: 16),
              _buildField(
                label: 'Nombre completo',
                icon: Icons.person,
                validator: (val) =>
                    val == null || val.isEmpty ? 'Campo requerido' : null,
                onSaved: (val) => _name = val!,
              ),
              const SizedBox(height: 12),
              _buildField(
                label: 'Correo electrónico',
                icon: Icons.email,
                keyboardType: TextInputType.emailAddress,
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Campo requerido';
                  final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+$');
                  return emailRegex.hasMatch(val) ? null : 'Correo inválido';
                },
                onSaved: (val) => _email = val!,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: DropdownButtonFormField<String>(
                      value: _selectedCountryCode,
                      items: _countryCodes
                          .map(
                            (code) => DropdownMenuItem(
                              value: code,
                              child: Text(code),
                            ),
                          )
                          .toList(),
                      onChanged: (val) =>
                          setState(() => _selectedCountryCode = val!),
                      dropdownColor: const Color(0xFF2C2C2C),
                      decoration: _decoration(label: 'Código'),
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    flex: 5,
                    child: _buildField(
                      label: 'Teléfono',
                      icon: Icons.phone,
                      keyboardType: TextInputType.phone,
                      validator: (val) {
                        if (val == null || val.isEmpty)
                          return 'Campo requerido';
                        final phoneRegex = RegExp(r'^[0-9]{6,15}$');
                        return phoneRegex.hasMatch(val)
                            ? null
                            : 'Número inválido';
                      },
                      onSaved: (val) => _phone = val!,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              _buildField(
                label: 'Cargo o título',
                icon: Icons.work,
                validator: (val) =>
                    val == null || val.isEmpty ? 'Campo requerido' : null,
                onSaved: (val) => _jobTitle = val!,
              ),
              const SizedBox(height: 12),
              _buildField(
                label: 'Contraseña',
                icon: Icons.lock,
                obscureText: true,
                validator: (val) => val == null || val.length < 4
                    ? 'Mínimo 4 caracteres'
                    : null,
                onSaved: (val) => _password = val!,
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _gender,
                decoration: _decoration(label: 'Género'),
                items: ['Masculino', 'Femenino', 'Otro']
                    .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                    .toList(),
                dropdownColor: const Color(0xFF2C2C2C),
                style: const TextStyle(color: Colors.white),
                onChanged: (val) => setState(() => _gender = val!),
              ),
              const SizedBox(height: 12),
              GestureDetector(
                onTap: _pickBirthDate,
                child: AbsorbPointer(
                  child: TextFormField(
                    decoration: _decoration(label: 'Fecha de nacimiento'),
                    controller: TextEditingController(
                      text: _birthDate == null
                          ? ''
                          : "${_birthDate!.year}-${_birthDate!.month.toString().padLeft(2, '0')}-${_birthDate!.day.toString().padLeft(2, '0')}",
                    ),
                    validator: (_) =>
                        _birthDate == null ? 'Campo requerido' : null,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      _formKey.currentState!.save();
                      final phoneFull = '$_selectedCountryCode$_phone';
                      final success = await context
                          .read<UsersProvider>()
                          .createUser(
                            name: _name,
                            email: _email,
                            password: _password,
                            phone: phoneFull,
                            jobTitle: _jobTitle,
                            gender: _gender,
                            birthDate: _birthDate?.toIso8601String(),
                            avatarFile: _imageFile != null
                                ? File(_imageFile!.path)
                                : null,
                          );

                      if (success) {
                        // Limpia campos si tienes controladores o variables
                        _formKey.currentState!.reset();
                        // Limpia otras variables si es necesario, por ejemplo:
                        setState(() {
                          _name = '';
                          _email = '';
                          _password = '';
                          _phone = '';
                          _jobTitle = '';
                          _gender = '';
                          _birthDate = null;
                          _imageFile = null;
                          _selectedCountryCode = '+58'; // o el default que uses
                        });

                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Usuario creado con éxito'),
                            ),
                          );
                          Navigator.of(
                            context,
                          ).pop(); // Cierra el diálogo o pantalla actual
                        }
                      } else {
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Error al crear usuario'),
                            ),
                          );
                        }
                      }
                    }
                  },
                  child: const Text('Añadir usuario'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  TextFormField _buildField({
    required String label,
    IconData? icon,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
    String? Function(String?)? validator,
    void Function(String?)? onSaved,
  }) {
    return TextFormField(
      style: const TextStyle(color: Colors.white),
      keyboardType: keyboardType,
      obscureText: obscureText,
      validator: validator,
      onSaved: onSaved,
      decoration: _decoration(label: label, icon: icon),
    );
  }

  InputDecoration _decoration({required String label, IconData? icon}) =>
      InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white70),
        prefixIcon: icon != null ? Icon(icon, color: Colors.white54) : null,
        filled: true,
        fillColor: const Color(0xFF2C2C2C),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.blueAccent),
        ),
      );
}
