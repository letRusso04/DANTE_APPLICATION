import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_ticket.dart';
import 'package:danteai/providers/ticket_provider.dart';
import 'package:danteai/presentation/widgets/messaging_navbar.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class TicketsListPage extends StatefulWidget {
  const TicketsListPage({super.key});

  @override
  State<TicketsListPage> createState() => _TicketsListPageState();
}

class _TicketsListPageState extends State<TicketsListPage> {
  String searchQuery = '';
  String filterStatus = 'todos';

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<SupportTicketProvider>(context, listen: false).fetchTickets();
    });
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'abierto':
        return Colors.deepPurpleAccent;
      case 'en proceso':
        return Colors.orangeAccent;
      case 'cerrado':
        return Colors.green;
      case 'rechazado':
        return Colors.redAccent;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'abierto':
        return Icons.mail_outline;
      case 'en proceso':
        return Icons.autorenew;
      case 'cerrado':
        return Icons.check_circle_outline;
      case 'rechazado':
        return Icons.cancel_outlined;
      default:
        return Icons.help_outline;
    }
  }

  void _showTicketDetailsBottomSheet(
    BuildContext context,
    SupportTicketModel ticket,
    SupportTicketProvider provider,
  ) {
    final user = ticket.user;
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1A001A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      isScrollControlled: true,
      builder: (_) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        builder: (_, scrollController) => SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize:
                MainAxisSize.min, // para que no tome más espacio del necesario
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Text(
                ticket.subject,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                ticket.description,
                style: const TextStyle(color: Colors.white70, fontSize: 16),
              ),

              const SizedBox(height: 20),
              Row(
                children: [
                  const Icon(
                    Icons.calendar_today,
                    size: 16,
                    color: Colors.white30,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Creado: ${DateFormat('dd/MM/yyyy HH:mm').format(ticket.createdAt)}',
                    style: const TextStyle(color: Colors.white38),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  const Icon(
                    Icons.info_outline,
                    size: 16,
                    color: Colors.white30,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Estado: ${ticket.status}',
                    style: TextStyle(
                      color: _getStatusColor(ticket.status),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20), // separación pequeña

              if (user != null)
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    radius: 28,
                    backgroundImage: user.avatarUrl != null
                        ? NetworkImage('$API_AVATAR${user.avatarUrl}')
                        : null,
                    backgroundColor: Colors.grey[700],
                    child: user.avatarUrl == null
                        ? const Icon(Icons.person, size: 30)
                        : null,
                  ),
                  title: Text(
                    user.name,
                    style: const TextStyle(color: Colors.white, fontSize: 16),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.email,
                        style: const TextStyle(color: Colors.white70),
                      ),
                      if (user.phone != null && user.phone!.isNotEmpty)
                        Text(
                          'Tel: ${user.phone}',
                          style: const TextStyle(color: Colors.white60),
                        ),
                      if (user.jobTitle != null && user.jobTitle!.isNotEmpty)
                        Text(
                          'Cargo: ${user.jobTitle}',
                          style: const TextStyle(color: Colors.white60),
                        ),
                    ],
                  ),
                ),

              const SizedBox(height: 20),

              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _statusButton(
                    'Abierto',
                    Colors.deepPurpleAccent,
                    ticket,
                    provider,
                  ),
                  _statusButton(
                    'En proceso',
                    Colors.orangeAccent,
                    ticket,
                    provider,
                  ),
                  _statusButton('Cerrado', Colors.green, ticket, provider),
                  _statusButton(
                    'Rechazado',
                    Colors.redAccent,
                    ticket,
                    provider,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statusButton(
    String label,
    Color color,
    SupportTicketModel ticket,
    SupportTicketProvider provider,
  ) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: color.withOpacity(0.1),
        foregroundColor: color,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      ),
      onPressed: () async {
        final updatedTicket = SupportTicketModel(
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description,
          status: label.toLowerCase(),
          createdAt: ticket.createdAt,
          userId: ticket.userId,
          user: ticket.user,
        );
        final success = await provider.updateTicket(updatedTicket);
        if (success) {
          Navigator.of(context).pop();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Estado actualizado a "$label"')),
          );
        }
      },
      child: Text(label),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ticketsProvider = context.watch<SupportTicketProvider>();
    final List<SupportTicketModel> tickets = ticketsProvider.tickets;
    final isLoading = ticketsProvider.isLoading;

    final filteredTickets = tickets.where((ticket) {
      final subject = ticket.subject.toLowerCase();
      final userName = ticket.user?.name.toLowerCase() ?? '';
      final query = searchQuery.toLowerCase();
      final matchesQuery = subject.contains(query) || userName.contains(query);
      final status = ticket.status.toLowerCase();
      final matchesStatus =
          filterStatus == 'todos' ||
          (filterStatus == 'abierto' && status == 'abierto') ||
          (filterStatus == 'en proceso' && status == 'en proceso') ||
          (filterStatus == 'cerrado' && status == 'cerrado') ||
          (filterStatus == 'rechazado' && status == 'rechazado');
      return matchesQuery && matchesStatus;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0E0011),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1A001A),
        title: const Text(
          'Tickets de Soporte',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Buscar por asunto o usuario...',
                hintStyle: const TextStyle(color: Colors.white54),
                prefixIcon: const Icon(Icons.search, color: Colors.white54),
                filled: true,
                fillColor: const Color(0xFF1A001A),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
              onChanged: (value) => setState(() => searchQuery = value),
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children:
                    [
                          _buildFilterTab('Todos', 'todos'),
                          _buildFilterTab('Abierto', 'abierto'),
                          _buildFilterTab('En proceso', 'en proceso'),
                          _buildFilterTab('Cerrado', 'cerrado'),
                          _buildFilterTab('Rechazado', 'rechazado'),
                        ]
                        .map(
                          (e) => Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: e,
                          ),
                        )
                        .toList(),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      color: Colors.purpleAccent,
                    ),
                  )
                : filteredTickets.isEmpty
                ? const Center(
                    child: Text(
                      'No hay tickets disponibles.',
                      style: TextStyle(color: Colors.white70),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: filteredTickets.length,
                    itemBuilder: (context, index) {
                      final ticket = filteredTickets[index];
                      final dateFormatted = DateFormat(
                        'dd/MM/yyyy HH:mm',
                      ).format(ticket.createdAt);

                      return Card(
                        color: const Color(0xFF1A001A),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 4,
                        margin: const EdgeInsets.only(bottom: 16),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          leading: CircleAvatar(
                            backgroundColor: _getStatusColor(ticket.status),
                            child: Icon(
                              _getStatusIcon(ticket.status),
                              color: Colors.white,
                            ),
                          ),
                          title: Text(
                            ticket.subject,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 6),
                              Text(
                                'Estado: ${ticket.status}',
                                style: const TextStyle(color: Colors.white70),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  if (ticket.user?.avatarUrl != null)
                                    CircleAvatar(
                                      radius: 12,
                                      backgroundImage: NetworkImage(
                                        '$API_AVATAR${ticket.user?.avatarUrl}',
                                      ),
                                    )
                                  else
                                    const CircleAvatar(
                                      radius: 12,
                                      backgroundColor: Colors.grey,
                                      child: Icon(Icons.person, size: 16),
                                    ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      ticket.user != null
                                          ? '${ticket.user!.name} (${ticket.user!.email})'
                                          : 'Usuario desconocido',
                                      style: const TextStyle(
                                        color: Colors.white54,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Fecha: $dateFormatted',
                                style: const TextStyle(color: Colors.white30),
                              ),
                            ],
                          ),
                          trailing: const Icon(
                            Icons.arrow_forward_ios,
                            color: Colors.white24,
                            size: 18,
                          ),
                          onTap: () => _showTicketDetailsBottomSheet(
                            context,
                            ticket,
                            ticketsProvider,
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      bottomNavigationBar: const CommonBottomNavBar(currentIndex: 2),
    );
  }

  Widget _buildFilterTab(String label, String statusKey) {
    final isSelected = filterStatus == statusKey;
    return GestureDetector(
      onTap: () => setState(() => filterStatus = statusKey),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.deepPurpleAccent : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? Colors.deepPurpleAccent : Colors.white54,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.white70,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
