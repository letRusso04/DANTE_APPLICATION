// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Registro';
import Home from './features/auth/inicio';
import UserSelection from './features/auth/UserSelection';
import Dashboard from './features/dashboard/Dashboard';
import DanteChat from './features/chatbot/DanteChat';
import Messaging from './features/chat/pages/chat';
import Support from './features/chat/pages/soporte';
import ClientGroups from './features/clients/pages/ClientGroups';
import CreateGroup from './features/clients/pages/ClientCreateGroup';
import InventoryGroups from './features/inventory/InventoryGroups';
import CreateInventoryGroup from './features/inventory/InventoryCGroup';
import UsuariosDashboard from './features/users/AdminUsuarios';
import MiCuenta from './features/dashboard/pages/MiCuenta';
import ProductsByCategory from './features/inventory/components/ProductsByCategory';
import ProductDetailPage from './features/inventory/components/ProductDetailPage';
import ClientsByGroup from './features/clients/pages/components/ClientsByGroup';
import ClientDetails from './features/clients/pages/components/ClientDetails';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/seleccion" element={<UserSelection/>}/>
        <Route path="/dante-chat" element={<DanteChat />} />
        <Route path="/chat-interno" element={<Messaging />} />
        <Route path="/chat-soporte" element={<Support />} />
        <Route path="/cliente/grupo" element={<ClientGroups />} />
        <Route path="/cliente/grupo/crear" element={<CreateGroup />} />
        <Route path="/clients/group/:groupId" element={<ClientsByGroup />} />
        <Route path="/cliente/:clientId" element={<ClientDetails />} />
        <Route path="/inventario/grupo" element={<InventoryGroups />} />
        <Route path="/inventario/grupo/crear" element={<CreateInventoryGroup />} />
        <Route path="/usuario/admin" element={<UsuariosDashboard />} />
        <Route path="/mi-cuenta" element={<MiCuenta />} />
        <Route path="/inventario/grupo/productos/:categoryId" element={<ProductsByCategory />} />
        <Route path="/producto/:productId" element={<ProductDetailPage />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
//        <Route path="*" element={<Navigate to="/" />} />
