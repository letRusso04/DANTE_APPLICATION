import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CommonBottomNavBar extends StatelessWidget {
  final int currentIndex;

  const CommonBottomNavBar({super.key, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      backgroundColor: const Color(0xFF1A001A),
      currentIndex: currentIndex,
      selectedItemColor: Colors.purpleAccent,
      unselectedItemColor: Colors.white38,
      onTap: (index) {
        switch (index) {
          case 0:
            context.go('/mensajeria'); // Chats
            break;
          case 1:
            context.go('/mensajeria/grupos'); // Grupos
            break;
          case 2:
            context.go(
              '/mensajeria/soporte',
            ); // Soporte (puedes crear esta ruta)
            break;
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Chats'),
        BottomNavigationBarItem(icon: Icon(Icons.group), label: 'Grupos'),
        BottomNavigationBarItem(
          icon: Icon(Icons.support_agent),
          label: 'Soporte',
        ),
      ],
    );
  }
}
