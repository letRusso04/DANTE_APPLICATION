import 'package:danteai/providers/product_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class TopProducts extends StatelessWidget {
  const TopProducts({super.key});

  @override
  Widget build(BuildContext context) {
    final productsProvider = Provider.of<ProductsProvider>(context);

    // Mostrar loading mientras carga
    if (productsProvider.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    final products = productsProvider.products.take(4).toList();

    if (products.isEmpty) {
      return const Text(
        "No hay productos disponibles",
        style: TextStyle(color: Colors.white),
      );
    }

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
            children: products.map((prod) {
              return ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.star, color: Colors.amber),
                title: Text(
                  prod.name,
                  style: const TextStyle(color: Colors.white),
                ),
                subtitle: Text(
                  'Stock: ${prod.stock} und | Precio: ${prod.price} dolares',
                  style: TextStyle(color: Colors.white54),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
