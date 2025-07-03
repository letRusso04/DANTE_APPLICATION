import 'package:danteai/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:animated_background/animated_background.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:go_router/go_router.dart';

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
  final confirmPasswordController = TextEditingController();
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final rifController = TextEditingController();
  final businessController = TextEditingController();
  final addressController = TextEditingController();

  String selectedCountryCode = '+58';

  late AnimationController _animController;
  late Animation<Offset> _slideAnimation;
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool isLoading = false;

  final List<String> latamPrefixes = [
    '+54',
    '+591',
    '+55',
    '+56',
    '+57',
    '+506',
    '+53',
    '+593',
    '+503',
    '+502',
    '+504',
    '+52',
    '+505',
    '+507',
    '+595',
    '+51',
    '+1',
    '+598',
    '+58',
  ];

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _slideAnimation =
        Tween<Offset>(begin: const Offset(0, 0.2), end: Offset.zero).animate(
          CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic),
        );
    _animController.forward();
    _playMusic();
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
    _animController.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    if (passwordController.text != confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Las contraseñas no coinciden")),
      );
      return;
    }

    setState(() => isLoading = true);

    final success = await AuthProvider.register({
      'email': emailController.text.trim(),
      'password': passwordController.text,
      'name': nameController.text.trim(),
      'phone': '$selectedCountryCode ${phoneController.text.trim()}',
      'rif': rifController.text.trim(),
      'company_name': businessController.text.trim(),
      'address': addressController.text.trim(),
    });

    setState(() => isLoading = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Empresa registrada correctamente")),
      );
      context.go('/login');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Error al registrar empresa")),
      );
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
          Center(
            child: SlideTransition(
              position: _slideAnimation,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 48,
                ),
                child: Form(
                  key: _formKey,
                  child: Container(
                    padding: const EdgeInsets.all(32),
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
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          "Registro empresarial",
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 24),
                        _buildInput(
                          emailController,
                          "Correo corporativo",
                          TextInputType.emailAddress,
                          validator: (val) {
                            if (val == null || val.isEmpty)
                              return 'Campo obligatorio';
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
                          nameController,
                          "Nombre de dueño",
                          TextInputType.name,
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white10,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: DropdownButton<String>(
                                value: selectedCountryCode,
                                dropdownColor: const Color(0xFF1C1C2B),
                                underline: const SizedBox(),
                                style: const TextStyle(color: Colors.white),
                                items: latamPrefixes.map((code) {
                                  return DropdownMenuItem(
                                    value: code,
                                    child: Text(code),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  setState(() => selectedCountryCode = value!);
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: _buildInput(
                                phoneController,
                                "Teléfono de la empresa",
                                TextInputType.phone,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          businessController,
                          "Nombre de la empresa",
                          TextInputType.text,
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          rifController,
                          "RIF de la empresa",
                          TextInputType.text,
                          validator: (val) {
                            if (val == null || val.isEmpty)
                              return 'Campo obligatorio';
                            final rifRegex = RegExp(r'^[JGVEP]-\d{8}-\d$');
                            return rifRegex.hasMatch(val)
                                ? null
                                : 'Ejemplo formato esperado: J-12345678-9';
                          },
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          addressController,
                          "Ubicación fiscal de la empresa",
                          TextInputType.streetAddress,
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          passwordController,
                          "Contraseña",
                          TextInputType.text,
                          isPassword: true,
                          validator: (val) {
                            if (val == null || val.isEmpty)
                              return 'Campo obligatorio';
                            return val.length < 6
                                ? 'Mínimo 6 caracteres'
                                : null;
                          },
                        ),
                        const SizedBox(height: 12),
                        _buildInput(
                          confirmPasswordController,
                          "Confirmar contraseña",
                          TextInputType.text,
                          isPassword: true,
                        ),
                        const SizedBox(height: 24),
                        isLoading
                            ? const CircularProgressIndicator(
                                color: Colors.deepPurpleAccent,
                              )
                            : SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: _submitForm,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.deepPurpleAccent,
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 16,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  child: const Text(
                                    "Registrar empresa",
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => context.go('/login'),
                          child: const Text(
                            "¿Ya tienes una cuenta? Inicia sesión",
                            style: TextStyle(
                              color: Colors.white60,
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
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: isPassword,
      keyboardType: type,
      style: const TextStyle(color: Colors.white),
      validator:
          validator ??
          (val) => val == null || val.isEmpty ? 'Campo obligatorio' : null,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white70),
        filled: true,
        fillColor: Colors.white10,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
