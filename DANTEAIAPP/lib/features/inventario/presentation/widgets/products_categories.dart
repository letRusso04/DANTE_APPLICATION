import 'package:danteai/core/models/model_category.dart';
import 'package:danteai/core/models/model_product.dart';
import 'package:danteai/providers/product_provider.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:danteai/core/config/config_server.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

class ProductosPorCategoriaPage extends StatefulWidget {
  final CategoryModel categoria;

  const ProductosPorCategoriaPage({super.key, required this.categoria});

  @override
  State<ProductosPorCategoriaPage> createState() =>
      _ProductosPorCategoriaPageState();
}

class _ProductosPorCategoriaPageState extends State<ProductosPorCategoriaPage> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProductsProvider>().fetchProducts();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductsProvider>();
    final productosFiltrados = productProvider
        .productsByCategory(widget.categoria.id)
        .where((p) => p.name.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
    final isLoading = productProvider.isLoading;

    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: const Color(0xFF0D000D),
      appBar: AppBar(
        title: Text(
          'Productos - ${widget.categoria.name}',
          style: const TextStyle(color: Colors.white),
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
            child: isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      color: Colors.purpleAccent,
                    ),
                  )
                : Column(
                    children: [
                      // 🔍 Buscador
                      TextField(
                        controller: _searchController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Buscar producto...',
                          hintStyle: const TextStyle(color: Colors.white54),
                          prefixIcon: const Icon(
                            Icons.search,
                            color: Colors.white54,
                          ),
                          filled: true,
                          fillColor: const Color(0xFF1A1A2E),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        onChanged: (value) {
                          setState(() {
                            _searchQuery = value;
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      // Lista o mensaje vacío
                      Expanded(
                        child: productosFiltrados.isEmpty
                            ? Center(
                                child: Text(
                                  "No hay productos que coincidan",
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.7),
                                    fontSize: 16,
                                  ),
                                ),
                              )
                            : ListView.separated(
                                itemCount: productosFiltrados.length,
                                separatorBuilder: (_, __) =>
                                    const SizedBox(height: 16),
                                itemBuilder: (context, index) {
                                  final producto = productosFiltrados[index];
                                  return _ProductCard(producto: producto);
                                },
                              ),
                      ),
                    ],
                  ),
          ),
        ],
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
          context.push('/producto/detalle', extra: producto);
        },
      ),
    );
  }
}
