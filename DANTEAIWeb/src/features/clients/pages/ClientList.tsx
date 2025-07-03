import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaUserCircle, FaEnvelope, FaPhone, FaCheckCircle, FaTimesCircle, FaUsers, FaComments, FaUserFriends, FaLifeRing } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  secundario: '#888',
  acento: '#6B2233',
  sidebar: '#111117',
  header: '#1F1F23',
  morado: '#6A0DAD',
  vinotinto: '#8B1E3F',
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Montserrat', sans-serif;
  background-color: ${colors.fondo};
`;

const Drawer = styled.nav<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '220px' : '64px')};
  background-color: ${colors.sidebar};
  display: flex;
  flex-direction: column;
  padding: 1.8rem 1rem;
  gap: 1.5rem;
  transition: width 0.25s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.6);
  user-select: none;
`;

const DrawerItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  color: ${({ active }) => (active ? colors.acento : colors.texto)};
  background-color: ${({ active }) => (active ? colors.panel : 'transparent')};
  transition: background-color 0.25s, color 0.25s;

  &:hover {
    background-color: ${colors.panel};
    color: ${colors.acento};
  }

  svg {
    font-size: 1.5rem;
    min-width: 24px;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: ${colors.header};
  padding: 1.2rem 2rem;
  color: ${colors.texto};
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  user-select: none;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.acento};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #8e2a42;
  }
`;

const Content = styled.section`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  color: ${colors.texto};
`;

const ClientList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const ClientItem = styled.li`
  background-color: ${colors.panel};
  margin-bottom: 1rem;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  gap: 1.2rem;
  transition: background-color 0.25s ease;
  cursor: pointer;

  &:hover {
    background-color: #2c2c36;
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #3a3a45;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.9rem;
  color: ${colors.acento};
`;

const ClientInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ClientName = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const ClientDetails = styled.div`
  display: flex;
  gap: 1.4rem;
  font-size: 0.9rem;
  color: ${colors.secundario};
  align-items: center;

  svg {
    margin-right: 0.3rem;
  }
`;

const Status = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ active }) => (active ? '#4caf50' : '#e03e3e')};
  font-weight: 600;
  gap: 0.4rem;
  font-size: 0.95rem;
  min-width: 90px;
  justify-content: center;
`;

const ClientListByGroup: React.FC = () => {
  const [drawerExpanded, setDrawerExpanded] = React.useState(false);
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  // Datos simulados según grupo
  const groupNames: Record<string, string> = {
    corporate: 'Corporativos',
    retail: 'Retail',
    vip: 'VIP',
    otros: 'Otros',
  };

  const clientsData: Record<string, any[]> = {
    corporate: [
      { id: 1, name: 'Ana María Pérez', email: 'ana.perez@corp.com', phone: '+58 424 1234567', active: true },
      { id: 2, name: 'Carlos Ramírez', email: 'carlos.ramirez@corp.com', phone: '+58 412 9876543', active: false },
      { id: 3, name: 'Lucía González', email: 'lucia.gonzalez@corp.com', phone: '+58 414 7654321', active: true },
    ],
    retail: [
      { id: 4, name: 'Pedro Sánchez', email: 'pedro.sanchez@retail.com', phone: '+58 424 5554433', active: true },
      { id: 5, name: 'María López', email: 'maria.lopez@retail.com', phone: '+58 416 2244668', active: true },
      { id: 6, name: 'Jorge Ruiz', email: 'jorge.ruiz@retail.com', phone: '+58 412 1122334', active: false },
    ],
    vip: [
      { id: 7, name: 'Sofía Martínez', email: 'sofia.martinez@vip.com', phone: '+58 424 3322110', active: true },
      { id: 8, name: 'Diego Torres', email: 'diego.torres@vip.com', phone: '+58 414 9876542', active: true },
    ],
    otros: [
      { id: 9, name: 'Elena Castro', email: 'elena.castro@otros.com', phone: '+58 412 4455667', active: true },
      { id: 10, name: 'Raúl Hernández', email: 'raul.hernandez@otros.com', phone: '+58 416 9988776', active: false },
    ],
  };

  const clients = clientsData[groupId || 'otros'] || [];
  const groupName = groupNames[groupId || 'otros'] || 'Clientes';

  return (
    <Layout>
    <Drawer
   expanded={drawerExpanded}
   onMouseEnter={() => setDrawerExpanded(true)}
   onMouseLeave={() => setDrawerExpanded(false)}
 >
   <DrawerItem onClick={() => navigate('/dashboard')} title="Dashboard Principal" active={false}>
     <FaUsers />
     {drawerExpanded && 'Dashboard'}
   </DrawerItem>
 
   <DrawerItem onClick={() => navigate('/cliente/grupo')} title="Grupos de Clientes" active={location.pathname === '/cliente/grupo'}>
     {/* Icono de grupo personalizado o de librería */}
     <svg
       xmlns="http://www.w3.org/2000/svg"
       fill={drawerExpanded ? colors.acento : colors.texto}
       viewBox="0 0 24 24"
       width="24"
       height="24"
       style={{ minWidth: 24 }}
     >
       <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2 0-6 1-6 3v2h14v-2c0-2-4-3-6-3z" />
     </svg>
     {drawerExpanded && 'Grupos'}
   </DrawerItem>
 
   <DrawerItem onClick={() => navigate('/cliente/grupo/crear')} title="Crear nuevo grupo" active={location.pathname === '/cliente/grupo/crear'}>
     <FaComments />
     {drawerExpanded && 'Crear grupo'}
   </DrawerItem>
 </Drawer>

      <Main>
        <Header>
          <BackButton onClick={() => navigate('/clients/groups')} title="Volver a grupos">
            <FaArrowLeft />
          </BackButton>
          {groupName}
        </Header>

        <Content>
          <ClientList>
            {clients.map(client => (
              <ClientItem key={client.id} title={`Detalles de ${client.name}`}>
                <Avatar><FaUserCircle /></Avatar>
                <ClientInfo>
                  <ClientName>{client.name}</ClientName>
                  <ClientDetails>
                    <FaEnvelope /> {client.email}
                  </ClientDetails>
                  <ClientDetails>
                    <FaPhone /> {client.phone}
                  </ClientDetails>
                </ClientInfo>
                <Status active={client.active}>
                  {client.active ? <FaCheckCircle /> : <FaTimesCircle />}
                  {client.active ? 'Activo' : 'Inactivo'}
                </Status>
              </ClientItem>
            ))}
          </ClientList>
        </Content>
      </Main>
    </Layout>
  );
};

export default ClientListByGroup;
