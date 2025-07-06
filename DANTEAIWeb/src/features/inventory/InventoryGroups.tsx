import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaLayerGroup, FaPlus, FaSearch } from 'react-icons/fa';
import { useCategoryStore } from '../../stores/categoryStore';
import { API_AVATAR } from '../../services/routes/routesAPI';
import { useCompanyStore } from '../../stores/companyStore';

const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  acento: '#6B2233',
  sidebar: '#111117',
  borde: '#2D2D2D',
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
  color: ${({ active }) => (active ? colors.acento : colors.texto)};
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.3rem;
  background-color: ${({ active }) => (active ? '#1f1f23' : 'transparent')};

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
  padding: 2rem 3rem;
  color: ${colors.texto};
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${colors.acento};
`;

const SubText = styled.p`
  color: #aaa;
  margin-bottom: 1.5rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.panel};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  border: 1px solid ${colors.borde};
  max-width: 400px;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: ${colors.texto};
  font-size: 1rem;
  flex: 1;
  outline: none;

  &::placeholder {
    color: #666;
  }
`;

const InventoryGroupCard = styled.div`
  background: ${colors.panel};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  color: ${colors.texto};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid ${colors.borde};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px ${colors.acento};
  }

  img {
    border-radius: 8px;
    width: 100%;
    height: 140px;
    object-fit: cover;
    border: 1px solid ${colors.borde};
  }

  h3 {
    font-size: 1.1rem;
    color: ${colors.acento};
  }

  p {
    font-size: 0.9rem;
    color: #bbb;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const InventoryGroups = () => {
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { categories, fetchCategories } = useCategoryStore();
  const { company } = useCompanyStore(); 

  useEffect(() => {
    if (company?.id_company) {
      fetchCategories(company.id_company, '1');
    }
  }, [company]);

  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
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

        <DrawerItem onClick={() => navigate('/inventario/grupo')} active={location.pathname === '/inventario/grupo'}>
          <FaLayerGroup />
          {drawerExpanded && 'Grupos'}
        </DrawerItem>

        <DrawerItem onClick={() => navigate('/inventario/grupo/crear')} active={location.pathname === '/inventario/grupo/crear'}>
          <FaPlus />
          {drawerExpanded && 'Crear Categoria'}
        </DrawerItem>
      </Drawer>

      <Content>
        <Title>Grupos de Inventario</Title>
        <SubText>Explora las categorías existentes dentro del inventario de tu empresa.</SubText>

        <SearchContainer>
          <FaSearch style={{ marginRight: '0.8rem', color: '#888' }} />
          <SearchInput
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchContainer>

        <Grid>
          {filtered.map((cat) => (
            <InventoryGroupCard key={cat.id_category}  onClick={() => navigate(`/inventario/grupo/productos/${cat.id_category}`)}>
              {cat.image && (
                <img src={`${API_AVATAR}${cat.image}`} alt={cat.name} />
              )}
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </InventoryGroupCard>
          ))}
        </Grid>
      </Content>
    </Layout>
  );
};

export default InventoryGroups;