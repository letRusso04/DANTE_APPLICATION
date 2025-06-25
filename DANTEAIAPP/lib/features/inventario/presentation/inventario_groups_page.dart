import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class InventarioGruposPage extends StatelessWidget {
  const InventarioGruposPage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> gruposInventario = [
      {
        'nombre': 'Electrónica',
        'imagen': 'https://cdn-icons-png.flaticon.com/512/1087/1087929.png',
        'color': [Colors.deepPurple, Colors.purpleAccent],
      },
      {
        'nombre': 'Ropa',
        'imagen': 'https://cdn-icons-png.flaticon.com/512/892/892458.png',
        'color': [Colors.indigo, Colors.pinkAccent],
      },
      {
        'nombre': 'Comida',
        'imagen': 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
        'color': [Colors.orange, Colors.deepOrangeAccent],
      },
    ];

    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: const Color(0xFF0D000D),
      appBar: AppBar(
        title: const Text("Inventario", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Stack(
        children: [
          Positioned.fill(
            child: Opacity(
              opacity: 0.2,
              child: Image.asset(
                'assets/images/space_bg.png',
                fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: GridView.builder(
              itemCount: gruposInventario.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.85,
              ),
              itemBuilder: (context, index) {
                final grupo = gruposInventario[index];
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
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircleAvatar(
                        radius: 34,
                        backgroundColor: Colors.white,
                        backgroundImage: NetworkImage(grupo['imagen']),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        grupo['nombre'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: () {
                          // Redirige a los productos del grupo (futuro)
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.black.withOpacity(0.2),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text("Ver productos"),
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
        backgroundColor: Colors.black,
        selectedItemColor: Colors.purpleAccent,
        unselectedItemColor: Colors.white54,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Grupos'),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_box),
            label: 'Crear grupo',
          ),
        ],
        currentIndex: 0,
        onTap: (index) {
          if (index == 1) {
            context.go('/inventario/crear');
          }
        },
      ),
    );
  }
}
