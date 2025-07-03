import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaHome, FaComments, FaUsers, FaBoxOpen, FaUserShield, FaRobot, FaChartLine, FaStore, FaShoppingCart, FaCubes, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
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
  tarjeta: '#2a2a36'
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Montserrat', sans-serif;
  background-color: ${colors.fondo};
`;

const Sidebar = styled.nav`
  width: 250px;
  background-color: ${colors.sidebar};
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: ${colors.texto};
`;

const Logo = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${colors.acento};
  text-align: center;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.acento};
  }

  svg {
    font-size: 1.3rem;
  }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: ${colors.header};
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.texto};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Welcome = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 2px solid ${colors.acento};
  border-radius: 50px;
  background-color: ${colors.panel};
  transition: background 0.3s;

  &:hover {
    background-color: ${colors.acento};
    color: #fff;
  }
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  background-color: #3a3a45;
  border-radius: 50%;
  background-image: url('https://i.pravatar.cc/300');
  background-size: cover;
  background-position: center;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  color: ${colors.texto};
  overflow-y: auto;
`;

const Card = styled.div`
  background: ${colors.panel};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, ${colors.morado} 0%, ${colors.vinotinto} 100%);
  color: white;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px ${colors.morado};
  }
`;

const GradientCard = styled(Card)`
  background: linear-gradient(135deg, ${colors.vinotinto} 0%, ${colors.morado} 100%);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px ${colors.morado};

    svg {
      transform: scale(1.2) rotate(10deg);
    }
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: flex-end;
  z-index: 999;
`;

const DrawerPanel = styled.div`
  width: 280px;
  background: ${colors.panel};
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeInUp} 0.35s ease forwards;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
`;

const DrawerTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${colors.acento};
  margin-bottom: 0.8rem;
`;

const DrawerItem = styled.div`
  font-size: 1rem;
  color: ${colors.texto};
  font-weight: 500;
  cursor: pointer;
  padding: 0.4rem 0.2rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.acento};
  }
`;

const CloseBtn = styled.button`
  margin-top: auto;
  padding: 0.7rem;
  background: ${colors.acento};
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #8e2a42;
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AvatarSmall = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: 600;
`;

const Detail = styled.span`
  font-size: 0.9rem;
  color: ${colors.secundario};
`;

const Dashboard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const goToChat = () => navigate('/dante-chat');

  return (
    <Layout>
 <Sidebar>
  <Logo>DANTE AI</Logo>
  <NavItem onClick={() => navigate('/dashboard')}><FaHome /> Dashboard</NavItem>
  <NavItem onClick={() => navigate('/chat-interno')}><FaComments /> Mensajería</NavItem>
  <NavItem onClick={() => navigate('/cliente/grupo')}><FaUsers /> Clientes</NavItem>
  <NavItem onClick={() => navigate('/inventario/grupo')}><FaBoxOpen /> Inventario</NavItem>
  <NavItem onClick={() => navigate('/usuario/admin')}><FaUserShield /> Usuario</NavItem>
</Sidebar>

      <Main>
        <Header>
          <Welcome>Bienvenido, Usuario Administrador</Welcome>
          <Profile onClick={toggleDrawer}>
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Perfil</span>
            <Avatar />
          </Profile>
        </Header>

        <Content>
             <GradientCard onClick={goToChat}>
            <div style={{
              background: '#ffffff33',
              padding: '1rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255,255,255,0.2)'
            }}>
              <FaRobot size={28} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Hablar con DanteAI</h3>
              <p style={{ color: '#f0f0f0', margin: '0.3rem 0 0' }}>
                Consulta datos, haz preguntas o recibe asistencia en tiempo real.
              </p>
            </div>
          </GradientCard>
          <Grid>
            <StatCard><FaUsers size={28} /> Clientes: <strong>215</strong></StatCard>
            <StatCard><FaBoxOpen size={28} /> Productos: <strong>148</strong></StatCard>
            <StatCard><FaShoppingCart size={28} /> Ventas: <strong>340</strong></StatCard>
            <StatCard><FaCubes size={28} /> Inventario: <strong>1,024</strong></StatCard>
          </Grid>

       

          <Grid>
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Últimos clientes</h3>
              <ListItem>
                <AvatarSmall src="https://i.pravatar.cc/100?img=12" alt="Juan Pérez" />
                <Info>
                  <Name>Juan Pérez</Name>
                  <Detail>juan@empresa.com</Detail>
                </Info>
              </ListItem>
              <ListItem>
                <AvatarSmall src="https://i.pravatar.cc/100?img=22" alt="Ana Torres" />
                <Info>
                  <Name>Ana Torres</Name>
                  <Detail>ana@empresa.com</Detail>
                </Info>
              </ListItem>
              <ListItem>
                <AvatarSmall src="https://i.pravatar.cc/100?img=32" alt="Luis Gómez" />
                <Info>
                  <Name>Luis Gómez</Name>
                  <Detail>luis@empresa.com</Detail>
                </Info>
              </ListItem>
            </Card>

            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Top productos vendidos</h3>
              <ListItem>
                <AvatarSmall src="https://images.unsplash.com/photo-1606813902504-0b62b84b30f4?auto=format&fit=crop&w=80&q=80" alt="Audífonos Pro Max" />
                <Info>
                  <Name>Audífonos Pro Max</Name>
                  <Detail>150 ventas</Detail>
                </Info>
              </ListItem>
              <ListItem>
                <AvatarSmall src="https://images.unsplash.com/photo-1589987600631-3e6f3e70a8df?auto=format&fit=crop&w=80&q=80" alt="Laptop Gamer RX" />
                <Info>
                  <Name>Laptop Gamer RX</Name>
                  <Detail>132 ventas</Detail>
                </Info>
              </ListItem>
              <ListItem>
                <AvatarSmall src="https://images.unsplash.com/photo-1606818274708-f2be7d43860d?auto=format&fit=crop&w=80&q=80" alt="Monitor UltraWide" />
                <Info>
                  <Name>Monitor UltraWide</Name>
                  <Detail>98 ventas</Detail>
                </Info>
              </ListItem>
            </Card>
          </Grid>
        </Content>
      </Main>

{drawerOpen && (
        <DrawerOverlay onClick={() => setDrawerOpen(false)}>
          <DrawerPanel onClick={(e) => e.stopPropagation()}>
            <DrawerTitle>Mi Cuenta</DrawerTitle>

            <DrawerItem onClick={() => { navigate('/notificaciones'); setDrawerOpen(false); }}>
              <FaBell /> Notificaciones
            </DrawerItem>

            <DrawerItem onClick={() => { navigate('/mi-cuenta'); setDrawerOpen(false); }}>
              <FaUserCircle /> Cuenta
            </DrawerItem>

            <DrawerItem
              onClick={() => {
                alert('Cerrando sesión...');
                // Aquí podrías agregar lógica de logout real
                setDrawerOpen(false);
              }}
            >
              <FaSignOutAlt /> Cerrar sesión
            </DrawerItem>

            <CloseBtn onClick={() => setDrawerOpen(false)}>Cerrar</CloseBtn>
          </DrawerPanel>
        </DrawerOverlay>
      )}
    </Layout>
  );
};

export default Dashboard;
