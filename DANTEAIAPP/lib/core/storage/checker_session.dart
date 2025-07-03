import 'package:danteai/core/storage/auth_storage.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SessionChecker extends StatefulWidget {
  final Widget child;
  const SessionChecker({required this.child, super.key});

  @override
  State<SessionChecker> createState() => _SessionCheckerState();
}

class _SessionCheckerState extends State<SessionChecker> {
  @override
  void initState() {
    super.initState();
    _checkSession();
  }

  Future<void> _checkSession() async {
    final token = await AuthStorage.getToken();
    if (token != null && mounted) {
      context.go('/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
