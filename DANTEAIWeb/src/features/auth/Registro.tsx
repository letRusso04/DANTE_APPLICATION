import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import star from '../../assets/stardust.png';
import type { CompanyModel } from '../../models/companyModels';
import { createCompany } from '../../services/companyServices';
import { useCompanyStore } from '../../stores/companyStore';

const colors = {
  fondo: '#121212',
  panelFondo: '#1F1F23',
  borde: '#3A3A44',
  texto: '#E8E8E8',
  placeholder: '#77787B',
  acento: '#6B2233',
  error: '#E63946',
  success: '#16c784',
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
  padding: 3rem 3rem;
  border-radius: 1.5rem;
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.85),
    0 0 0 1px ${colors.borde} inset;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  transition: color 0.3s;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
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

const Select = styled.select`
  background: #1c1c22;
  border: 1px solid ${colors.borde};
  border-radius: 0.6rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: ${colors.texto};
  transition: all 0.3s ease;
  min-width: 100px;

  &:focus {
    outline: none;
    border-color: ${colors.acento};
    box-shadow: 0 0 6px ${colors.acento}66;
    background: #24242a;
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

const Message = styled.div<{ type: 'error' | 'success' }>`
  background: ${(props) => (props.type === 'error' ? colors.error : colors.success)};
  color: #fff;
  padding: 0.9rem 1.2rem;
  font-size: 0.9rem;
  border-radius: 0.6rem;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 0 10px ${(props) => (props.type === 'error' ? colors.error : colors.success)}66;
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
// Prefijos de América
const prefijosAmerica = [
  '+1', '+52', '+55', '+54', '+57', '+58', '+56', '+51', '+591', '+593',
  '+595', '+598', '+507', '+506', '+503', '+502', '+505', '+509', '+592',
  '+597', '+596', '+53', '+784', '+869', '+590'
];

const Register: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    owner: '',
    prefix: '+58',
    phone: '',
    company: '',
    rif: '',
    address: '',
    password: '',
    confirm: '',
  });

  const [status, setStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useCompanyStore(); // opcional: login inmediato tras crear empresa

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'rif' ? value.toUpperCase() : value });
    setStatus(null);
  };

  const validateForm = () => {
    const { email, owner, phone, company, rif, address, password, confirm } = form;

    const rifRegex = /^[VEJPG]-\d{8}-\d$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;

    if (!email || !owner || !phone || !company || !rif || !address || !password || !confirm) {
      return 'Por favor, completa todos los campos.';
    }

    if (!emailRegex.test(email)) return 'Correo inválido.';
    if (!nameRegex.test(owner)) return 'Nombre del dueño no válido.';
    if (!rifRegex.test(rif)) return 'El RIF debe tener el formato correcto: J-12345678-9.';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    if (password !== confirm) return 'Las contraseñas no coinciden.';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return setStatus({ type: 'error', msg: error });

    setLoading(true);

    const payload: CompanyModel = {
      email: form.email,
      name: form.owner,
      phone: `${form.prefix}${form.phone}`,
      company_name: form.company,
      rif: form.rif,
      address: form.address,
      password: form.password,
    };

    const result = await createCompany(payload);
    setLoading(false);

    if (result.success) {
      // Puedes guardar directamente la sesión si quieres que quede activa
      // login(result.data, ''); // si usaras token
      setStatus({ type: 'success', msg: 'Registro exitoso. Bienvenido a bordo 🚀' });
      setForm({
        email: '',
        owner: '',
        prefix: '+58',
        phone: '',
        company: '',
        rif: '',
        address: '',
        password: '',
        confirm: '',
      });
      setTimeout(() => navigate('/login'), 1800); // redirige después de un breve delay
    } else {
      setStatus({ type: 'error', msg: result.error });
    }
  };

  return (
    <Background>
      <Card onSubmit={handleSubmit} noValidate>
        <Title>Registrar Empresa</Title>

        <InputGroup>
          <Label>Correo corporativo</Label>
          <Input name="email" type="email" placeholder="correo@empresa.com" value={form.email} onChange={handleChange} disabled={loading} />
        </InputGroup>

        <InputGroup>
          <Label>Nombre del dueño</Label>
          <Input name="owner" type="text" placeholder="Juan Pérez" value={form.owner} onChange={handleChange} disabled={loading} />
        </InputGroup>

        <InputGroup>
          <Label>Teléfono</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Select name="prefix" value={form.prefix} onChange={handleChange} disabled={loading}>
              {prefijosAmerica.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Input name="phone" type="tel" placeholder="04141234567" value={form.phone} onChange={handleChange} disabled={loading} style={{ flex: 1 }} />
          </div>
        </InputGroup>

        <InputGroup>
          <Label>Nombre de la empresa</Label>
          <Input name="company" type="text" placeholder="Dante AI C.A." value={form.company} onChange={handleChange} disabled={loading} />
        </InputGroup>

        <InputGroup>
          <Label>RIF de la empresa</Label>
          <Input name="rif" type="text" placeholder="J-12345678-9" value={form.rif} onChange={handleChange} disabled={loading} />
        </InputGroup>

        <InputGroup>
          <Label>Ubicación fiscal</Label>
          <Input name="address" type="text" placeholder="Av. Principal, Edificio Dante AI" value={form.address} onChange={handleChange} disabled={loading} />
        </InputGroup>

        <InputGroup>
          <Label>Contraseña</Label>
          <Input name="password" type="password" placeholder="********" value={form.password} onChange={handleChange} disabled={loading} />
        </InputGroup>

        <InputGroup>
          <Label>Confirmar contraseña</Label>
          <Input name="confirm" type="password" placeholder="********" value={form.confirm} onChange={handleChange} disabled={loading} />
        </InputGroup>

        {status && <Message type={status.type}>{status.msg}</Message>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </Button>

        <BackToLogin>
          <Link to="/login">← Volver al inicio de sesión</Link>
        </BackToLogin>
      </Card>
    </Background>
  );
};

export default Register;