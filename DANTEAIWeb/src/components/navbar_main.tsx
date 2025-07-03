// src/components/Navbar.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const NavbarWrapper = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(0, 255, 255, 0.05);
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
  color: #00ffff;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const Link = styled.span`
  font-size: 0.95rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #00ffff;
  }
`;

const LoginButton = styled.button`
  background-color: #00ffff;
  color: #000;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0 10px #00ffff;
    transform: scale(1.03);
  }
`;

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <NavbarWrapper>
      <NavContainer>
        <Brand onClick={() => navigate('/')}>Dante AI</Brand>

        <NavLinks>
          <Link onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>Multiplataforma</Link>
          <Link onClick={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}>Desarrollo</Link>
          <LoginButton onClick={() => navigate('/login')}>Iniciar sesión</LoginButton>
        </NavLinks>
      </NavContainer>
    </NavbarWrapper>
  );
};

export default Navbar;