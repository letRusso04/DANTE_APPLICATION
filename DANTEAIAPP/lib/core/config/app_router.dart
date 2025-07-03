import 'package:danteai/core/models/model_category.dart';
import 'package:danteai/core/models/model_product.dart';
import 'package:danteai/core/models/model_user.dart';
import 'package:danteai/features/chatbot/presentation/dante_ai_chat_page.dart';
import 'package:danteai/features/client/presentation/client_group_page.dart';
import 'package:danteai/features/client/presentation/crear_grupo_page.dart';
import 'package:danteai/features/dashboard/presentation/cuenta_page.dart';
import 'package:danteai/features/inventario/presentation/inventario_crear_grupo_page.dart';
import 'package:danteai/features/inventario/presentation/inventario_groups_page.dart';
import 'package:danteai/features/inventario/presentation/widgets/products_categories.dart';
import 'package:danteai/features/messaging/pages/support_page.dart';
import 'package:danteai/features/messaging/pages/tickets_list_page.dart';
import 'package:danteai/features/messaging/pages/widgets/chat_page.dart';
import 'package:danteai/features/product/presentation/product_crear_panel.dart';
import 'package:danteai/features/product/presentation/product_detalle.dart';
import 'package:danteai/features/product/presentation/product_panel.dart';
import 'package:danteai/features/users/users_admin_page.dart';
import 'package:danteai/features/users/users_create_page.dart';
import 'package:flutter/material.dart';
import "package:go_router/go_router.dart";
import 'package:danteai/features/auth/login_page.dart';
import 'package:danteai/features/auth/register_page.dart';
import 'package:danteai/features/dashboard/presentation/dashboard_page.dart';
import 'package:danteai/features/messaging/pages/messaging_page.dart';
import 'package:danteai/features/users/panel_users.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/', builder: (context, state) => const LoginPage()),
    GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterPage(),
    ),
    GoRoute(path: '/usuarios', builder: (context, state) => UsersPanelPage()),
    GoRoute(
      path: '/usuarios/admin',
      builder: (context, state) => const UsersAdminPage(),
    ),
    GoRoute(
      path: '/users/create',
      builder: (context, state) => const UsersCreatePage(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardPage(),
    ),

    GoRoute(path: '/cuenta', builder: (context, state) => const CuentaPage()),
    GoRoute(
      path: '/mensajeria',
      builder: (context, state) => const MessagingPage(),
    ),

    GoRoute(
      path: '/mensajeria/soporte',
      builder: (context, state) => const SupportPage(),
    ),
    GoRoute(
      path: '/mensajeria/tickets',
      builder: (context, state) => const TicketsListPage(),
    ),

    GoRoute(
      path: '/clientes',
      builder: (context, state) => const ClientGroupsPage(),
    ),
    GoRoute(
      path: '/clientes/crear-cliente',
      builder: (context, state) => const CrearClientePage(),
    ),
    GoRoute(
      path: '/inventario',
      builder: (context, state) => const InventarioGruposPage(),
    ),
    GoRoute(
      path: '/producto',
      builder: (context, state) => const ProductosPanelPage(),
    ),
    GoRoute(
      path: '/productos/crear',
      builder: (context, state) => const CrearProductoPage(),
    ),
    GoRoute(
      path: '/producto/detalle',
      builder: (context, state) {
        final product = state.extra as ProductModel;
        return ProductDetailPage(product: product);
      },
    ),
    GoRoute(
      path: '/productos/categoria',
      builder: (context, state) {
        final CategoryModel categoria = state.extra as CategoryModel;
        return ProductosPorCategoriaPage(categoria: categoria);
      },
    ),
    GoRoute(
      path: '/inventario/crear',
      builder: (context, state) => const InventarioCrearGrupoPage(),
    ),
    GoRoute(
      path: '/chatbot/danteai',
      builder: (context, state) => const DanteAIChatPage(),
    ),

    // Aquí la ruta para ChatPage con parámetros en extra
    GoRoute(
      path: '/chat',
      builder: (context, state) {
        final extra = state.extra;
        if (extra is Map<String, dynamic>) {
          final chatUser = extra['chatUser'] as UserModel?;
          final currentUserId = extra['currentUserId'] as String?;
          if (chatUser != null && currentUserId != null) {
            return ChatPage(chatUser: chatUser, currentUserId: currentUserId);
          }
        }
        // En caso de error, mostramos una página simple con mensaje
        return Scaffold(
          appBar: AppBar(title: const Text('Error')),
          body: const Center(
            child: Text('Parámetros inválidos para la página de chat'),
          ),
        );
      },
    ),
  ],
);
