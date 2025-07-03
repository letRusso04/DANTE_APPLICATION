import 'dart:io';

import 'package:danteai/core/models/model_category.dart';
import 'package:danteai/presentation/widgets/app_drawer.dart';
import 'package:danteai/providers/category_provider.dart';
import 'package:danteai/providers/product_provider.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

class CrearProductoPage extends StatefulWidget {
  const CrearProductoPage({super.key});

  @override
  State<CrearProductoPage> createState() => _CrearProductoPageState();
}

class _CrearProductoPageState extends State<CrearProductoPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameCtrl = TextEditingController();
  final TextEditingController _descCtrl = TextEditingController();
  final TextEditingController _priceCtrl = TextEditingController();
  final TextEditingController _stockCtrl = TextEditingController();
  File? selectedImage;
  String? categoryId;

  @override
  void initState() {
    super.initState();
    context.read<CategoryProvider>().fetchCategories();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() {
        selectedImage = File(picked.path);
      });
    }
  }

  Future<void> _submit() async {
    if (_formKey.currentState?.validate() != true || categoryId == null) return;

    final provider = context.read<ProductsProvider>();
    final success = await provider.createProduct(
      name: _nameCtrl.text.trim(),
      description: _descCtrl.text.trim(),
      price: double.parse(_priceCtrl.text),
      stock: int.parse(_stockCtrl.text),
      categoryId: categoryId!,
      imageFile: selectedImage,
    );

    if (success && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Producto creado exitosamente")),
      );
      context.go('/producto');
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Error al crear producto")));
    }
  }

  @override
  Widget build(BuildContext context) {
    final categories = context.watch<CategoryProvider>().categories;

    return Scaffold(
      drawer: const AppDrawer(),
      backgroundColor: const Color(0xFF0D000D),
      appBar: AppBar(
        title: const Text(
          "Nuevo Producto",
          style: TextStyle(
            color: Color(0xFFD0A2F7),
            fontWeight: FontWeight.bold,
            fontSize: 22,
          ),
        ),
        backgroundColor: const Color(0xFF1A0A1F),
        iconTheme: const IconThemeData(color: Color(0xFFD0A2F7)),
        centerTitle: true,
        elevation: 4,
        shadowColor: Colors.deepPurpleAccent.withOpacity(0.2),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nameCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Nombre del producto'),
                validator: (val) =>
                    val == null || val.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descCtrl,
                style: const TextStyle(color: Colors.white),
                maxLines: 3,
                decoration: _inputDecoration('Descripción'),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _priceCtrl,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Precio (\$)'),
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Campo requerido';
                  if (double.tryParse(val) == null) return 'Debe ser numérico';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _stockCtrl,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Stock disponible'),
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Campo requerido';
                  if (int.tryParse(val) == null) return 'Debe ser un entero';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: categoryId,
                items: categories
                    .map(
                      (CategoryModel cat) => DropdownMenuItem(
                        value: cat.id,
                        child: Text(cat.name),
                      ),
                    )
                    .toList(),
                onChanged: (val) => setState(() => categoryId = val),
                validator: (val) =>
                    val == null ? 'Selecciona una categoría' : null,
                decoration: _inputDecoration('Categoría'),
                dropdownColor: const Color(0xFF1A0A1F),
                iconEnabledColor: Color(0xFFD0A2F7),
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: _pickImage,
                icon: const Icon(Icons.image, color: Color(0xFFD0A2F7)),
                label: const Text(
                  "Seleccionar imagen",
                  style: TextStyle(color: Color(0xFFD0A2F7)),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFFD0A2F7)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              if (selectedImage != null)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.file(
                      selectedImage!,
                      height: 150,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _submit,
                  icon: const Icon(Icons.save),
                  label: const Text("Guardar producto"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD0A2F7),
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    textStyle: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFF1A0A1F),
        selectedItemColor: const Color(0xFFD0A2F7),
        unselectedItemColor: Colors.white54,
        currentIndex: 1,
        onTap: (index) {
          if (index == 0) {
            context.go('/producto');
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.list), label: 'Productos'),
          BottomNavigationBarItem(icon: Icon(Icons.add_box), label: 'Crear'),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFFD0A2F7)),
      filled: true,
      fillColor: const Color(0xFF1A0A1F),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFD0A2F7)),
      ),
    );
  }
}
