import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_user.dart';
import 'package:danteai/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart'; // Asegúrate de tener provider instalado

class LoginAsUserDialog extends StatefulWidget {
  final UserModel user;

  const LoginAsUserDialog({super.key, required this.user});

  @override
  State<LoginAsUserDialog> createState() => _LoginAsUserDialogState();
}

class _LoginAsUserDialogState extends State<LoginAsUserDialog> {
  final _formKey = GlobalKey<FormState>();
  String _password = '';
  bool _isLoading = false;
  String? _error;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF1E1E1E),
      insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 28),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircleAvatar(
                radius: 40,
                backgroundImage:
                    widget.user.avatarUrl != null &&
                        widget.user.avatarUrl!.isNotEmpty
                    ? NetworkImage('$API_AVATAR${widget.user.avatarUrl}')
                    : const AssetImage('assets/avatar_placeholder.png')
                          as ImageProvider,
              ),
              const SizedBox(height: 12),
              Text(
                widget.user.name,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 25,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                widget.user.jobTitle ?? '',
                style: const TextStyle(color: Colors.grey, fontSize: 24),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 18, 1, 77),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  widget.user.role,
                  style: const TextStyle(color: Colors.white, fontSize: 20),
                ),
              ),
              const SizedBox(height: 20),
              TextFormField(
                style: const TextStyle(color: Colors.white),
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Contraseña',
                  labelStyle: const TextStyle(color: Colors.white70),
                  filled: true,
                  fillColor: const Color(0xFF2C2C2C),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  prefixIcon: const Icon(Icons.lock, color: Colors.white54),
                ),
                validator: (val) =>
                    val == null || val.isEmpty ? 'Campo requerido' : null,
                onSaved: (val) => _password = val!,
              ),
              if (_error != null) ...[
                const SizedBox(height: 8),
                Text(_error!, style: const TextStyle(color: Colors.redAccent)),
              ],
              const SizedBox(height: 20),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(
                          const Color.fromARGB(239, 2, 1, 53),
                        ),
                      ),
                      onPressed: () async {
                        if (_formKey.currentState!.validate()) {
                          _formKey.currentState!.save();
                          setState(() {
                            _isLoading = true;
                            _error = null;
                          });

                          final usersProvider = Provider.of<UsersProvider>(
                            context,
                            listen: false,
                          );
                          final success = await usersProvider.loginUser(
                            email: widget.user.email,
                            password: _password,
                          );

                          setState(() {
                            _isLoading = false;
                          });

                          if (success) {
                            // Navega a /dashboard y cierra el diálogo
                            Navigator.of(context).pop(); // Cierra el diálogo
                            GoRouter.of(context).go('/dashboard');

                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  'Ingreso exitoso como ${widget.user.name}',
                                ),
                              ),
                            );
                          } else {
                            setState(() {
                              _error =
                                  usersProvider.errorMessage ??
                                  'Error al ingresar';
                            });
                          }
                        }
                      },
                      child: const Text(
                        "Ingresar",
                        style: TextStyle(color: Colors.white, fontSize: 18),
                      ),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
