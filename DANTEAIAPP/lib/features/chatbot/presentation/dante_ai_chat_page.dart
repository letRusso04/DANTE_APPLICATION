import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:flutter/material.dart';

class DanteAIChatPage extends StatefulWidget {
  const DanteAIChatPage({super.key});

  @override
  State<DanteAIChatPage> createState() => _DanteAIChatPageState();
}

class _DanteAIChatPageState extends State<DanteAIChatPage> {
  int _selectedIndex = 0;

  void _onNavTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final TextEditingController _inputController = TextEditingController();

  final List<_ChatMessage> _messages = [
    _ChatMessage(
      sender: 'DanteAI',
      message: 'Hola, soy DanteAI. ¿En qué puedo ayudarte hoy?',
      isUser: false,
    ),
  ];

  void _sendMessage() {
    final text = _inputController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(_ChatMessage(sender: 'Tú', message: text, isUser: true));
      _messages.add(
        _ChatMessage(
          sender: 'DanteAI',
          message: 'Esta es una respuesta simulada basada en la base de datos.',
          isUser: false,
        ),
      );
    });

    _inputController.clear();
  }

  Widget _buildChat() {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            itemCount: _messages.length,
            itemBuilder: (context, index) {
              final msg = _messages[index];
              return Align(
                alignment: msg.isUser
                    ? Alignment.centerRight
                    : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 6),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    gradient: msg.isUser
                        ? const LinearGradient(
                            colors: [Color(0xFF9B59B6), Color(0xFF8E44AD)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          )
                        : const LinearGradient(
                            colors: [Color(0xFF6C3483), Color(0xFF512E5F)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(12),
                      topRight: const Radius.circular(12),
                      bottomLeft: Radius.circular(msg.isUser ? 12 : 0),
                      bottomRight: Radius.circular(msg.isUser ? 0 : 12),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color:
                            (msg.isUser
                                    ? Colors.purple.shade700
                                    : Colors.purple.shade900)
                                .withOpacity(0.5),
                        blurRadius: 6,
                        offset: const Offset(2, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    msg.message,
                    style: const TextStyle(color: Colors.white, fontSize: 15),
                  ),
                ),
              );
            },
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF4A235A), Color(0xFF641E16)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.purple.shade900.withOpacity(0.7),
                blurRadius: 8,
              ),
            ],
          ),
          child: Row(
            children: [
              IconButton(
                onPressed: () {
                  // TODO: implementar voz
                },
                icon: Icon(Icons.mic, color: Colors.purple.shade200),
              ),
              Expanded(
                child: TextField(
                  controller: _inputController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    hintText: 'Escribe tu mensaje...',
                    hintStyle: TextStyle(color: Colors.white54),
                    border: InputBorder.none,
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
              IconButton(
                onPressed: _sendMessage,
                icon: Icon(Icons.send, color: Colors.purple.shade200),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildVoicePlaceholder() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF4A235A), Color(0xFF641E16)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.mic_none, size: 100, color: Colors.purple.shade200),
            const SizedBox(height: 20),
            const Text(
              'Funcionalidad de hablar por voz\npróximamente disponible.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70, fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: Colors.transparent,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(60),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF4A235A), Color(0xFF641E16)],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black54,
                blurRadius: 6,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: SafeArea(
            child: Row(
              children: [
                Builder(
                  builder: (context) => IconButton(
                    icon: const Icon(Icons.menu, color: Colors.white),
                    onPressed: () => Scaffold.of(context).openDrawer(),
                  ),
                ),
                const Expanded(
                  child: Center(
                    child: Text(
                      'Hablar con DanteAI',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 20,
                        letterSpacing: 1.1,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 48), // Espacio para equilibrar el menú
              ],
            ),
          ),
        ),
      ),
      extendBodyBehindAppBar: false,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF2C003E), Color(0xFF4A0019)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: _selectedIndex == 0 ? _buildChat() : _buildVoicePlaceholder(),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFF4A0019),
        selectedItemColor: Colors.purpleAccent,
        unselectedItemColor: Colors.white70,
        currentIndex: _selectedIndex,
        onTap: _onNavTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'DanteAI'),
          BottomNavigationBarItem(icon: Icon(Icons.mic), label: 'Hablar voz'),
        ],
      ),
    );
  }
}

class _ChatMessage {
  final String sender;
  final String message;
  final bool isUser;

  _ChatMessage({
    required this.sender,
    required this.message,
    required this.isUser,
  });
}
