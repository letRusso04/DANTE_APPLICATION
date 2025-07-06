import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { UserModel } from '../../../models/userModels';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: #1f1f23;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 550px;
  color: white;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  background-color: #2a2a30;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #6b2233;
  }
`;

const Select = styled.select`
  padding: 0.6rem 1rem;
  background-color: #2a2a30;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #6b2233;
  }
`;

const FileInput = styled.input`
  background-color: transparent;
  color: white;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  background-color: ${({ primary }) => (primary ? '#6b2233' : '#333')};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

type Props = {
  user: UserModel;
  onClose: () => void;
  onSave: (data: Partial<UserModel>, avatarFile?: File, newPassword?: string) => void;
};

const roles = ['Usuario', 'Soporte', 'Operador', 'Propietario', 'Programador'];
const genders = ['Masculino', 'Femenino', 'Otro'];

const EditUserModal: React.FC<Props> = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<UserModel>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      job_title: user.job_title,
      gender: user.gender,
      role: user.role,
      birth_date: user.birth_date,
      is_active: user.is_active,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, avatarFile || undefined, password || undefined);
  };

  return (
    <Overlay>
      <Modal>
        <Title>Editar Usuario</Title>
        <Form onSubmit={handleSubmit}>
          <Input name="name" placeholder="Nombre" value={form.name || ''} onChange={handleChange} />
          <Input name="email" placeholder="Correo" value={form.email || ''} onChange={handleChange} />
          <Input name="phone" placeholder="Teléfono" value={form.phone || ''} onChange={handleChange} />
          <Input name="job_title" placeholder="Cargo" value={form.job_title || ''} onChange={handleChange} />

          {/* Select para género */}
          <Select name="gender" value={form.gender || ''} onChange={handleChange}>
            <option value="" disabled>
              Selecciona género
            </option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>

          {/* Select para rol */}
          <Select name="role" value={form.role || 'Usuario'} onChange={handleChange}>
            {roles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </Select>

          <Input
            type="date"
            name="birth_date"
            placeholder="Fecha de nacimiento"
            value={form.birth_date ? String(form.birth_date).substring(0, 10) : ''}
            onChange={handleChange}
          />

          <FileInput type="file" accept="image/*" onChange={handleAvatarChange} />
          <Input
            type="password"
            placeholder="Nueva contraseña (opcional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <ButtonRow>
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button primary type="submit">
              Guardar
            </Button>
          </ButtonRow>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default EditUserModal;
