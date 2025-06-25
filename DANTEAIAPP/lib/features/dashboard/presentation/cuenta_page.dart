import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CuentaPage extends StatefulWidget {
  const CuentaPage({super.key});

  @override
  State<CuentaPage> createState() => _CuentaPageState();
}

class _CuentaPageState extends State<CuentaPage> {
  int _selectedIndex = 2;

  final TextEditingController _nameController = TextEditingController(
    text: 'Juan Pérez',
  );
  final TextEditingController _emailController = TextEditingController(
    text: 'juan.perez@empresa.com',
  );
  final TextEditingController _phoneController = TextEditingController(
    text: '+58 412 1234567',
  );

  final TextEditingController _currentPassController = TextEditingController();
  final TextEditingController _newPassController = TextEditingController();
  final TextEditingController _confirmPassController = TextEditingController();

  bool _isEditing = false;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/notificaciones');
        break;
      case 2:
        context.go('/cuenta');
        break;
    }
  }

  void _toggleEdit() {
    setState(() {
      _isEditing = !_isEditing;
    });
  }

  void _logout() {
    // Aquí la lógica de logout
    context.go('/login');
  }

  void _savePassword() {
    final currentPass = _currentPassController.text.trim();
    final newPass = _newPassController.text.trim();
    final confirmPass = _confirmPassController.text.trim();

    if (newPass.isEmpty || confirmPass.isEmpty || currentPass.isEmpty) {
      _showMessage('Por favor llena todos los campos de contraseña');
      return;
    }

    if (newPass != confirmPass) {
      _showMessage('La nueva contraseña y su confirmación no coinciden');
      return;
    }

    // Aquí agregar la lógica para validar la contraseña actual y actualizar la nueva

    _showMessage('Contraseña actualizada correctamente');
    _currentPassController.clear();
    _newPassController.clear();
    _confirmPassController.clear();
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.purpleAccent),
    );
  }

  @override
  Widget build(BuildContext context) {
    final baseColor = const Color(0xFF1A001A);
    final cardColor = const Color(0xFF2A002A);
    final accentColor = Colors.purpleAccent;

    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: baseColor,
      drawer: const AppDrawer(),
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: const Text(
          'Cuenta',
          style: TextStyle(
            color: Colors.white70,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.3,
            fontSize: 20,
          ),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white70),
        actions: [
          IconButton(
            icon: Icon(
              _isEditing ? Icons.check : Icons.edit,
              color: accentColor,
            ),
            onPressed: _toggleEdit,
            tooltip: _isEditing ? 'Guardar cambios' : 'Editar perfil',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
          child: Column(
            children: [
              // Contenedor info usuario
              Container(
                decoration: BoxDecoration(
                  color: cardColor,
                  borderRadius: BorderRadius.circular(15),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.4),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(
                  vertical: 30,
                  horizontal: 20,
                ),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 48,
                      backgroundColor: Colors.grey[800],
                      backgroundImage: const NetworkImage(
                        'https://randomuser.me/api/portraits/men/75.jpg',
                      ),
                    ),
                    const SizedBox(height: 24),
                    _buildTextField(
                      'Nombre completo',
                      _nameController,
                      _isEditing,
                      keyboardType: TextInputType.name,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      'Correo electrónico',
                      _emailController,
                      _isEditing,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      'Teléfono',
                      _phoneController,
                      _isEditing,
                      keyboardType: TextInputType.phone,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),

              // Panel para cambiar contraseña
              Container(
                decoration: BoxDecoration(
                  color: cardColor,
                  borderRadius: BorderRadius.circular(15),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.4),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(
                  vertical: 20,
                  horizontal: 20,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Cambiar contraseña',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.white70,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _buildPasswordField(
                      'Contraseña actual',
                      _currentPassController,
                      enabled: true,
                    ),
                    const SizedBox(height: 16),
                    _buildPasswordField(
                      'Nueva contraseña',
                      _newPassController,
                      enabled: true,
                    ),
                    const SizedBox(height: 16),
                    _buildPasswordField(
                      'Confirmar nueva contraseña',
                      _confirmPassController,
                      enabled: true,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: _savePassword,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: accentColor,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 5,
                        shadowColor: accentColor.withOpacity(0.6),
                      ),
                      child: const Text(
                        'Actualizar contraseña',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: _logout,
                icon: const Icon(
                  Icons.logout,
                  color: Color.fromARGB(240, 240, 240, 255),
                ),
                label: const Text(
                  'Cerrar sesión',
                  style: TextStyle(color: Color.fromARGB(240, 240, 240, 255)),
                ),

                style: ElevatedButton.styleFrom(
                  backgroundColor: accentColor,
                  padding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 36,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  elevation: 5,

                  shadowColor: Colors.purpleAccent.withOpacity(0.5),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: baseColor,
        selectedItemColor: accentColor,
        unselectedItemColor: Colors.white38,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inicio'),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: 'Notificaciones',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle),
            label: 'Cuenta',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller,
    bool enabled, {
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      enabled: enabled,
      keyboardType: keyboardType,
      style: const TextStyle(
        color: Colors.white70,
        fontWeight: FontWeight.w500,
      ),
      cursorColor: Colors.purpleAccent,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white54),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.white24),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.purpleAccent),
        ),
      ),
    );
  }

  Widget _buildPasswordField(
    String label,
    TextEditingController controller, {
    bool enabled = false,
  }) {
    return TextField(
      controller: controller,
      enabled: enabled,
      obscureText: true,
      style: const TextStyle(
        color: Colors.white70,
        fontWeight: FontWeight.w500,
      ),
      cursorColor: Colors.purpleAccent,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white54),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.white24),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.purpleAccent),
        ),
      ),
    );
  }
}
