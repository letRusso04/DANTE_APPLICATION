import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class UsersAdminPage extends StatefulWidget {
  const UsersAdminPage({super.key});

  @override
  State<UsersAdminPage> createState() => _UsersAdminPageState();
}

class _UsersAdminPageState extends State<UsersAdminPage> {
  // Simulación de usuarios
  List<Map<String, dynamic>> usuarios = [
    {
      'id': 'u1',
      'nombre': 'Ana García',
      'rol': 'Administrador',
      'activo': true,
      'imagen': 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      'id': 'u2',
      'nombre': 'Carlos Pérez',
      'rol': 'Usuario',
      'activo': false,
      'imagen': 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      'id': 'u3',
      'nombre': 'Laura Sánchez',
      'rol': 'Usuario',
      'activo': true,
      'imagen': 'https://randomuser.me/api/portraits/women/65.jpg',
    },
  ];

  void _toggleActivo(int index) {
    setState(() {
      usuarios[index]['activo'] = !usuarios[index]['activo'];
    });
  }

  void _eliminarUsuario(int index) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirmar eliminación'),
        content: Text(
          '¿Seguro que quieres eliminar a ${usuarios[index]['nombre']}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                usuarios.removeAt(index);
              });
              Navigator.of(ctx).pop();
            },
            child: const Text('Eliminar', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _editarUsuario(int index) {
    final TextEditingController nombreController = TextEditingController(
      text: usuarios[index]['nombre'],
    );
    final TextEditingController rolController = TextEditingController(
      text: usuarios[index]['rol'],
    );

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Editar usuario'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nombreController,
              decoration: const InputDecoration(labelText: 'Nombre'),
            ),
            TextField(
              controller: rolController,
              decoration: const InputDecoration(labelText: 'Rol'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                usuarios[index]['nombre'] = nombreController.text;
                usuarios[index]['rol'] = rolController.text;
              });
              Navigator.of(ctx).pop();
            },
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: const Color(0xFF0D000D),
      appBar: AppBar(
        title: const Text(
          'Usuarios (Admin)',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: usuarios.length,
        itemBuilder: (context, index) {
          final user = usuarios[index];
          return Card(
            color: Colors.deepPurple.withOpacity(0.7),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            margin: const EdgeInsets.symmetric(vertical: 8),
            child: ListTile(
              leading: CircleAvatar(
                backgroundImage: NetworkImage(user['imagen']),
              ),
              title: Text(
                user['nombre'],
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              subtitle: Text(
                user['rol'],
                style: const TextStyle(color: Colors.white70),
              ),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: Icon(
                      user['activo'] ? Icons.toggle_on : Icons.toggle_off,
                      color: Colors.white,
                      size: 30,
                    ),
                    onPressed: () => _toggleActivo(index),
                    tooltip: user['activo']
                        ? 'Desactivar usuario'
                        : 'Activar usuario',
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit, color: Colors.white),
                    onPressed: () => _editarUsuario(index),
                    tooltip: 'Editar usuario',
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete, color: Colors.redAccent),
                    onPressed: () => _eliminarUsuario(index),
                    tooltip: 'Eliminar usuario',
                  ),
                ],
              ),
            ),
          );
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.black,
        selectedItemColor: Colors.purpleAccent,
        unselectedItemColor: Colors.white54,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Usuarios'),
          BottomNavigationBarItem(
            icon: Icon(Icons.add),
            label: 'Crear usuario',
          ),
        ],
        currentIndex: 0,
        onTap: (index) {
          if (index == 1) {
            context.go('/users/create');
          }
        },
      ),
    );
  }
}
