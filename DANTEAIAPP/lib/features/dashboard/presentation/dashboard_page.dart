import 'package:danteai/features/dashboard/presentation/widgets/latest_clients.dart';
import 'package:danteai/features/dashboard/presentation/widgets/sales_chart.dart';
import 'package:danteai/features/dashboard/presentation/widgets/summary_cards.dart';
import 'package:danteai/features/dashboard/presentation/widgets/top_products.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    switch (index) {
      case 0:
        context.go('/dashboard'); // Ruta del inicio/dashboard
        break;
      case 1:
        context.go('/notificaciones'); // Ruta notificaciones
        break;
      case 2:
        context.go('/cuenta'); // Ruta cuenta o perfil usuario
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D000D),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Dashboard Empresarial',
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
      drawer: const AppDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              onTap: () {
                context.go('/chatbot/danteai');
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: const Color(0xFF1F0A2A),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: Colors.purpleAccent.withOpacity(0.2),
                  ),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.mic_none, size: 32, color: Colors.purpleAccent),
                    SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        'Habla con DanteAI',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward_ios,
                      size: 16,
                      color: Colors.white54,
                    ),
                  ],
                ),
              ),
            ),
            const SummaryCards(),
            const SizedBox(height: 24),
            const SalesChart(),
            const SizedBox(height: 24),
            const LatestClients(),
            const SizedBox(height: 24),
            const TopProducts(),
          ],
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
