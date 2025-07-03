import 'package:flutter/material.dart';
import "package:go_router/go_router.dart";

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: const Color(0xFF1A001A),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Color(0xFF330033)),
            child: Text(
              'Menú Principal',
              style: TextStyle(color: Colors.white, fontSize: 24),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard, color: Colors.white),
            title: const Text(
              'Dashboard',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              context.go('/dashboard');
            },
          ),
          ListTile(
            leading: const Icon(Icons.message, color: Colors.white),
            title: const Text(
              'Mensajería',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              context.go('/mensajeria');
            },
          ),
          ListTile(
            leading: const Icon(Icons.people, color: Colors.white),
            title: const Text(
              'Clientes',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              context.go('/clientes');
            },
          ),
          ListTile(
            leading: const Icon(Icons.inventory, color: Colors.white),
            title: const Text(
              'Inventario',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              context.go('/inventario');
            },
          ),
          ListTile(
            leading: const Icon(
              Icons.production_quantity_limits_outlined,
              color: Colors.white,
            ),
            title: const Text(
              'Productos',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              context.go('/producto');
            },
          ),
          ListTile(
            leading: const Icon(Icons.account_box, color: Colors.white),
            title: const Text(
              'Usuarios',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              context.go('/usuarios/admin');
            },
          ),
        ],
      ),
    );
  }
}
