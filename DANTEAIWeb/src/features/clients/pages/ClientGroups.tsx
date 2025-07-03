import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUsers, FaBriefcase, FaBuilding, FaUserFriends, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  padding: 1.5rem 2rem;
  color: ${colors.texto};
  font-weight: 600;
  font-size: 1.25rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  user-select: none;
`;

const Content = styled.section`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  color: ${colors.texto};
`;

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
`;

const GroupCard = styled.div`
  background-color: ${colors.panel};
  border-radius: 1rem;
  padding: 1.8rem 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(107, 34, 51, 0.7);
  }
`;

const GroupIcon = styled.div`
  font-size: 3rem;
  color: ${colors.acento};
  margin-bottom: 1rem;
`;

const GroupName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  text-align: center;
`;

const GroupCount = styled.span`
  font-size: 1rem;
  color: ${colors.secundario};
`;

const ClientGroups: React.FC = () => {
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const navigate = useNavigate();

  // Datos ejemplo de grupos
  const groups = [
    { id: 'corporate', name: 'Corporativos', icon: <FaBriefcase />, count: 48 },
    { id: 'retail', name: 'Retail', icon: <FaBuilding />, count: 120 },
    { id: 'vip', name: 'VIP', icon: <FaUserFriends />, count: 35 },
    { id: 'otros', name: 'Otros', icon: <FaUsers />, count: 22 },
  ];

  const goToGroupClients = (groupId: string) => {
    navigate(`/clients/group/${groupId}`);
  };

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
        <Header>Grupos de Clientes</Header>

        <Content>
          <GroupsGrid>
            {groups.map((group) => (
              <GroupCard key={group.id} onClick={() => goToGroupClients(group.id)} title={`Ver clientes en ${group.name}`}>
                <GroupIcon>{group.icon}</GroupIcon>
                <GroupName>{group.name}</GroupName>
                <GroupCount>{group.count} clientes</GroupCount>
              </GroupCard>
            ))}
          </GroupsGrid>
        </Content>
      </Main>
    </Layout>
  );
};

export default ClientGroups;
