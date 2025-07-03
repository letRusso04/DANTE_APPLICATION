// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Registro';
import Home from './features/auth/inicio';
import UserSelection from './features/auth/UserSelection';
import Dashboard from './features/dashboard/Dashboard';
import DanteChat from './features/chatbot/DanteChat';
import Messaging from './features/chat/pages/chat';
import Groups from './features/chat/pages/groups';
import Support from './features/chat/pages/soporte';
import ClientGroups from './features/clients/pages/ClientGroups';
import ClientListByGroup from './features/clients/pages/ClientList';
import CreateGroup from './features/clients/pages/ClientCreateGroup';
import InventoryGroups from './features/inventory/InventoryGroups';
import CreateInventoryGroup from './features/inventory/InventoryCGroup';
import UsuariosDashboard from './features/users/AdminUsuarios';
import Notificaciones from './features/dashboard/pages/NotifyPages';
import MiCuenta from './features/dashboard/pages/MiCuenta';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/seleccion" element={<UserSelection users={[
  { id: '1', name: 'Alejandro', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', name: 'María', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '3', name: 'Carlos', avatar: 'https://randomuser.me/api/portraits/men/56.jpg' },
]} onSelect={function (id: string): void {
          throw new Error('Function not implemented.');
        } } onAddUser={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="/dante-chat" element={<DanteChat />} />
        <Route path="/chat-interno" element={<Messaging />} />
        <Route path="/chat-grupo" element={<Groups />} />
        <Route path="/chat-soporte" element={<Support />} />
        <Route path="/cliente/grupo" element={<ClientGroups />} />
        <Route path="/cliente/lista" element={<ClientListByGroup />} />
        <Route path="/cliente/grupo/crear" element={<CreateGroup />} />
        <Route path="/inventario/grupo" element={<InventoryGroups />} />
        <Route path="/inventario/grupo/crear" element={<CreateInventoryGroup />} />
        <Route path="/usuario/admin" element={<UsuariosDashboard />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/mi-cuenta" element={<MiCuenta />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
//        <Route path="*" element={<Navigate to="/" />} />
