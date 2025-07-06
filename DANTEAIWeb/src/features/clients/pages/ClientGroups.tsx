import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FaUsers,
  FaUserFriends,
  FaComments,
  FaSearch,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useCompanyStore } from '../../../stores/companyStore';
import { API_AVATAR } from '../../../services/routes/routesAPI';

const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  secundario: '#888',
  acento: '#6B2233',
  sidebar: '#111117',
  header: '#1F1F23',
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
  user-select: none;
`;

const Content = styled.section`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  color: ${colors.texto};
`;

const SearchBar = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background-color: ${colors.panel};
  border-radius: 0.7rem;
  padding: 0.8rem 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: ${colors.texto};
  font-size: 1rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${colors.secundario};
  }
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
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const GroupImage = styled.div<{ imageUrl?: string }>`
  width: 100px;
  height: 100px;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
  background-color: ${colors.fondo};
  background-size: cover;
  background-position: center;
  background-image: ${({ imageUrl }) =>
    imageUrl ? `url(${imageUrl})` : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.acento};
  font-size: 2.5rem;
`;

const GroupName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  text-align: center;
`;

const GroupDescription = styled.span`
  font-size: 1rem;
  color: ${colors.secundario};
  text-align: center;
`;

const ClientGroups: React.FC = () => {
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { categories, fetchCategories } = useCategoryStore();
  const { company } = useCompanyStore();

  useEffect(() => {
    if (company?.id_company) {
      fetchCategories(company.id_company, '2'); // Grupos
    }
  }, [company]);

  const filteredGroups = categories.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <DrawerItem onClick={() => navigate('/dashboard')}>
          <FaUsers />
          {drawerExpanded && 'Dashboard'}
        </DrawerItem>

        <DrawerItem active>
          <FaUserFriends />
          {drawerExpanded && 'Grupos'}
        </DrawerItem>

        <DrawerItem onClick={() => navigate('/cliente/grupo/crear')}>
          <FaComments />
          {drawerExpanded && 'Crear grupo'}
        </DrawerItem>
      </Drawer>

      <Main>
        <Header>Grupos de Clientes</Header>

        <Content>
          <SearchBar>
            <FaSearch color={colors.secundario} />
            <SearchInput
              placeholder="Buscar grupo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>

          {filteredGroups.length === 0 ? (
            <p style={{ color: colors.secundario, textAlign: 'center' }}>
              No hay grupos que coincidan.
            </p>
          ) : (
            <GroupsGrid>
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id_category}
                  onClick={() => goToGroupClients(group.id_category)}
                  title={`Ver clientes en ${group.name}`}
                >
                  <GroupImage
                    imageUrl={
                      group.image
                        ? `${API_AVATAR}/${group.image}`
                        : undefined
                    }
                  >
                    {!group.image && <FaUserFriends />}
                  </GroupImage>
                  <GroupName>{group.name}</GroupName>
                  <GroupDescription>
                    {group.description || 'Sin descripción'}
                  </GroupDescription>
                </GroupCard>
              ))}
            </GroupsGrid>
          )}
        </Content>
      </Main>
    </Layout>
  );
};

export default ClientGroups;
