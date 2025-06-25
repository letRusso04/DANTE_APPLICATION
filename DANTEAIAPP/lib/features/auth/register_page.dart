import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import 'package:animated_background/animated_background.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:audioplayers/audioplayers.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final nameController = TextEditingController();
  final businessController = TextEditingController();

  late AnimationController _animController;
  late Animation<Offset> _slideAnimation;
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool isLoading = false;

  @override
  void initState() {
    super.initState();

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _slideAnimation =
        Tween<Offset>(begin: const Offset(0, 0.5), end: Offset.zero).animate(
          CurvedAnimation(parent: _animController, curve: Curves.easeOutExpo),
        );

    _animController.forward();
    _playMusic();
  }

  Future<void> _playMusic() async {
    try {
      await _audioPlayer.setReleaseMode(ReleaseMode.loop);
      await _audioPlayer.play(AssetSource('audio/space_ambient.mp3'));
      print("🎵 Música espacial iniciada.");
    } catch (e) {
      print("⚠️ Error al reproducir música: $e");
    }
  }

  @override
  void dispose() {
    _animController.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }

  void _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => isLoading = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => isLoading = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Empresa registrada correctamente")),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // 🌌 Fondo estrellado
          Positioned.fill(
            child: Image.asset('assets/images/space_bg.png', fit: BoxFit.cover),
          ),

          // ✨ Partículas
          Positioned.fill(
            child: AnimatedBackground(
              vsync: this,
              behaviour: RandomParticleBehaviour(
                options: ParticleOptions(
                  baseColor: Colors.white.withOpacity(0.7),
                  particleCount: 100,
                  spawnMinSpeed: 10,
                  spawnMaxSpeed: 30,
                  spawnOpacity: 0.2,
                  minOpacity: 0.1,
                  maxOpacity: 0.4,
                ),
              ),
              child: const SizedBox.expand(),
            ),
          ),

          // 🧾 Formulario
          Center(
            child: SlideTransition(
              position: _slideAnimation,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 64,
                ),
                child: Form(
                  key: _formKey,
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.65),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.purple.withOpacity(0.4),
                          blurRadius: 20,
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        DefaultTextStyle(
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                          child: AnimatedTextKit(
                            animatedTexts: [
                              TypewriterAnimatedText(
                                "Registra tu empresa",
                                speed: Duration(milliseconds: 80),
                              ),
                            ],
                            totalRepeatCount: 1,
                          ),
                        ),
                        const SizedBox(height: 24),
                        _buildInput(
                          emailController,
                          "Correo corporativo",
                          TextInputType.emailAddress,
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          passwordController,
                          "Contraseña",
                          TextInputType.text,
                          isPassword: true,
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          nameController,
                          "Tu nombre",
                          TextInputType.name,
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          businessController,
                          "Nombre de la empresa",
                          TextInputType.text,
                        ),
                        const SizedBox(height: 24),
                        isLoading
                            ? const CircularProgressIndicator(
                                color: Colors.purpleAccent,
                              )
                            : ElevatedButton(
                                onPressed: _submitForm,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF7A3DA3),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 48,
                                    vertical: 16,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  elevation: 8,
                                ),
                                child: const Text(
                                  "Registrar",
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.white,
                                  ), // Color fijo
                                ),
                              ),
                        const SizedBox(height: 12),
                        // 🔙 Botón para volver al login
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text(
                            "¿Ya tienes una cuenta? Inicia sesión",
                            style: TextStyle(
                              color: Colors.white70,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInput(
    TextEditingController controller,
    String label,
    TextInputType type, {
    bool isPassword = false,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: isPassword,
      keyboardType: type,
      style: const TextStyle(color: Colors.white),
      validator: (val) =>
          val == null || val.isEmpty ? 'Campo obligatorio' : null,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white70),
        filled: true,
        fillColor: Colors.white10,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
