import 'package:flutter/material.dart';
import 'package:animated_background/animated_background.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:audioplayers/audioplayers.dart';
import "package:go_router/go_router.dart";

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with TickerProviderStateMixin {
  late final AnimationController _formController;
  late final Animation<Offset> _slideAnimation;
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _showAstronaut = false;
  bool isLoading = false;

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();

    _formController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _slideAnimation =
        Tween<Offset>(begin: const Offset(0, 0.4), end: Offset.zero).animate(
          CurvedAnimation(parent: _formController, curve: Curves.easeOutExpo),
        );

    Future.delayed(const Duration(milliseconds: 500), () {
      setState(() {
        _showAstronaut = true;
      });
      _formController.forward();
      _playMusic();
    });
  }

  Future<void> _playMusic() async {
    try {
      await _audioPlayer.setReleaseMode(ReleaseMode.loop);
      await _audioPlayer.play(AssetSource('audio/space_ambient.mp3'));
      print("🎵 Música espacial iniciada en login.");
    } catch (e) {
      print("⚠️ Error al reproducir música: $e");
    }
  }

  @override
  void dispose() {
    _formController.dispose();
    _audioPlayer.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void _submitLogin() async {
    setState(() => isLoading = true);
    await Future.delayed(const Duration(seconds: 2)); // Simular login
    setState(() => isLoading = false);
    context.go('/dashboard');
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text("Login exitoso")));
    // Aquí puedes navegar a la pantalla principal
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Fondo estrellado
          Positioned.fill(
            child: Image.asset('assets/images/space_bg.png', fit: BoxFit.cover),
          ),
          // Partículas animadas
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

          // Astronauta animado
          AnimatedPositioned(
            duration: const Duration(milliseconds: 5000),
            curve: Curves.easeOutBack,
            bottom: 0,
            left: _showAstronaut ? 200 : -200,
            child: Image.asset('assets/images/astronaut.png', height: 260),
          ),

          // Formulario animado
          Center(
            child: SlideTransition(
              position: _slideAnimation,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.65),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.purple.withOpacity(0.5),
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
                              'LOGIN DE EMPRESA',
                              speed: const Duration(milliseconds: 80),
                            ),
                          ],
                          totalRepeatCount: 1,
                        ),
                      ),
                      const SizedBox(height: 24),
                      _buildInput(emailController, 'Email corporativo'),
                      const SizedBox(height: 12),
                      _buildInput(
                        passwordController,
                        'Contraseña',
                        isPassword: true,
                      ),
                      const SizedBox(height: 24),
                      isLoading
                          ? const CircularProgressIndicator(
                              color: Colors.purpleAccent,
                            )
                          : _buildButton(),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: () {
                          Navigator.pushReplacementNamed(context, '/register');
                        },
                        child: const Text(
                          '¿No tienes cuenta? Regístrate',
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
        ],
      ),
    );
  }

  Widget _buildInput(
    TextEditingController controller,
    String label, {
    bool isPassword = false,
  }) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      style: const TextStyle(color: Colors.white),
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

  Widget _buildButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _submitLogin,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF7A3DA3),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 8,
          shadowColor: Colors.purpleAccent,
        ),
        child: const Text(
          "Ingresar",
          style: TextStyle(fontSize: 16, color: Colors.white),
        ),
      ),
    );
  }
}
