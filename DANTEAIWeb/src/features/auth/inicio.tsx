import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Rocket, BarChart2, Database, ShieldCheck, Users, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import astronaut from '../../assets/astronaut.png'
const moveStars = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -1000px 1000px; }
`;

const Background = styled.div`
  background: #000 url('https://www.transparenttextures.com/patterns/stardust.png') repeat;
  animation: ${moveStars} 120s linear infinite;
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  padding-top: 4.5rem;
  font-family: 'Poppins', sans-serif;
`;

const NavbarWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.7);
  border-bottom: 1px solid rgba(128, 0, 128, 0.15);
`;

const NavContainer = styled.nav`
  max-width: 1200px;
  margin: auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
  color: #b5179e;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
    font-family: 'Orbitron', sans-serif;
    justify-content: center;
    align-items: center;

`;

const Link = styled.span`
  font-size: 0.95rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #7209b7;
  }
`;

const LoginButton = styled.button`
  background-color: #7209b7;
  color: #fff;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 10px #7209b7;
    transform: scale(1.03);
  }
      font-family: 'Orbitron', sans-serif;

`;

const Content = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Hero = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
`;

const HeroText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #b5179e;
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  max-width: 600px;
  line-height: 1.7;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: #1a1a1d;
  padding: 2rem;
  border-radius: 1.25rem;
  border: 1px solid #2b2b2e;
  text-align: center;
  transition: transform 0.2s;
  color: #ddd;
`;

const IconWrapper = styled.div`
  color: #7209b7;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 0.5rem;
`;

const FeatureDesc = styled.p`
  font-size: 0.95rem;
  color: #999;
`;

const Updates = styled.div`
  background: rgba(10, 10, 20, 0.7);
  border-radius: 1.25rem;
  padding: 2rem;
  border: 1px solid #1a1a25;
`;

const UpdatesTitle = styled.h2`
  font-size: 1.5rem;
  color: #b5179e;
  margin-bottom: 1rem;
`;

const UpdateList = styled.ul`
  list-style: disc;
  padding-left: 1.5rem;
  color: #bbb;
  font-size: 0.95rem;
  line-height: 1.7;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
    
      <NavbarWrapper>
        <NavContainer>
          <Brand onClick={() => navigate('/')}>Dante AI</Brand>
          <NavLinks>
            <Link onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}>Multiplataforma</Link>
            <Link onClick={() => window.scrollTo({ top: 1400, behavior: 'smooth' })}>Desarrollo</Link>
            <LoginButton onClick={() => navigate('/login')}>Iniciar sesión</LoginButton>
          </NavLinks>
        </NavContainer>
      </NavbarWrapper>

      <Background>
        <Content>
          <Hero>
            <HeroText>
              <Title>Dante AI</Title>
              <Subtitle>
                La plataforma más intuitiva para integrar inteligencia artificial con datos de tu empresa. Consulta clientes, inventario y más con una simple pregunta.
              </Subtitle>
            </HeroText>
            <img
              src={astronaut}
              alt="Astronauta Dante"
              style={{ maxWidth: 320, borderRadius: '1rem' }}
            />
          </Hero>

          <Features>
            {[{
              icon: <Rocket size={36} />, title: 'Despliegue Rápido', desc: 'Tu empresa conectada en minutos con paneles inteligentes.'
            }, {
              icon: <Database size={36} />, title: 'Datos Vivos', desc: 'Consulta en tiempo real desde la base de datos empresarial.'
            }, {
              icon: <BarChart2 size={36} />, title: 'Dashboard Avanzado', desc: 'Visualización clara y elegante de KPIs y operaciones.'
            }, {
              icon: <ShieldCheck size={36} />, title: 'Seguridad Empresarial', desc: 'Protección avanzada de datos e identidades.'
            }, {
              icon: <Users size={36} />, title: 'Perfiles Inteligentes', desc: 'Usuarios con accesos independientes y personalizables.'
            }, {
              icon: <Cpu size={36} />, title: 'IA Integrada', desc: 'Respuestas automáticas inteligentes con contexto de negocio.'
            }].map(({ icon, title, desc }, i) => (
              <FeatureCard
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <IconWrapper>{icon}</IconWrapper>
                <FeatureTitle>{title}</FeatureTitle>
                <FeatureDesc>{desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </Features>

          <Updates>
            <UpdatesTitle>🛠 Últimas actualizaciones</UpdatesTitle>
            <UpdateList>
              <li>Nuevos perfiles de usuario tipo Netflix</li>
              <li>Chatbot IA conectado a MySQL empresarial</li>
              <li>Sección de reportes financieros automatizados</li>
              <li>Validación de datos y autenticación avanzada</li>
            </UpdateList>
          </Updates>
        </Content>
      </Background>
    </>
  );
};

export default Home;
