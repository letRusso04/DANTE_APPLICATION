import 'package:danteai/core/models/model_product.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:danteai/providers/product_provider.dart';
import 'package:danteai/core/config/config_server.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

class ProductosPanelPage extends StatefulWidget {
  const ProductosPanelPage({super.key});

  @override
  State<ProductosPanelPage> createState() => _ProductosPanelPageState();
}

class _ProductosPanelPageState extends State<ProductosPanelPage> {
  String searchTerm = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProductsProvider>().fetchProducts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductsProvider>();
    final productos = productProvider.products;
    final isLoading = productProvider.isLoading;

    // Filtrar productos según searchTerm
    final filteredProducts = searchTerm.isEmpty
        ? productos
        : productos
              .where(
                (p) => p.name.toLowerCase().contains(searchTerm.toLowerCase()),
              )
              .toList();

    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: const Color(0xFF0D000D),
      appBar: AppBar(
        title: const Text(
          "Inventario - Productos",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Stack(
        children: [
          Positioned.fill(
            child: Opacity(
              opacity: 0.15,
              child: Image.asset(
                'assets/images/space_bg.png',
                fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Buscador
                TextField(
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    prefixIcon: const Icon(
                      Icons.search,
                      color: Color.fromARGB(255, 209, 209, 209),
                    ),
                    hintText: 'Buscar productos...',
                    hintStyle: TextStyle(
                      color: const Color.fromARGB(
                        255,
                        238,
                        238,
                        238,
                      ).withOpacity(0.7),
                    ),
                    filled: true,
                    fillColor: const Color(0xFF1A1A2E),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onChanged: (val) {
                    setState(() {
                      searchTerm = val.trim();
                    });
                  },
                ),
                const SizedBox(height: 16),

                // Listado o mensajes
                Expanded(
                  child: isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            color: Colors.purpleAccent,
                          ),
                        )
                      : filteredProducts.isEmpty
                      ? Center(
                          child: Text(
                            "No hay productos registrados",
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                              fontSize: 16,
                            ),
                          ),
                        )
                      : ListView.separated(
                          itemCount: filteredProducts.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(height: 16),
                          itemBuilder: (context, index) {
                            final producto = filteredProducts[index];
                            return _ProductCard(producto: producto);
                          },
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.black,
        selectedItemColor: Colors.purpleAccent,
        unselectedItemColor: Colors.white54,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.inventory),
            label: 'Productos',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.add), label: 'Agregar'),
        ],
        currentIndex: 0,
        onTap: (index) {
          if (index == 1) {
            context.go('/productos/crear');
          }
        },
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  final ProductModel producto;
  const _ProductCard({required this.producto});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A0D2E),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Colors.purpleAccent.withOpacity(0.4),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.purpleAccent.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        leading: producto.imageUrl != null && producto.imageUrl!.isNotEmpty
            ? ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  '${producto.imageUrl!.startsWith("http") ? "" : API_AVATAR}${producto.imageUrl}',
                  width: 60,
                  height: 60,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => const Icon(
                    Icons.image_not_supported,
                    color: Colors.white54,
                  ),
                ),
              )
            : const Icon(Icons.inventory_2, size: 40, color: Colors.white54),
        title: Text(
          producto.name,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        subtitle: Text(
          producto.description ?? '',
          style: const TextStyle(color: Colors.white70),
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          color: Colors.purpleAccent,
          size: 18,
        ),
        onTap: () {
          // Aquí puedes navegar a la vista de detalle o edición
          context.push('/producto/detalle', extra: producto);
        },
      ),
    );
  }
}
