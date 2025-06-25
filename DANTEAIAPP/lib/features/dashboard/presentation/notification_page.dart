import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NotificacionesPage extends StatefulWidget {
  const NotificacionesPage({super.key});

  @override
  State<NotificacionesPage> createState() => _NotificacionesPageState();
}

class _NotificacionesPageState extends State<NotificacionesPage> {
  int _selectedIndex = 1;

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

  final List<Map<String, String>> _notificaciones = [
    {
      'titulo': 'Nuevo cliente agregado',
      'descripcion': 'Se ha registrado un nuevo cliente en el sistema.',
      'fecha': 'Hoy, 09:15 AM',
    },
    {
      'titulo': 'Inventario bajo',
      'descripcion': 'El producto "Café Premium" tiene pocas existencias.',
      'fecha': 'Ayer, 04:30 PM',
    },
    {
      'titulo': 'Usuario actualizado',
      'descripcion': 'El usuario Juan Pérez cambió su contraseña.',
      'fecha': 'Hace 2 días',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Notificaciones',
          style: TextStyle(
            color: Color(0xFFEAEAEA),
            fontSize: 22,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Color(0xFFEAEAEA)),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.fromARGB(255, 43, 0, 63), // Morado intenso
              Color.fromARGB(255, 59, 15, 78), // Morado vivo
              Color.fromARGB(255, 94, 18, 27), // Vinotinto medio
              Color.fromARGB(255, 31, 0, 11), // Vinotinto oscuro
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: ListView.separated(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
          itemCount: _notificaciones.length,
          separatorBuilder: (_, __) =>
              const Divider(color: Colors.white12, height: 16),
          itemBuilder: (context, index) {
            final noti = _notificaciones[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white10,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.purpleAccent.withOpacity(0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(
                  noti['titulo']!,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                subtitle: Text(
                  noti['descripcion']!,
                  style: const TextStyle(color: Colors.white70),
                ),
                trailing: Text(
                  noti['fecha']!,
                  style: const TextStyle(color: Colors.white38, fontSize: 12),
                ),
              ),
            );
          },
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFF1A001A),
        selectedItemColor: Colors.purpleAccent,
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
}
