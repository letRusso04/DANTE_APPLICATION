import 'dart:convert';

import 'package:danteai/core/storage/auth_storage.dart';
import 'package:danteai/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:animated_background/animated_background.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

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

  final _formKey = GlobalKey<FormState>();
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
        Tween<Offset>(begin: const Offset(0, 0.2), end: Offset.zero).animate(
          CurvedAnimation(parent: _formController, curve: Curves.easeOutCubic),
        );
    Future.delayed(const Duration(milliseconds: 500), () {
      setState(() => _showAstronaut = true);
      _formController.forward();
      _playMusic();
    });
  }

  Future<void> _playMusic() async {
    try {
      await _audioPlayer.setReleaseMode(ReleaseMode.loop);
      await _audioPlayer.play(AssetSource('audio/space_ambient.mp3'));
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

  Future<void> _submitLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => isLoading = true);
    final res = await AuthProvider.login(
      emailController.text.trim(),
      passwordController.text.trim(),
    );
    setState(() => isLoading = false);
    String token = res?['access_token'];
    if (res != null && res['access_token'] != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', res['access_token']);
      await prefs.setString('company', jsonEncode(res['company']));

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Login exitoso")));
      context.go('/usuarios');
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Credenciales inválidas")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F1A),
      body: Stack(
        children: [
          Positioned.fill(child: Container(color: const Color(0xFF0F0F1A))),
          Positioned.fill(
            child: AnimatedBackground(
              vsync: this,
              behaviour: RandomParticleBehaviour(
                options: ParticleOptions(
                  baseColor: Colors.white.withOpacity(0.1),
                  particleCount: 40,
                  spawnMinSpeed: 5,
                  spawnMaxSpeed: 10,
                  spawnOpacity: 0.05,
                  minOpacity: 0.02,
                  maxOpacity: 0.1,
                ),
              ),
              child: const SizedBox.expand(),
            ),
          ),
          AnimatedPositioned(
            duration: const Duration(milliseconds: 4000),
            curve: Curves.easeOutBack,
            bottom: 0,
            left: _showAstronaut ? 150 : -250,
            child: Image.asset('assets/images/astronaut.png', height: 240),
          ),
          Center(
            child: SlideTransition(
              position: _slideAnimation,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Container(
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C1C2B),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.3),
                        blurRadius: 15,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          'Iniciar sesión',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 24),
                        _buildInput(
                          emailController,
                          'Correo corporativo',
                          validator: (val) {
                            if (val == null || val.isEmpty) {
                              return 'Campo obligatorio';
                            }
                            final emailRegex = RegExp(
                              r'^[^@\s]+@[^@\s]+\.[^@\s]+$',
                            );
                            return emailRegex.hasMatch(val)
                                ? null
                                : 'Formato esperado: ejemplo@dominio.com';
                          },
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          passwordController,
                          'Contraseña',
                          isPassword: true,
                          validator: (val) {
                            if (val == null || val.isEmpty) {
                              return 'Campo obligatorio';
                            }
                            return val.length >= 6
                                ? null
                                : 'Mínimo 6 caracteres';
                          },
                        ),
                        const SizedBox(height: 24),
                        isLoading
                            ? const CircularProgressIndicator(
                                color: Colors.deepPurpleAccent,
                              )
                            : _buildButton(),
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => context.go('/register'),
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
          ),
        ],
      ),
    );
  }

  Widget _buildInput(
    TextEditingController controller,
    String label, {
    bool isPassword = false,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: isPassword,
      style: const TextStyle(color: Colors.white),
      validator: validator,
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
          backgroundColor: Colors.deepPurpleAccent,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 6,
        ),
        child: const Text(
          "Ingresar",
          style: TextStyle(fontSize: 16, color: Colors.white),
        ),
      ),
    );
  }
}
