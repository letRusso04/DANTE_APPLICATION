import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaLayerGroup, FaPlus } from 'react-icons/fa';

const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  acento: '#6B2233',
  sidebar: '#111117',
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${colors.fondo};
  font-family: 'Inter', sans-serif;
`;
const Drawer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '220px' : '70px')};
 background-color: ${colors.sidebar};
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
    color: ${colors.acento};
  }

  svg {
    min-width: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  color: ${colors.texto};
`;
const InventoryGroupCard = styled.div`
  background: ${colors.panel};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  color: ${colors.texto};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px ${colors.acento};
  }

  h3 {
    font-size: 1.2rem;
    color: ${colors.acento};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.95rem;
    color: ${colors.acento};
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;
const InventoryGroups = () => {
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout>
      <Drawer
        expanded={drawerExpanded}
        onMouseEnter={() => setDrawerExpanded(true)}
        onMouseLeave={() => setDrawerExpanded(false)}
      >
        <DrawerItem onClick={() => navigate('/dashboard')} title="Dashboard" active={location.pathname === '/dashboard'}>
          <FaHome />
          {drawerExpanded && 'Dashboard'}
        </DrawerItem>

        <DrawerItem onClick={() => navigate('/inventario/grupo')} title="Grupos" active={location.pathname === '/inventory/groups'}>
          <FaLayerGroup />
          {drawerExpanded && 'Grupos'}
        </DrawerItem>

        <DrawerItem onClick={() => navigate('/inventario/grupo/crear')} title="Crear grupo" active={location.pathname === '/inventory/groups/create'}>
          <FaPlus />
          {drawerExpanded && 'Crear grupo'}
        </DrawerItem>
      </Drawer>

      <Content>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Grupos de Inventario</h2>
        <p style={{ color: '#aaa' }}>Aquí verás tus categorías de productos, organizadas para una mejor gestión.</p>
        <Grid>
  <InventoryGroupCard>
    <h3>Electrónica</h3>
    <p>Dispositivos y gadgets tecnológicos. Total: 124 ítems.</p>
  </InventoryGroupCard>

  <InventoryGroupCard>
    <h3>Oficina</h3>
    <p>Mobiliario y artículos de papelería. Total: 89 ítems.</p>
  </InventoryGroupCard>

  <InventoryGroupCard>
    <h3>Alimentos</h3>
    <p>Productos comestibles y bebidas. Total: 210 ítems.</p>
  </InventoryGroupCard>

  <InventoryGroupCard>
    <h3>Herramientas</h3>
    <p>Equipos de mantenimiento y reparación. Total: 45 ítems.</p>
  </InventoryGroupCard>
</Grid>
      </Content>
    </Layout>
  );
};

export default InventoryGroups;
