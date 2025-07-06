import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import star from "../../assets/stardust.png";
import { loginCompany } from '../../services/companyServices';
import { useCompanyStore } from '../../stores/companyStore';
import { useNavigate } from 'react-router-dom';

const colors = {
  fondo: '#121212',
  panelFondo: '#1F1F23',
  borde: '#3A3A44',
  texto: '#E8E8E8',
  placeholder: '#77787B',
  acento: '#6B2233',
  error: '#E63946',
};

const moveStars = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -1000px 1000px; }
`;

const Background = styled.div`
  background: #000 url('${star}') repeat;
  animation: ${moveStars} 180s linear infinite;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
`;

const Card = styled.form`
  background: ${colors.panelFondo};
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.85),
    0 0 0 1px ${colors.borde} inset;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  border: 1px solid ${colors.borde};
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      0 16px 45px rgba(0, 0, 0, 0.9),
      0 0 0 2px ${colors.borde} inset;
  }
`;

const Title = styled.h1`
  font-weight: 800;
  font-size: 2.3rem;
  color: ${colors.acento};
  text-align: center;
  margin-bottom: 0.5rem;
  user-select: none;
  letter-spacing: 0.05em;
`;

const Label = styled.label`
  color: ${colors.placeholder};
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  background: #1c1c22;
  border: 1px solid ${colors.borde};
  border-radius: 0.65rem;
  padding: 0.85rem 1.1rem;
  font-size: 1rem;
  color: ${colors.texto};
  transition: all 0.3s ease;

  &::placeholder {
    color: ${colors.placeholder};
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: ${colors.acento};
    background: #24242a;
    box-shadow: 0 0 6px ${colors.acento}66;
  }
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 1rem;
  font-weight: 700;
  font-size: 1.15rem;
  background: linear-gradient(90deg, #4a192f, #6b2233);
  color: #f5f5f5;
  border: none;
  border-radius: 0.9rem;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(107, 34, 51, 0.6);
  transition: all 0.35s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #5c273f, #842e43);
    box-shadow: 0 0 20px rgba(122, 46, 63, 0.8);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ErrorMsg = styled.div`
  background: ${colors.error};
  color: #fff;
  padding: 0.9rem 1.2rem;
  font-size: 0.9rem;
  border-radius: 0.6rem;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 0 10px ${colors.error}66;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const HelpLink = styled.a`
  color: ${colors.placeholder};
  text-align: center;
  font-size: 0.92rem;
  margin-top: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.acento};
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await loginCompany(email, password);

    setLoading(false);

    if (response.success) {
      // Guardar en Zustand
      useCompanyStore.getState().login(response.company, response.token);
      navigate('/seleccion');
    } else {
      setError(response.error);
    }
  };

  return (
    <Background>
      <Card onSubmit={handleSubmit} noValidate>
        <Title>Acceso al Sistema</Title>

        <InputGroup>
          <Label htmlFor="email">Correo Corporativo</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">Clave de Ingreso</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </InputGroup>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Entrar'}
        </Button>

        <HelpLink href="/registro">¿No posees cuenta?</HelpLink>
      </Card>
    </Background>
  );
};

export default Login;
