import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const colors = {
  fondo: '#121212',
  panelFondo: '#1F1F23',
  borde: '#3A3A44',
  texto: '#E8E8E8',
  placeholder: '#77787B',
  acento: '#6B2233', // vinotinto oscuro apagado
  error: '#E63946',
};

const moveStars = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -1000px 1000px; }
`;

const Background = styled.div`
  background: #000 url('https://www.transparenttextures.com/patterns/stardust.png') repeat;
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
  padding: 3rem 3.5rem;
  border-radius: 1.2rem;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.8),
    inset 0 0 2px ${colors.borde};
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1px solid ${colors.borde};
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow:
      0 15px 40px rgba(0, 0, 0, 0.9),
      inset 0 0 5px ${colors.borde};
  }
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 2.2rem;
  color: ${colors.acento};
  text-align: center;
  margin-bottom: 1rem;
  user-select: none;
  letter-spacing: 0.03em;
`;

const Label = styled.label`
  color: ${colors.placeholder};
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  background: #24242a;
  border: 1px solid ${colors.borde};
  border-radius: 0.6rem;
  padding: 0.75rem 1.1rem;
  font-size: 1rem;
  color: ${colors.texto};
  transition: border-color 0.3s ease, background 0.3s ease;

  &::placeholder {
    color: ${colors.placeholder};
    font-style: normal;
  }

  &:focus {
    outline: none;
    border-color: ${colors.acento};
    background: #2d2d34;
  }
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  background: linear-gradient(90deg, #4a192f, #6b2233);
  color: #f5f5f5;
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(107, 34, 51, 0.5);
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #5c273f, #7a2e3f);
    box-shadow: 0 0 18px rgba(122, 46, 63, 0.75);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ErrorMsg = styled.div`
  background: ${colors.error};
  color: #fff;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  user-select: none;
`;

const HelpLink = styled.a`
  color: ${colors.placeholder};
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1.3rem;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.25s;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === 'astro@empresa.com' && password === 'space123') {
        alert('Bienvenido al sistema orbital 🧠');
      } else {
        setError('Acceso denegado: credenciales inválidas');
      }
    }, 1200);
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
