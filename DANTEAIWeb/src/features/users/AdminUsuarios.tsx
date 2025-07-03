// UsuariosDashboard.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUserEdit, FaUserTimes, FaTrashAlt, FaPlus, FaUsers, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  acento: '#6B2233',
  secundario: '#888',
  verde: '#27AE60',
  rojo: '#E74C3C',
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${colors.fondo};
  color: ${colors.texto};
  font-family: 'Poppins', sans-serif;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
`;

const AddButton = styled.button`
  background-color: ${colors.acento};
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #8e2a42;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${colors.panel};
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background: #2a2a2a;
  color: ${colors.secundario};
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #2d2d2d;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const ActionBtn = styled.button<{ color?: string }>`
  background: ${({ color }) => color || '#444'};
  color: white;
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;
const Drawer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '220px' : '100px')};

  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
`;

const DrawerItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({active}) => (active ? colors.acento : colors.texto)};
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.3rem;
  background-color: ${({active})  => (active ? '#1f1f23' : 'transparent')};
  &:hover {
    background-color: #22222a;

  }
  svg {
    min-width: 20px;
  }
`;const SearchInput = styled.input`
  background-color: #262630;
  border: 1px solid #3c3c3c;
  color: ${colors.texto};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
  max-width: 320px;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: ${colors.acento};
  }

  &::placeholder {
    color: ${colors.secundario};
  }
`;

const UsuariosDashboard = () => {
  const navigate = useNavigate();
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', status: 'Activo' },
    { id: 2, name: 'Ana Gómez', email: 'ana@example.com', status: 'Inactivo' },
    { id: 3, name: 'Carlos Torres', email: 'carlos@example.com', status: 'Activo' },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Drawer
        expanded={drawerExpanded}
        onMouseEnter={() => setDrawerExpanded(true)}
        onMouseLeave={() => setDrawerExpanded(false)}
      >
        <DrawerItem onClick={() => navigate('/dashboard')} active={location.pathname === '/dashboard'}>
          <FaHome />
          {drawerExpanded && 'Dashboard'}
        </DrawerItem>

        <DrawerItem onClick={() => navigate('/usuario/admin')} active={location.pathname === '/usuario/admin'}>
          <FaUsers />
          {drawerExpanded && 'Usuarios'}
        </DrawerItem>
      </Drawer>

      <Main>
        <Header>
          <Title>Gestión de Usuarios</Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <SearchInput
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AddButton onClick={() => navigate('/usuarios/crear')}>
              <FaPlus /> Agregar Usuario
            </AddButton>
          </div>
        </Header>

        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Correo</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.status}</Td>
                <Td>
                  <ActionButtons>
                    <ActionBtn color={colors.verde}><FaUserEdit /></ActionBtn>
                    <ActionBtn color={colors.acento}><FaUserTimes /></ActionBtn>
                    <ActionBtn color={colors.rojo}><FaTrashAlt /></ActionBtn>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <Td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: colors.secundario }}>
                  No se encontraron usuarios.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Main>
    </Layout>
  );
};

export default UsuariosDashboard;