import 'dart:io';

import 'package:danteai/core/config/config_server.dart';
import 'package:danteai/core/models/model_product.dart';
import 'package:danteai/providers/product_provider.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class ProductDetailPage extends StatelessWidget {
  final ProductModel product;

  const ProductDetailPage({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0D0D),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.deepPurpleAccent),
        title: Text(
          product.name,
          style: const TextStyle(
            color: Colors.deepPurpleAccent,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Imagen
            Stack(
              children: [
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: product.imageUrl != null
                      ? Image.network(
                          '$API_AVATAR${product.imageUrl}',
                          width: double.infinity,
                          fit: BoxFit.cover,
                        )
                      : Container(
                          color: const Color(0xFF1A1A1A),
                          child: const Center(
                            child: Icon(
                              Icons.image_not_supported,
                              size: 80,
                              color: Colors.white54,
                            ),
                          ),
                        ),
                ),
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.black.withOpacity(0.6),
                        Colors.transparent,
                      ],
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Nombre
                  Text(
                    product.name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Precio
                  Text(
                    "\$${product.price.toStringAsFixed(2)}",
                    style: const TextStyle(
                      color: Colors.deepPurpleAccent,
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Stock y estado
                  Row(
                    children: [
                      Icon(Icons.inventory, color: Colors.white70),
                      const SizedBox(width: 8),
                      Text(
                        "Stock: ${product.stock}",
                        style: const TextStyle(color: Colors.white70),
                      ),
                      const SizedBox(width: 20),
                      Icon(
                        product.isActive
                            ? Icons.check_circle
                            : Icons.cancel_outlined,
                        color: product.isActive
                            ? Colors.greenAccent
                            : Colors.red,
                        size: 20,
                      ),
                      const SizedBox(width: 6),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Descripción
                  const Text(
                    "Descripción",
                    style: TextStyle(
                      color: Colors.deepPurpleAccent,
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    product.description,
                    style: const TextStyle(color: Colors.white70, height: 1.5),
                  ),
                  const SizedBox(height: 24),

                  // Fecha y categoría
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        color: Colors.white38,
                        size: 16,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        "Creado: ${product.createdAt.toLocal().toString().split(' ')[0]}",
                        style: const TextStyle(
                          color: Colors.white38,
                          fontSize: 12,
                        ),
                      ),
                      const Spacer(),
                      Icon(Icons.category, color: Colors.white38, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        product.categoryId,
                        style: const TextStyle(
                          color: Colors.white38,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Botón de acción
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        _showEditBottomSheet(context);
                      },
                      icon: const Icon(Icons.edit),
                      label: const Text("Editar Producto"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurpleAccent,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        textStyle: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditBottomSheet(BuildContext context) {
    final _formKey = GlobalKey<FormState>();
    final _nameCtrl = TextEditingController(text: product.name);
    final _descCtrl = TextEditingController(text: product.description);
    final _priceCtrl = TextEditingController(text: product.price.toString());
    final _stockCtrl = TextEditingController(text: product.stock.toString());
    final _isActive = ValueNotifier<bool>(product.isActive);
    final _imageFile = ValueNotifier<File?>(null);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1A1A2E),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom,
            top: 24,
            left: 24,
            right: 24,
          ),
          child: StatefulBuilder(
            builder: (context, setState) {
              Future<void> _pickImage() async {
                final picker = ImagePicker();
                final picked = await picker.pickImage(
                  source: ImageSource.gallery,
                );
                if (picked != null) {
                  setState(() {
                    _imageFile.value = File(picked.path);
                  });
                }
              }

              Future<void> _submitEdit() async {
                if (!_formKey.currentState!.validate()) return;

                final provider = context.read<ProductsProvider>();
                final success = await provider.updateProduct(
                  productId: product.id,
                  name: _nameCtrl.text.trim(),
                  description: _descCtrl.text.trim(),
                  price:
                      double.tryParse(_priceCtrl.text.trim()) ?? product.price,
                  stock: int.tryParse(_stockCtrl.text.trim()) ?? product.stock,
                  imageFile: _imageFile.value,
                );

                if (success) {
                  Navigator.of(ctx).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Producto actualizado correctamente"),
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Error al actualizar producto"),
                    ),
                  );
                }
              }

              return SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        height: 5,
                        width: 40,
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.deepPurpleAccent.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      TextFormField(
                        controller: _nameCtrl,
                        style: const TextStyle(color: Colors.white),
                        decoration: _inputDecoration('Nombre'),
                        validator: (val) =>
                            val == null || val.isEmpty ? 'Requerido' : null,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _descCtrl,
                        style: const TextStyle(color: Colors.white),
                        maxLines: 3,
                        decoration: _inputDecoration('Descripción'),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _priceCtrl,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(color: Colors.white),
                        decoration: _inputDecoration('Precio'),
                        validator: (val) {
                          if (val == null || val.isEmpty) return 'Requerido';
                          if (double.tryParse(val) == null)
                            return 'Debe ser numérico';
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _stockCtrl,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(color: Colors.white),
                        decoration: _inputDecoration('Stock'),
                        validator: (val) {
                          if (val == null || val.isEmpty) return 'Requerido';
                          if (int.tryParse(val) == null)
                            return 'Debe ser entero';
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),

                      // Imagen
                      Row(
                        children: [
                          ElevatedButton.icon(
                            onPressed: _pickImage,
                            icon: const Icon(Icons.image),
                            label: const Text("Cambiar Imagen"),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.deepPurpleAccent,
                              foregroundColor: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 12),
                          if (_imageFile.value != null)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.file(
                                _imageFile.value!,
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                              ),
                            )
                          else if (product.imageUrl != null)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.network(
                                '$API_AVATAR${product.imageUrl}',
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _submitEdit,
                          icon: const Icon(Icons.save),
                          label: const Text("Guardar Cambios"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.deepPurpleAccent,
                            foregroundColor: Colors.black,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            textStyle: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.deepPurpleAccent),
      filled: true,
      fillColor: const Color(0xFF1A1A2E),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.deepPurpleAccent),
      ),
    );
  }
}
