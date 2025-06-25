import 'package:flutter/material.dart';

class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String avatarUrl;
  final bool isActive;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.avatarUrl,
    this.isActive = true,
  });
}

class UsersPanelPage extends StatefulWidget {
  const UsersPanelPage({super.key});

  @override
  State<UsersPanelPage> createState() => _UsersPanelPageState();
}

class _UsersPanelPageState extends State<UsersPanelPage> {
  final List<User> _users = List.generate(
    30,
    (index) => User(
      id: 'user_$index',
      name: 'Usuario $index',
      email: 'usuario$index@empresa.com',
      role: index % 3 == 0 ? 'Administrador' : 'Empleado',
      avatarUrl: 'https://i.pravatar.cc/150?img=${index + 10}',
      isActive: index % 5 != 0,
    ),
  );

  String _searchQuery = '';

  List<User> get _filteredUsers => _users
      .where(
        (u) =>
            u.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
            u.email.toLowerCase().contains(_searchQuery.toLowerCase()) ||
            u.role.toLowerCase().contains(_searchQuery.toLowerCase()),
      )
      .toList();

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
    });
  }

  void _openUserLogin(User user) {
    final passwordController = TextEditingController();

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A001A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        contentPadding: const EdgeInsets.all(24),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircleAvatar(
              radius: 40,
              backgroundImage: NetworkImage(user.avatarUrl),
            ),
            const SizedBox(height: 16),
            Text(
              user.name,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              user.role,
              style: const TextStyle(fontSize: 16, color: Colors.white54),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            TextField(
              controller: passwordController,
              obscureText: true,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Contraseña',
                hintStyle: const TextStyle(color: Colors.white38),
                filled: true,
                fillColor: Colors.white10,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  final pass = passwordController.text;
                  // TODO: Validar contraseña con backend
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text("Bienvenido, ${user.name}!"),
                      backgroundColor: Colors.purple[700],
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purpleAccent,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Iniciar sesión',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bgColor = const Color(
      0xFF0D000D,
    ); // negro con tintes violetas oscuros

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: const Color(0xFF330033), // vinotinto oscuro
        automaticallyImplyLeading:
            false, // oculta el botón de "back" si lo hubiera
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Agregar usuario',
            onPressed: () {
              // TODO: abrir formulario para agregar usuario
            },
            color: Color.fromARGB(200, 200, 200, 200),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Cerrar sesión',
            onPressed: () {
              // TODO: acción de logout
              Navigator.pop(context); // o reemplazar por login page
            },
            color: Color.fromARGB(200, 200, 200, 200),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Buscar usuarios...',
                prefixIcon: const Icon(Icons.search, color: Colors.white70),
                filled: true,
                fillColor: const Color(0xFF330033).withOpacity(0.7),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                hintStyle: const TextStyle(color: Colors.white54),
              ),
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ),
      ),
      body: _filteredUsers.isEmpty
          ? const Center(
              child: Text(
                'No se encontraron usuarios',
                style: TextStyle(color: Colors.white70, fontSize: 16),
              ),
            )
          : Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 16,
                  childAspectRatio: 0.75,
                ),
                itemCount: _filteredUsers.length,
                itemBuilder: (context, index) {
                  final user = _filteredUsers[index];
                  return UserCardMinimal(
                    user: user,
                    onTap: () => _openUserLogin(user),
                  );
                },
              ),
            ),
    );
  }
}

class UserCardMinimal extends StatefulWidget {
  final User user;
  final VoidCallback onTap;

  const UserCardMinimal({super.key, required this.user, required this.onTap});

  @override
  State<UserCardMinimal> createState() => _UserCardMinimalState();
}

class _UserCardMinimalState extends State<UserCardMinimal> {
  bool _isHovered = false;

  void _setHovered(bool val) {
    setState(() {
      _isHovered = val;
    });
  }

  @override
  Widget build(BuildContext context) {
    final borderColor = widget.user.isActive
        ? Colors.purpleAccent
        : Colors.redAccent;
    return MouseRegion(
      onEnter: (_) => _setHovered(true),
      onExit: (_) => _setHovered(false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1A001A),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: borderColor.withOpacity(_isHovered ? 1 : 0.4),
              width: 2,
            ),
            boxShadow: _isHovered
                ? [
                    BoxShadow(
                      color: borderColor.withOpacity(0.4),
                      blurRadius: 12,
                      offset: const Offset(0, 6),
                    ),
                  ]
                : [],
          ),
          transform: _isHovered
              ? (Matrix4.identity()..scale(1.04))
              : Matrix4.identity(),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 38,
                backgroundImage: NetworkImage(widget.user.avatarUrl),
              ),
              const SizedBox(height: 14),
              Text(
                widget.user.name,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                widget.user.role,
                style: const TextStyle(color: Colors.white70),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
