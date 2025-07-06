import React, { useState } from "react";
import styled from "styled-components";
import type { UserModel } from "../../../models/userModels";
import { createUser } from "../../../services/userServices";


const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
`;
const ModalContainer = styled.div`
  background: #1A1A1F;
  padding: 2rem;
  border-radius: 10px;
  width: 600px;
  max-width: 100%;       /* para que no se pase del ancho del viewport */
  max-height: 90vh;      /* para que no exceda el alto de la pantalla */
  overflow-y: auto;      /* scroll interno si contenido es muy alto */
  color: #E8E8E8;
  font-family: "Poppins", sans-serif;
  box-sizing: border-box;
    &::-webkit-scrollbar { display: none; }

`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const Field = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.3rem;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #121212;
  color: #E8E8E8;
  font-size: 1rem;

  &:focus {
    border-color: #6B2233;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #121212;
  color: #E8E8E8;
  font-size: 1rem;

  &:focus {
    border-color: #6B2233;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  background-color: ${({ variant }) => (variant === "primary" ? "#6B2233" : "#444")};
  border: none;
  padding: 0.6rem 1.2rem;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${({ variant }) => (variant === "primary" ? "#8e2a42" : "#666")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  color: #E74C3C;
  margin-top: -0.5rem;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
`;

interface Props {
  companyId: string;
  onClose: () => void;
  onCreate: (newUser: UserModel) => void;
}

const roles = ["Usuario", "Soporte", "Operador", "Propietario", "Programador"] as const;

const CreateUserModal: React.FC<Props> = ({ companyId, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+58"); // ejemplo prefijo
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [role, setRole] = useState<typeof roles[number]>("Usuario");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };
const handleSubmit = async () => {
  if (!name.trim()) return setError("El nombre es obligatorio");
  if (!isValidEmail(email)) return setError("Correo inválido");
  if (!password || password.length < 4) return setError("La contraseña debe tener al menos 4 caracteres");
  if (!gender) return setError("Selecciona un género");
  if (!birthDate) return setError("Selecciona fecha de nacimiento");
  if (!role) return setError("Selecciona un rol");

  setError(null);
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("company_id", companyId);
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phonePrefix + phone.trim());
    formData.append("job_title", jobTitle.trim());
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("birth_date", birthDate);
    formData.append("role", role);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await createUser(formData);

    if (res.success && res.user) {
      onCreate(res.user);
    } else {
      setError(res.error || "Error al crear usuario");
    }
  } catch {
    setError("Error inesperado al crear usuario");
  } finally {
    setLoading(false);
  }
};

  return (
    <Overlay>
      <ModalContainer>
        <Title>Crear Nuevo Usuario</Title>

        <Field>
          <Label>Nombre</Label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Field>

        <Field>
          <Label>Correo</Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </Field>

        <Field>
          <Label>Teléfono</Label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Input
              style={{ width: "80px" }}
              value={phonePrefix}
              onChange={e => setPhonePrefix(e.target.value)}
              placeholder="+58"
            />
            <Input
              style={{ flex: 1 }}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Ej: 4121234567"
            />
          </div>
        </Field>

        <Field>
          <Label>Cargo</Label>
          <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        </Field>

        <Field>
          <Label>Contraseña</Label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </Field>

        <Field>
          <Label>Género</Label>
          <Select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">Selecciona</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </Select>
        </Field>

        <Field>
          <Label>Fecha de Nacimiento</Label>
          <Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        </Field>

        <Field>
          <Label>Rol</Label>
          <Select value={role} onChange={e => setRole(e.target.value as typeof roles[number])}>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label>Avatar</Label>
          <Input type="file" accept="image/*" onChange={handleAvatarChange} />
        </Field>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creando..." : "Crear Usuario"}
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default CreateUserModal;
