// 📂 lib/features/messaging/pages/messaging_page.dart
import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_user.dart';
import 'package:danteai/features/messaging/pages/widgets/chat_page.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:danteai/presentation/widgets/messaging_navbar.dart';
import 'package:danteai/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart'; // <-- Importa go_router

class MessagingPage extends StatefulWidget {
  const MessagingPage({super.key});

  @override
  State<MessagingPage> createState() => _MessagingPageState();
}

class _MessagingPageState extends State<MessagingPage>
    with SingleTickerProviderStateMixin {
  final int _currentIndex = 0;
  late TextEditingController _searchController;
  List<UserModel> _filteredUsers = [];

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<UsersProvider>(context, listen: false);
      provider.fetchUsers().then((_) {
        setState(() {
          _filteredUsers = provider.users;
        });
      });
    });
    _searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    final provider = Provider.of<UsersProvider>(context, listen: false);
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredUsers = provider.users
          .where(
            (u) =>
                u.name.toLowerCase().contains(query) ||
                u.email.toLowerCase().contains(query),
          )
          .toList();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final usersProvider = Provider.of<UsersProvider>(context);
    final userId = context.read<UsersProvider>().currentUser?.id;

    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF140014),
        elevation: 1,
        title: const Text(
          'Mensajería Interna',
          style: TextStyle(
            color: Color(0xFFF2F2F2),
            fontSize: 22,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Color(0xFFF2F2F2)),
      ),
      drawer: const AppDrawer(),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Buscar por nombre o correo...',
                hintStyle: const TextStyle(color: Colors.white60),
                prefixIcon: const Icon(Icons.search, color: Colors.white60),
                filled: true,
                fillColor: const Color(0xFF1A001A),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
              style: const TextStyle(color: Colors.white),
            ),
          ),
          Expanded(
            child: usersProvider.isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      color: Colors.purpleAccent,
                    ),
                  )
                : _filteredUsers.isEmpty
                ? const Center(
                    child: Text(
                      'No hay usuarios disponibles.',
                      style: TextStyle(color: Colors.white54),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filteredUsers.length,
                    itemBuilder: (context, index) {
                      final user = _filteredUsers[index];
                      return AnimatedContainer(
                        duration: Duration(milliseconds: 300 + index * 30),
                        curve: Curves.easeOut,
                        margin: const EdgeInsets.only(bottom: 14),
                        decoration: BoxDecoration(
                          color: const Color(0xFF220022),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.deepPurple.shade900,
                            width: 1,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.4),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          leading: CircleAvatar(
                            backgroundColor: Colors.purple.shade900,
                            backgroundImage: user.avatarUrl != null
                                ? NetworkImage('$API_AVATAR${user.avatarUrl}')
                                : null,
                            child: user.avatarUrl == null
                                ? const Icon(Icons.person, color: Colors.white)
                                : null,
                          ),
                          title: Text(
                            user.name,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          subtitle: Text(
                            user.email,
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 13,
                            ),
                          ),
                          trailing: const Icon(
                            Icons.chevron_right,
                            color: Colors.white38,
                          ),
                          onTap: () {
                            if (userId != null) {
                              context.go(
                                '/chat',
                                extra: {
                                  'chatUser': user,
                                  'currentUserId': userId,
                                },
                              );
                            } else {
                              // Manejo simple en caso de no haber sesión activa
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'No se pudo obtener el usuario actual.',
                                  ),
                                ),
                              );
                            }
                          },
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      bottomNavigationBar: CommonBottomNavBar(currentIndex: _currentIndex),
    );
  }
}
