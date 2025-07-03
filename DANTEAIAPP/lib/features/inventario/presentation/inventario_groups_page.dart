import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_category.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:danteai/providers/category_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

class InventarioGruposPage extends StatefulWidget {
  const InventarioGruposPage({super.key});

  @override
  State<InventarioGruposPage> createState() => _InventarioGruposPageState();
}

class _InventarioGruposPageState extends State<InventarioGruposPage> {
  @override
  void initState() {
    super.initState();
    // Cargar categorías al iniciar
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CategoryProvider>().fetchCategories();
    });
  }

  @override
  Widget build(BuildContext context) {
    final categoryProvider = context.watch<CategoryProvider>();
    final List<CategoryModel> categorias = categoryProvider.categories;
    final bool isLoading = categoryProvider.isLoading;

    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: const Color(0xFF0D000D),
      appBar: AppBar(
        title: const Text(
          "Inventario - Categorías",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
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
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
            child: isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      color: Colors.purpleAccent,
                    ),
                  )
                : categorias.isEmpty
                ? Center(
                    child: Text(
                      "No hay categorías disponibles",
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.7),
                        fontSize: 16,
                      ),
                    ),
                  )
                : GridView.builder(
                    itemCount: categorias.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 20,
                          mainAxisSpacing: 20,
                          childAspectRatio: 0.75,
                        ),
                    itemBuilder: (context, index) {
                      final categoria = categorias[index];
                      return _CategoryCard(categoria: categoria);
                    },
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
            icon: Icon(Icons.dashboard),
            label: 'Categorías',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_box),
            label: 'Crear categoría',
          ),
        ],
        currentIndex: 0,
        onTap: (index) {
          if (index == 1) {
            context.go('/inventario/crear');
          }
        },
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final CategoryModel categoria;
  const _CategoryCard({required this.categoria});

  @override
  Widget build(BuildContext context) {
    // Color base púrpura oscuro para borde y sombra
    const borderColor = Color(0xFF5A1A8B);
    print("${categoria.imageUrl}");
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A0D2E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: borderColor.withOpacity(0.6),
            blurRadius: 8,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Imagen o placeholder
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: categoria.imageUrl != null && categoria.imageUrl!.isNotEmpty
                ? Image.network(
                    '${categoria.imageUrl!.startsWith('http') ? '' : API_AVATAR}${categoria.imageUrl}',
                    height: 100,
                    width: 100,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => const Icon(
                      Icons.broken_image,
                      size: 100,
                      color: Colors.white54,
                    ),
                  )
                : const Icon(Icons.category, size: 100, color: Colors.white54),
          ),
          const SizedBox(height: 16),
          Text(
            categoria.name,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 18,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: 140,
            child: OutlinedButton(
              onPressed: () {
                context.push('/productos/categoria', extra: categoria);
              },
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.purpleAccent, width: 1.5),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                foregroundColor: Colors.purpleAccent,
              ),
              child: const Text(
                "Ver productos",
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
