import 'dart:io';
import 'package:danteai/core/config/config_server.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import 'package:danteai/providers/user_provider.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';

class CuentaPage extends StatefulWidget {
  const CuentaPage({super.key});

  @override
  State<CuentaPage> createState() => _CuentaPageState();
}

class _CuentaPageState extends State<CuentaPage>
    with SingleTickerProviderStateMixin {
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;

  late TextEditingController _currentPassController;
  late TextEditingController _newPassController;
  late TextEditingController _confirmPassController;

  bool _isEditing = false;
  bool _isSavingProfile = false;
  bool _isSavingPassword = false;
  bool _isUploadingAvatar = false;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    final user = context.read<UsersProvider>().currentUser;
    _nameController = TextEditingController(text: user?.name ?? '');
    _emailController = TextEditingController(text: user?.email ?? '');
    _phoneController = TextEditingController(text: user?.phone ?? '');
    _currentPassController = TextEditingController();
    _newPassController = TextEditingController();
    _confirmPassController = TextEditingController();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _currentPassController.dispose();
    _newPassController.dispose();
    _confirmPassController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
    );
    if (picked != null) {
      setState(() => _isUploadingAvatar = true);
      final success = await context.read<UsersProvider>().updateAvatar(
        File(picked.path),
      );
      setState(() => _isUploadingAvatar = false);
      if (success)
        _showMessage('Imagen actualizada');
      else
        _showMessage('Error al actualizar imagen');
    }
  }

  Future<void> _saveProfile() async {
    final provider = context.read<UsersProvider>();
    final user = provider.currentUser;
    if (user == null) return;

    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final phone = _phoneController.text.trim();

    if (name.isEmpty || email.isEmpty) {
      _showMessage('Nombre y correo son obligatorios');
      return;
    }

    setState(() => _isSavingProfile = true);

    final success = await provider.updateUser(
      id: user.id,
      name: name,
      email: email,
      phone: phone.isEmpty ? null : phone,
    );

    setState(() {
      _isSavingProfile = false;
      _isEditing = false;
      _animationController.reverse(); // Oculta la sección de contraseña
    });

    if (success)
      _showMessage('Perfil actualizado');
    else
      _showMessage('Error al actualizar perfil');
  }

  Future<void> _savePassword() async {
    final oldPass = _currentPassController.text.trim();
    final newPass = _newPassController.text.trim();
    final confirm = _confirmPassController.text.trim();

    if ([oldPass, newPass, confirm].any((e) => e.isEmpty)) {
      _showMessage('Todos los campos son obligatorios');
      return;
    }
    if (newPass != confirm) {
      _showMessage('Las contraseñas no coinciden');
      return;
    }

    setState(() => _isSavingPassword = true);

    final success = await context.read<UsersProvider>().changePassword(
      oldPass,
      newPass,
    );

    setState(() => _isSavingPassword = false);

    if (success) {
      _showMessage('Contraseña actualizada');
      _currentPassController.clear();
      _newPassController.clear();
      _confirmPassController.clear();
    } else {
      _showMessage('Error al cambiar contraseña');
    }
  }

  void _showMessage(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  void _logout() async {
    await context.read<UsersProvider>().logoutUser();
    if (mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<UsersProvider>().currentUser;

    const background = Color(0xFF121212);
    const card = Color(0xFF1E1E2E);
    const accent = Color(0xFF7C3AED);
    const text = Colors.white70;

    return Scaffold(
      backgroundColor: background,
      drawer: const AppDrawer(),
      appBar: AppBar(
        backgroundColor: card,
        title: const Text('Mi Cuenta', style: TextStyle(color: Colors.white)),
        centerTitle: true,
        actions: [
          if (_isEditing)
            TextButton(
              onPressed: _isSavingProfile ? null : _saveProfile,
              child: _isSavingProfile
                  ? CircularProgressIndicator(color: accent, strokeWidth: 2)
                  : const Text('Guardar', style: TextStyle(color: accent)),
            )
          else
            IconButton(
              icon: const Icon(Icons.edit, color: accent),
              onPressed: () {
                setState(() {
                  _isEditing = true;
                  _animationController.forward();
                });
              },
            ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              GestureDetector(
                onTap: _isUploadingAvatar ? null : _pickImage,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CircleAvatar(
                      radius: 55,
                      backgroundColor: Colors.grey.shade800,
                      backgroundImage:
                          user?.avatarUrl != null && user!.avatarUrl!.isNotEmpty
                          ? NetworkImage('$API_AVATAR${user.avatarUrl}')
                                as ImageProvider
                          : null,
                      child: user?.avatarUrl == null || user!.avatarUrl!.isEmpty
                          ? const Icon(
                              Icons.person,
                              size: 50,
                              color: Colors.white54,
                            )
                          : null,
                    ),
                    if (_isUploadingAvatar)
                      const CircularProgressIndicator(color: accent),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              _buildField('Nombre', _nameController, _isEditing),
              _buildField(
                'Correo',
                _emailController,
                _isEditing,
                TextInputType.emailAddress,
              ),
              _buildField(
                'Teléfono',
                _phoneController,
                _isEditing,
                TextInputType.phone,
              ),
              FadeTransition(
                opacity: _fadeAnimation,
                child: Column(
                  children: [
                    const Text(
                      'Cambiar contraseña',
                      style: TextStyle(color: text, fontSize: 18),
                    ),
                    const SizedBox(height: 18),
                    _buildPassword('Contraseña actual', _currentPassController),
                    _buildPassword('Nueva contraseña', _newPassController),
                    _buildPassword(
                      'Confirmar contraseña',
                      _confirmPassController,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: _isSavingPassword ? null : _savePassword,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: accent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        padding: const EdgeInsets.symmetric(
                          vertical: 14,
                          horizontal: 24,
                        ),
                      ),
                      child: _isSavingPassword
                          ? const SizedBox(
                              height: 18,
                              width: 18,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : const Text(
                              'Actualizar contraseña',
                              style: TextStyle(color: Colors.white),
                            ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 36),
              ElevatedButton.icon(
                onPressed: _logout,
                icon: const Icon(Icons.logout, color: Colors.white),
                label: const Text(
                  'Cerrar sesión',
                  style: TextStyle(color: Colors.white),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: accent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  padding: const EdgeInsets.symmetric(
                    vertical: 14,
                    horizontal: 36,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: card,
        currentIndex: 1,
        selectedItemColor: accent,
        unselectedItemColor: Colors.grey,
        onTap: (i) {
          if (i == 0)
            context.go('/dashboard');
          else if (i == 1)
            context.go('/cuenta');
          else
            context.go('/cuenta');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inicio'),

          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle),
            label: 'Cuenta',
          ),
        ],
      ),
    );
  }

  Widget _buildField(
    String label,
    TextEditingController controller,
    bool enabled, [
    TextInputType type = TextInputType.text,
  ]) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: TextField(
        controller: controller,
        enabled: enabled,
        keyboardType: type,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Colors.white60),
          enabledBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.white12),
          ),
          focusedBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.deepPurpleAccent),
          ),
        ),
      ),
    );
  }

  Widget _buildPassword(String label, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: TextField(
        controller: controller,
        obscureText: true,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Colors.white60),
          enabledBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.white12),
          ),
          focusedBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.deepPurpleAccent),
          ),
        ),
      ),
    );
  }
}
