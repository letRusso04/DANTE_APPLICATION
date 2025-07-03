import 'dart:io';

import 'package:danteai/core/models/model_client.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:danteai/providers/client_provider.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class CrearClientePage extends StatefulWidget {
  const CrearClientePage({super.key});

  @override
  State<CrearClientePage> createState() => _CrearClientePageState();
}

class _CrearClientePageState extends State<CrearClientePage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nombreController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _telefonoController = TextEditingController();
  final TextEditingController _direccionController = TextEditingController();
  final TextEditingController _documentoController = TextEditingController();
  String _tipoDocumento = 'DNI';

  File? _imagenSeleccionada;
  bool _isSubmitting = false;
  int _currentIndex = 1;

  void _onNavTap(int index) {
    if (index == 0) {
      context.go('/clientes');
    }
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final XFile? imagen = await picker.pickImage(source: ImageSource.gallery);
    if (imagen != null) {
      setState(() {
        _imagenSeleccionada = File(imagen.path);
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Por favor completa todos los campos.")),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final provider = context.read<ClientsProvider>();

    final success = await provider.createClient(
      name: _nombreController.text.trim(),
      email: _emailController.text.trim(),
      phone: _telefonoController.text.trim(),
      address: _direccionController.text.trim(),
      documentType: _tipoDocumento,
      documentNumber: _documentoController.text.trim(),
      imageFile: _imagenSeleccionada,
    );

    setState(() => _isSubmitting = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Cliente creado exitosamente")),
      );
      context.pop();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Error al crear el cliente")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: const Color(0xFF0A000A),
      appBar: AppBar(
        title: const Text(
          "Registrar Cliente",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF1C0D1C),
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
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
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E0A1E).withOpacity(0.85),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.deepPurple.withOpacity(0.3),
                      blurRadius: 20,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      "Nuevo Cliente",
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _buildTextField(_nombreController, "Nombre completo"),
                    _buildTextField(_emailController, "Correo electrónico"),
                    _buildTextField(_telefonoController, "Teléfono"),
                    _buildTextField(_direccionController, "Dirección"),
                    DropdownButtonFormField<String>(
                      value: _tipoDocumento,
                      dropdownColor: const Color(0xFF2D002D),
                      decoration: _inputDecoration("Tipo de documento"),
                      style: const TextStyle(color: Colors.white),
                      items: ['DNI', 'RIF', 'Pasaporte']
                          .map(
                            (doc) =>
                                DropdownMenuItem(value: doc, child: Text(doc)),
                          )
                          .toList(),
                      onChanged: (value) =>
                          setState(() => _tipoDocumento = value!),
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      _documentoController,
                      "Número de documento",
                    ),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: _pickImage,
                      child: Container(
                        width: double.infinity,
                        height: 160,
                        decoration: BoxDecoration(
                          color: Colors.white10,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.white30),
                        ),
                        child: _imagenSeleccionada != null
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(16),
                                child: Image.file(
                                  _imagenSeleccionada!,
                                  fit: BoxFit.cover,
                                ),
                              )
                            : const Center(
                                child: Text(
                                  "Toca para seleccionar imagen",
                                  style: TextStyle(color: Colors.white70),
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _submit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.deepPurple,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: _isSubmitting
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
                            : const Text(
                                "Registrar Cliente",
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white,
                                ),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        backgroundColor: const Color(0xFF1A001A),
        selectedItemColor: Colors.deepPurpleAccent,
        unselectedItemColor: Colors.white60,
        onTap: _onNavTap,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.group), label: 'Clientes'),
          BottomNavigationBarItem(icon: Icon(Icons.person_add), label: 'Nuevo'),
        ],
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: controller,
        style: const TextStyle(color: Colors.white),
        decoration: _inputDecoration(label),
        validator: (value) =>
            value == null || value.isEmpty ? 'Campo obligatorio' : null,
      ),
    );
  }

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.white70),
      filled: true,
      fillColor: Colors.white10,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide.none,
      ),
    );
  }
}
