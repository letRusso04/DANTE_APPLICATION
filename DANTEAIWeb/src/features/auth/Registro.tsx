import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom'; // Para navegación

const colors = {
  fondo: '#121212',
  panelFondo: '#1F1F23',
  borde: '#3A3A44',
  texto: '#E8E8E8',
  placeholder: '#77787B',
  acento: '#6B2233', // vinotinto oscuro apagado
  error: '#E63946',
  success: '#16c784',
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
  max-width: 480px;
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

const Message = styled.div<{ type: 'error' | 'success' }>`
  background: ${(props) => (props.type === 'error' ? colors.error : colors.success)};
  color: #fff;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  user-select: none;
`;

const BackToLogin = styled.div`
  margin-top: 1.4rem;
  text-align: center;
  font-size: 0.95rem;

  a {
    color: ${colors.placeholder};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.25s;

    &:hover {
      color: ${colors.acento};
      text-decoration: underline;
    }
  }
`;

const Register: React.FC = () => {
  const [form, setForm] = useState({
    company: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [status, setStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const { company, email, password, confirm } = form;

    if (!company || !email || !password || !confirm) {
      return setStatus({ type: 'error', msg: 'Por favor, completa todos los campos.' });
    }

    if (password !== confirm) {
      return setStatus({ type: 'error', msg: 'Las contraseñas no coinciden.' });
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStatus({ type: 'success', msg: 'Registro exitoso. Bienvenido a bordo 🧑‍🚀' });
      // Aquí podrías hacer redirección o llamada a API real
    }, 1500);
  };

  return (
    <Background>
      <Card onSubmit={handleSubmit} noValidate>
        <Title>Registrar Empresa</Title>

        <InputGroup>
          <Label htmlFor="company">Nombre de la empresa</Label>
          <Input
            id="company"
            name="company"
            type="text"
            placeholder="Dante AI Corp"
            value={form.company}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">Correo corporativo</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="contacto@empresa.com"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="confirm">Confirmar contraseña</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="********"
            value={form.confirm}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </InputGroup>

        {status && <Message type={status.type}>{status.msg}</Message>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </Button>

        <BackToLogin>
          <Link to="/login">← Regresar a Iniciar Sesión</Link>
        </BackToLogin>
      </Card>
    </Background>
  );
};

export default Register;
