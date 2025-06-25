import 'package:flutter/material.dart';

class SummaryCards extends StatelessWidget {
  const SummaryCards({super.key});

  @override
  Widget build(BuildContext context) {
    final cards = [
      _buildCard("Clientes", "235", Icons.people, Colors.purpleAccent),
      _buildCard("Productos", "132", Icons.shopping_bag, Colors.deepPurple),
      _buildCard("Ventas", "48", Icons.bar_chart, Colors.pinkAccent),
      _buildCard("Inventario", "839", Icons.inventory, Colors.indigoAccent),
    ];

    return Wrap(spacing: 16, runSpacing: 16, children: cards);
  }

  Widget _buildCard(String title, String value, IconData icon, Color color) {
    return Container(
      width: 200,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A001A),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: color.withOpacity(0.3), blurRadius: 12)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(title, style: const TextStyle(color: Colors.white70)),
        ],
      ),
    );
  }
}
