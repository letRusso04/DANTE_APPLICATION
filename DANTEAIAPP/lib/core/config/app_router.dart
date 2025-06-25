import 'package:danteai/features/chatbot/presentation/dante_ai_chat_page.dart';
import 'package:danteai/features/client/presentation/client_group_page.dart';
import 'package:danteai/features/client/presentation/crear_grupo_page.dart';
import 'package:danteai/features/dashboard/presentation/cuenta_page.dart';
import 'package:danteai/features/dashboard/presentation/notification_page.dart';
import 'package:danteai/features/inventario/presentation/inventario_crear_grupo_page.dart';
import 'package:danteai/features/inventario/presentation/inventario_groups_page.dart';
import 'package:danteai/features/messaging/pages/groups_page.dart';
import 'package:danteai/features/messaging/pages/support_page.dart';
import 'package:danteai/features/users/users_admin_page.dart';
import 'package:danteai/features/users/users_create_page.dart';
import "package:go_router/go_router.dart";
import 'package:danteai/features/auth/login_page.dart';
import 'package:danteai/features/auth/register_page.dart';
import 'package:danteai/features/dashboard/presentation/dashboard_page.dart';
import 'package:danteai/features/messaging/pages/messaging_page.dart';
import 'package:danteai/features/users/panel_users.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterPage(),
    ),
    GoRoute(
      path: '/usuarios',
      builder: (context, state) => const UsersPanelPage(),
    ),
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
    GoRoute(
      path: '/notificaciones',
      builder: (context, state) => const NotificacionesPage(),
    ),
    GoRoute(path: '/cuenta', builder: (context, state) => const CuentaPage()),
    GoRoute(
      path: '/mensajeria',
      builder: (context, state) => const MessagingPage(),
    ),
    GoRoute(
      path: '/mensajeria/grupos',
      builder: (context, state) => const GroupsPage(),
    ),
    GoRoute(
      path: '/mensajeria/soporte',
      builder: (context, state) => const SupportPage(),
    ),
    GoRoute(
      path: '/clientes',
      builder: (context, state) => const ClientGroupsPage(),
    ),
    GoRoute(
      path: '/clientes/crear-grupo',
      builder: (context, state) => const CrearGrupoPage(),
    ),
    GoRoute(
      path: '/inventario',
      builder: (context, state) => const InventarioGruposPage(),
    ),
    GoRoute(
      path: '/inventario/crear',
      builder: (context, state) => const InventarioCrearGrupoPage(),
    ),
    GoRoute(
      path: '/chatbot/danteai',
      builder: (context, state) => const DanteAIChatPage(),
    ),
  ],
);
