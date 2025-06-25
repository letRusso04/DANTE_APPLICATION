import 'package:flutter/material.dart';

class LatestClients extends StatelessWidget {
  const LatestClients({super.key});

  @override
  Widget build(BuildContext context) {
    final clients = List.generate(4, (i) => "Cliente #${234 + i}");

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Últimos Clientes",
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
            children: clients
                .map(
                  (client) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(
                      Icons.person,
                      color: Colors.purpleAccent,
                    ),
                    title: Text(
                      client,
                      style: const TextStyle(color: Colors.white),
                    ),
                    subtitle: const Text(
                      'Dirección simulada',
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
