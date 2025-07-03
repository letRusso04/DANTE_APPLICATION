import 'dart:io';

import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class UsersCreatePage extends StatefulWidget {
  const UsersCreatePage({super.key});

  @override
  State<UsersCreatePage> createState() => _UsersCreatePageState();
}

class _UsersCreatePageState extends State<UsersCreatePage> {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _emailController = TextEditingController();
  final _cedulaController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  String _rolSeleccionado = 'Usuario';
  bool _activo = true;
  File? _fotoUsuario;

  Future<void> _seleccionarFoto() async {
    final picker = ImagePicker();
    final XFile? imagen = await picker.pickImage(source: ImageSource.gallery);
    if (imagen != null) {
      setState(() {
        _fotoUsuario = File(imagen.path);
      });
    }
  }

  void _guardarUsuario() {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    if (_fotoUsuario == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, selecciona una foto')),
      );
      return;
    }

    // Aquí enviarías los datos al backend o repositorio
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Usuario "${_nombreController.text}" creado')),
    );

    Navigator.of(context).pop(); // Regresa a listado de usuarios
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: const Color(0xFF0D000D),
      appBar: AppBar(
        title: const Text(
          'Crear Usuario',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.65),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withOpacity(0.4),
                  blurRadius: 20,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTextField(_nombreController, 'Nombre completo'),
                const SizedBox(height: 16),
                _buildTextField(_cedulaController, 'Cédula'),
                const SizedBox(height: 16),
                _buildTextField(
                  _telefonoController,
                  'Teléfono',
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 16),
                _buildTextField(
                  _emailController,
                  'Email corporativo',
                  keyboardType: TextInputType.emailAddress,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Campo obligatorio';
                    final regex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
                    if (!regex.hasMatch(val)) return 'Email no válido';
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _rolSeleccionado,
                  items: const [
                    DropdownMenuItem(
                      value: 'Administrador',
                      child: Text('Administrador'),
                    ),
                    DropdownMenuItem(value: 'Usuario', child: Text('Usuario')),
                  ],
                  decoration: _inputDecoration('Rol'),
                  dropdownColor: Colors.black87,
                  style: const TextStyle(color: Colors.white),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() {
                        _rolSeleccionado = val;
                      });
                    }
                  },
                ),
                const SizedBox(height: 16),
                _buildTextField(
                  _passwordController,
                  'Contraseña',
                  isPassword: true,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Campo obligatorio';
                    if (val.length < 6) return 'Mínimo 6 caracteres';
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                _buildTextField(
                  _confirmPasswordController,
                  'Confirmar contraseña',
                  isPassword: true,
                  validator: (val) {
                    if (val == null || val.isEmpty) return 'Campo obligatorio';
                    if (val != _passwordController.text) {
                      return 'Las contraseñas no coinciden';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                SwitchListTile(
                  value: _activo,
                  onChanged: (val) => setState(() => _activo = val),
                  title: const Text(
                    'Activo',
                    style: TextStyle(color: Colors.white),
                  ),
                  activeColor: Colors.purple,
                  contentPadding: EdgeInsets.zero,
                ),
                const SizedBox(height: 24),
                GestureDetector(
                  onTap: _seleccionarFoto,
                  child: Container(
                    height: 160,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white10,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white30),
                    ),
                    child: _fotoUsuario != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: Image.file(_fotoUsuario!, fit: BoxFit.cover),
                          )
                        : const Center(
                            child: Text(
                              'Seleccionar foto de usuario',
                              style: TextStyle(color: Colors.white70),
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _guardarUsuario,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.purple,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: const Text(
                      'Crear usuario',
                      style: TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label, {
    TextInputType keyboardType = TextInputType.text,
    bool isPassword = false,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: isPassword,
      style: const TextStyle(color: Colors.white),
      decoration: _inputDecoration(label),
      validator:
          validator ??
          (val) => (val == null || val.isEmpty) ? 'Campo obligatorio' : null,
    );
  }

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.white70),
      filled: true,
      fillColor: Colors.white10,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide.none,
      ),
    );
  }
}
