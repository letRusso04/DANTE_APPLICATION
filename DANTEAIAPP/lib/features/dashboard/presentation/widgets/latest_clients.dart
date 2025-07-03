import 'package:danteai/providers/client_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LatestClients extends StatelessWidget {
  const LatestClients({super.key});

  @override
  Widget build(BuildContext context) {
    final clientsProvider = Provider.of<ClientsProvider>(context);

    if (clientsProvider.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    final clients = clientsProvider.clients.take(4).toList();

    if (clients.isEmpty) {
      return const Text(
        "No hay clientes disponibles",
        style: TextStyle(color: Colors.white),
      );
    }

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
            children: clients.map((client) {
              return ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.person, color: Colors.purpleAccent),
                title: Text(
                  client.name,
                  style: const TextStyle(color: Colors.white),
                ),
                subtitle: Text(
                  client.address ?? 'Dirección no disponible',
                  style: const TextStyle(color: Colors.white54),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
