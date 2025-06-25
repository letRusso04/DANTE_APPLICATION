import 'package:flutter/material.dart';

class SalesChart extends StatelessWidget {
  const SalesChart({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 220,
      decoration: BoxDecoration(
        color: const Color(0xFF1A001A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Center(
        child: Text(
          '📊 Gráfica de ventas (próximamente)',
          style: TextStyle(color: Colors.white54),
        ),
      ),
    );
  }
}
