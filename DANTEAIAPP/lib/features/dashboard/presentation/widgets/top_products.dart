import 'package:flutter/material.dart';

class TopProducts extends StatelessWidget {
  const TopProducts({super.key});

  @override
  Widget build(BuildContext context) {
    final products = List.generate(4, (i) => "Producto #${101 + i}");

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Productos más vendidos",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: const Color(0xFF1A001A),
            borderRadius: BorderRadius.circular(16),
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            children: products
                .map(
                  (prod) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.star, color: Colors.amber),
                    title: Text(
                      prod,
                      style: const TextStyle(color: Colors.white),
                    ),
                    subtitle: const Text(
                      'Ventas simuladas',
                      style: TextStyle(color: Colors.white54),
                    ),
                  ),
                )
                .toList(),
          ),
        ),
      ],
    );
  }
}
