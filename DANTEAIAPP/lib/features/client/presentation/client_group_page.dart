import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ClientGroupsPage extends StatefulWidget {
  const ClientGroupsPage({super.key});

  @override
  State<ClientGroupsPage> createState() => _ClientGroupsPageState();
}

class _ClientGroupsPageState extends State<ClientGroupsPage> {
  int _currentIndex = 0;

  final List<Map<String, dynamic>> grupos = [
    {
      'nombre': 'VIP',
      'imagen': 'https://cdn-icons-png.flaticon.com/512/3503/3503788.png',
      'color': [Color(0xFF7F00FF), Color(0xFFE100FF)],
    },
    {
      'nombre': 'Empresariales',
      'imagen': 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png',
      'color': [Color(0xFF00416A), Color(0xFFE4E5E6)],
    },
    {
      'nombre': 'Frecuentes',
      'imagen': 'https://cdn-icons-png.flaticon.com/512/3126/3126647.png',
      'color': [Color(0xFF8360C3), Color(0xFF2EBF91)],
    },
    {
      'nombre': 'Inactivos',
      'imagen': 'https://cdn-icons-png.flaticon.com/512/3984/3984410.png',
      'color': [Color(0xFF614385), Color(0xFF516395)],
    },
  ];

  void _onNavTap(int index) {
    setState(() => _currentIndex = index);
    switch (index) {
      case 0:
        break;
      case 1:
        context.go('/clientes/crear-grupo');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text(
          'Grupos de Clientes',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      drawer: const AppDrawer(),
      body: Stack(
        children: [
          // 🌌 Fondo animado
          Positioned.fill(
            child: Opacity(
              opacity: 0.2,
              child: Image.asset(
                'assets/images/space_bg.png',
                fit: BoxFit.cover,
              ),
            ),
          ),

          // 🧩 Tarjetas de grupos
          Padding(
            padding: const EdgeInsets.all(16),
            child: GridView.builder(
              itemCount: grupos.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 20,
                crossAxisSpacing: 20,
                childAspectRatio: 0.9,
              ),
              itemBuilder: (context, index) {
                final grupo = grupos[index];
                final List<Color> gradientColors = List<Color>.from(
                  grupo['color'],
                );

                return Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: gradientColors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: gradientColors[0].withOpacity(0.4),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 16,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircleAvatar(
                        radius: 34,
                        backgroundColor: Colors.white10,
                        backgroundImage: NetworkImage(grupo['imagen']),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        grupo['nombre'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const Spacer(),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            context.go(
                              '/clientes/${grupo['nombre'].toLowerCase()}',
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black.withOpacity(0.2),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          icon: const Icon(
                            Icons.arrow_forward,
                            size: 18,
                            color: Colors.white,
                          ),
                          label: const Text(
                            'Revisar',
                            style: TextStyle(color: Colors.white, fontSize: 14),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        backgroundColor: const Color(0xFF1A001A),
        selectedItemColor: Colors.purpleAccent,
        unselectedItemColor: Colors.white60,
        onTap: _onNavTap,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.group), label: 'Grupos'),
          BottomNavigationBarItem(icon: Icon(Icons.add), label: 'Crear grupo'),
        ],
      ),
    );
  }
}
