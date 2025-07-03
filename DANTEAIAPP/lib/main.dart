import 'package:danteai/core/config/app_router.dart';
import 'package:danteai/core/storage/checker_session.dart';
import 'package:danteai/providers/auth_provider.dart';
import 'package:danteai/providers/category_provider.dart';
import 'package:danteai/providers/chat_provider.dart';
import 'package:danteai/providers/client_provider.dart';
import 'package:danteai/providers/product_provider.dart';
import 'package:danteai/providers/ticket_provider.dart';
import 'package:danteai/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UsersProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CategoryProvider()),
        ChangeNotifierProvider(create: (_) => ProductsProvider()),
        ChangeNotifierProvider(create: (_) => ClientsProvider()),
        ChangeNotifierProvider(create: (_) => SupportTicketProvider()),
        ChangeNotifierProvider(create: (_) => MessagesProvider()),
      ],
      child: MaterialApp.router(
        debugShowCheckedModeBanner: false,
        routerConfig: appRouter,
        builder: (context, child) => SessionChecker(child: child!),
        theme: ThemeData.dark().copyWith(
          scaffoldBackgroundColor: const Color(0xFF0D000D),
          textTheme: ThemeData.dark().textTheme.apply(
            bodyColor: Colors.white,
            displayColor: Colors.white,
          ),
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.purpleAccent),
        ),
      ),
    );
  }
}
