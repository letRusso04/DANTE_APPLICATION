// dashboard.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaHome,
  FaComments,
  FaUsers,
  FaBoxOpen,
  FaUserShield,
  FaRobot,

  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useClientStore } from "../../stores/clientStore";
import { getTopProducts } from "../../services/productServices";
import type { ProductModel } from "../../models/productModels";
import { API_AVATAR } from "../../services/routes/routesAPI";
import { useUserStore } from "../../stores/userStore";
import { logoutAllStores } from "../../stores/sessionStore";

const colors = {
  fondo: "#0D0D11",
  panel: "#1A1A1F",
  texto: "#E8E8E8",
  secundario: "#888",
  acento: "#6B2233",
  sidebar: "#111117",
  header: "#1F1F23",
  morado: "#6A0DAD",
  vinotinto: "#8B1E3F",
  tarjeta: "#2a2a36",
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Montserrat", sans-serif;
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

interface AvatarProps {
  imageUrl?: string;
}

const Avatar = styled.div<AvatarProps>`
  width: 38px;
  height: 38px;
  background-color: #3a3a45;
  border-radius: 50%;
  background-image: url(${(props) => props.imageUrl || "https://i.pravatar.cc/300"});
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const ClientCard =styled(Card)`
  display: flex;
  align-items: center;

  background: linear-gradient(
    135deg,
    ${colors.morado} 0%,
    ${colors.vinotinto} 100%
  );
  color: white;
  transition: transform 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px ${colors.morado};
  }
`; 
const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  background: linear-gradient(
    135deg,
    ${colors.morado} 0%,
    ${colors.vinotinto} 100%
  );
  color: white;
  transition: transform 0.3s ease;
  cursor: pointer;
  p{
    margin-left: 5px;
    font-weight: bold;
  }
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px ${colors.morado};
  }
`;

const GradientCard = styled(Card)`
  background: linear-gradient(
    135deg,
    ${colors.vinotinto} 0%,
    ${colors.morado} 100%
  );
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

const Dashboard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topProducts, setTopProducts] = useState<ProductModel[]>([]);
  const { clients, fetchClients } = useClientStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
    getTopProducts().then((res) => {
      if (res.success && res.products) {
        setTopProducts(res.products);
      }
    });
  }, []);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <Layout>
      <Sidebar>
        <Logo>DANTE AI</Logo>
        <NavItem onClick={() => navigate("/dashboard")}>
          <FaHome /> Dashboard
        </NavItem>
        <NavItem onClick={() => navigate("/chat-interno")}>
          <FaComments /> Mensajería
        </NavItem>
        <NavItem onClick={() => navigate("/cliente/grupo")}>
          <FaUsers /> Clientes
        </NavItem>
        <NavItem onClick={() => navigate("/inventario/grupo")}>
          <FaBoxOpen /> Inventario
        </NavItem>
        <NavItem onClick={() => navigate("/usuario/admin")}>
          <FaUserShield /> Usuario
        </NavItem>
      </Sidebar>

      <Main>
        <Header>
          <Welcome>Bienvenido, {useUserStore.getState().user?.role} {useUserStore.getState().user?.name}. </Welcome>
         
          <Profile onClick={toggleDrawer}>
            <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>Perfil</span>
            <Avatar imageUrl={`${API_AVATAR}${useUserStore.getState().user?.avatar_url}`} />
          </Profile>
        </Header>

        <Content>
          <GradientCard onClick={() => navigate("/dante-chat")}>
            <div
              style={{
                background: "#ffffff33",
                padding: "1rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(255,255,255,0.2)",
              }}
            >
              <FaRobot size={28} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.4rem", color: "#fff", margin: 0 }}>
                Hablar con DanteAI
              </h3>
              <p style={{ color: "#f0f0f0", margin: "0.3rem 0 0" }}>
                Consulta datos, haz preguntas o recibe asistencia en tiempo
                real.
              </p>
            </div>
          </GradientCard>
          <Grid>
            <StatCard onClick={()=> navigate('/cliente/grupo')}>
              <FaUsers size={28} /> Clientes: <strong>{clients.length}</strong>
            </StatCard>
            <StatCard onClick={()=> navigate('/inventario/grupo')}>
              <FaBoxOpen size={28} /> Productos:{" "}
              <strong>{topProducts.length}</strong>
            </StatCard>
          </Grid>

          <Grid>
            <Card>
              <h3>Últimos clientes</h3>
              {clients.slice(0, 3).map((c) => (
                <ClientCard
                  key={c.id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                  onClick={()=> navigate(`/cliente/${c.id}`)}
                >
                  <img
                    src={
                      `${API_AVATAR}${c.avatar}` 
                    }
                    width={48}
                    height={48}
                    style={{ borderRadius: "50%" }}
                  />
                  <div>
                    <strong>{c.name}</strong>
                    <p style={{ color: colors.secundario, margin: 0 }}>
                      {c.email}
                    </p>
                  </div>
                </ClientCard>
              ))}
            </Card>

            <Card>
              <h3>Top productos vendidos</h3>
              {topProducts.map((p) => (
                <StatCard
                  key={p.id_product}
                  onClick={() => navigate(`/producto/${p.id_product}`)}
                >
                  <FaBoxOpen size={28} /> 
                  <p>{p.name} | Stock: {p.stock} | Precio: {p.price}.00$</p>
                </StatCard>
              ))}
            </Card>
          </Grid>
        </Content>
      </Main>

      {drawerOpen && (
        <DrawerOverlay onClick={() => setDrawerOpen(false)}>
          <DrawerPanel onClick={(e) => e.stopPropagation()}>
            <DrawerTitle>Mi Cuenta</DrawerTitle>

 

            <DrawerItem
              onClick={() => {
                navigate("/mi-cuenta");
                setDrawerOpen(false);
              }}
            >
              <FaUserCircle /> Cuenta
            </DrawerItem>

            <DrawerItem
              onClick={() => {
                logoutAllStores();
                navigate('/');
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
