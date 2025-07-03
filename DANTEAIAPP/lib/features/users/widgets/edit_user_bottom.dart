import 'dart:io';
import 'package:danteai/core/models/model_user.dart';
import 'package:danteai/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void showEditUserBottomSheet(BuildContext context, UserModel user) {
  final nameController = TextEditingController(text: user.name);
  final emailController = TextEditingController(text: user.email);
  final phoneController = TextEditingController(text: user.phone ?? '');
  final jobTitleController = TextEditingController(text: user.jobTitle ?? '');
  final passwordController = TextEditingController(); // Nueva contraseña vacía
  bool isActive = user.isActive ?? true;
  String role = user.role ?? 'Usuario';

  final formKey = GlobalKey<FormState>();

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(ctx).viewInsets.bottom,
        top: 20,
        left: 12,
        right: 12,
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF121B21),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(25)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 12,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: Form(
          key: formKey,
          child: StatefulBuilder(
            builder: (context, setState) => SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Editar Usuario',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF5BC0BE),
                    ),
                  ),
                  const SizedBox(height: 20),
                  _buildField(nameController, 'Nombre completo'),
                  const SizedBox(height: 12),
                  _buildField(
                    emailController,
                    'Correo electrónico',
                    keyboardType: TextInputType.emailAddress,
                    validator: (val) {
                      if (val == null || val.isEmpty) return 'Campo requerido';
                      if (!val.contains('@')) return 'Correo inválido';
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  _buildField(
                    phoneController,
                    'Teléfono',
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 12),
                  _buildField(jobTitleController, 'Título del trabajo'),
                  const SizedBox(height: 12),
                  _buildField(
                    passwordController,
                    'Nueva contraseña (dejar vacío para no cambiar)',
                    keyboardType: TextInputType.visiblePassword,
                    validator: (val) {
                      if (val != null && val.isNotEmpty && val.length < 6) {
                        return 'Mínimo 6 caracteres';
                      }
                      return null;
                    },
                    obscureText: true,
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: role,
                    decoration: _inputDecoration('Rol'),
                    items: const [
                      DropdownMenuItem(
                        value: 'Usuario',
                        child: Text('Usuario'),
                      ),
                      DropdownMenuItem(
                        value: 'Soporte',
                        child: Text('Soporte'),
                      ),
                      DropdownMenuItem(
                        value: 'Operador',
                        child: Text('Operador'),
                      ),
                      DropdownMenuItem(
                        value: 'Propietario',
                        child: Text('Propietario'),
                      ),
                      DropdownMenuItem(
                        value: 'Programador',
                        child: Text('Programador'),
                      ),
                    ],
                    dropdownColor: const Color(0xFF121B21),
                    style: const TextStyle(color: Colors.white),
                    onChanged: (value) {
                      if (value != null) setState(() => role = value);
                    },
                  ),
                  const SizedBox(height: 12),
                  SwitchListTile(
                    value: isActive,
                    onChanged: (val) => setState(() => isActive = val),
                    title: const Text(
                      '¿Activo?',
                      style: TextStyle(color: Colors.white70),
                    ),
                    activeColor: const Color(0xFF5BC0BE),
                    contentPadding: EdgeInsets.zero,
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () async {
                      if (formKey.currentState!.validate()) {
                        final success =
                            await Provider.of<UsersProvider>(
                              context,
                              listen: false,
                            ).updateUser(
                              id: user.id!,
                              name: nameController.text.trim(),
                              email: emailController.text.trim(),
                              phone: phoneController.text.trim(),
                              jobTitle: jobTitleController.text.trim(),
                              isActive: isActive,
                              role: role,
                              password: passwordController.text.isEmpty
                                  ? null
                                  : passwordController.text.trim(),
                            );

                        if (success) {
                          Navigator.of(context).pop();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Usuario actualizado exitosamente'),
                              backgroundColor: Color(0xFF5BC0BE),
                            ),
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Error al actualizar usuario'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      }
                    },
                    icon: const Icon(Icons.save),
                    label: const Text('Guardar cambios'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF5BC0BE),
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 14,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

Widget _buildField(
  TextEditingController controller,
  String label, {
  TextInputType keyboardType = TextInputType.text,
  String? Function(String?)? validator,
  bool obscureText = false,
}) {
  return TextFormField(
    controller: controller,
    keyboardType: keyboardType,
    obscureText: obscureText,
    validator:
        validator ??
        (value) =>
            (value == null || value.isEmpty) ? 'Este campo es requerido' : null,
    decoration: _inputDecoration(label),
    style: const TextStyle(color: Colors.white),
  );
}

InputDecoration _inputDecoration(String label) {
  return InputDecoration(
    labelText: label,
    labelStyle: const TextStyle(color: Colors.white70),
    enabledBorder: OutlineInputBorder(
      borderSide: const BorderSide(color: Colors.white24),
      borderRadius: BorderRadius.circular(10),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: const BorderSide(color: Color(0xFF5BC0BE)),
      borderRadius: BorderRadius.circular(10),
    ),
    filled: true,
    fillColor: const Color(0xFF192A33),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
  );
}
