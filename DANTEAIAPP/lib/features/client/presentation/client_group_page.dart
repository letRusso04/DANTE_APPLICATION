import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:danteai/providers/client_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

class ClientGroupsPage extends StatefulWidget {
  const ClientGroupsPage({super.key});

  @override
  State<ClientGroupsPage> createState() => _ClientGroupsPageState();
}

class _ClientGroupsPageState extends State<ClientGroupsPage> {
  int _currentIndex = 0;

  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ClientsProvider>(context, listen: false).fetchClients();
    });

    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text.trim().toLowerCase();
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onNavTap(int index) {
    setState(() => _currentIndex = index);
    switch (index) {
      case 0:
        break;
      case 1:
        context.go('/clientes/crear-cliente');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final clientsProvider = Provider.of<ClientsProvider>(context);
    final clients = clientsProvider.clients;
    final isLoading = clientsProvider.isLoading;

    // Filtrar clientes según búsqueda
    final filteredClients = _searchQuery.isEmpty
        ? clients
        : clients.where((client) {
            final nameLower = client.name.toLowerCase();
            final emailLower = client.email.toLowerCase();
            return nameLower.contains(_searchQuery) ||
                emailLower.contains(_searchQuery);
          }).toList();

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: TextField(
          controller: _searchController,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Buscar clientes...',
            hintStyle: const TextStyle(color: Colors.white70),
            prefixIcon: const Icon(Icons.search, color: Colors.white70),
            border: InputBorder.none,
            suffixIcon: _searchQuery.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear, color: Colors.white70),
                    onPressed: () {
                      _searchController.clear();
                    },
                  )
                : null,
          ),
        ),
      ),
      drawer: const AppDrawer(),
      body: Stack(
        children: [
          Positioned.fill(
            child: Opacity(
              opacity: 0.2,
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
                : filteredClients.isEmpty
                ? const Center(
                    child: Text(
                      'No hay clientes que coincidan con la búsqueda',
                      style: TextStyle(color: Colors.white70),
                    ),
                  )
                : ListView.separated(
                    itemCount: filteredClients.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final client = filteredClients[index];
                      return Card(
                        color: Colors.purple.shade900,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundImage: client.avatar != null
                                ? NetworkImage('$API_AVATAR${client.avatar}')
                                : const AssetImage(
                                        'assets/images/avatar_placeholder.png',
                                      )
                                      as ImageProvider,
                          ),
                          title: Text(
                            client.name,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          subtitle: Text(
                            client.email,
                            style: const TextStyle(color: Colors.white70),
                          ),
                          trailing: IconButton(
                            icon: const Icon(
                              Icons.arrow_forward_ios,
                              color: Colors.white70,
                            ),
                            onPressed: () {
                              context.go('/clientes/${client.id}');
                            },
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        backgroundColor: const Color(0xFF1A001A),
        selectedItemColor: Colors.purpleAccent,
        unselectedItemColor: Colors.white60,
        onTap: _onNavTap,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.group), label: 'Clientes'),
          BottomNavigationBarItem(
            icon: Icon(Icons.add),
            label: 'Crear cliente',
          ),
        ],
      ),
    );
  }
}
