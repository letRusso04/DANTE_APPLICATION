import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  updateCurrentUser,
  updateUserAvatar,
  changeUserPassword,
} from "../../../services/userServices";
import { useUserStore } from "../../../stores/userStore";
import { API_AVATAR } from "../../../services/routes/routesAPI";

const colors = {
  fondo: "#0D0D11",
  panel: "#1A1A1F",
  texto: "#E8E8E8",
  acentoMorado: "#6A0DAD",
  acentoVinotinto: "#8B1E3F",
  inputBg: "#22222a",
  error: "#e74c3c",
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(to bottom, #1a1a1f 0%, #0d0d11 100%);
  font-family: "Poppins", sans-serif;
  color: ${colors.texto};
`;

const Sidebar = styled.nav`
  width: 220px;
  background-color: ${colors.panel};
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const DrawerItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${colors.texto};
  padding: 0.75rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#2a2a2f" : "transparent")};
  font-weight: 500;
  &:hover {
    background-color: #2f2f36;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
  animation: ${fadeIn} 0.5s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${colors.acentoMorado};
`;

const ProfileCard = styled.div`
  background: ${colors.panel};
  padding: 2rem;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background: #292930;
  border-radius: 8px;
`;

const Label = styled.span`
  color: ${colors.acentoMorado};
  font-weight: 600;
`;

const Value = styled.span`
  font-weight: 500;
`;

const Button = styled.button<{ cancel?: boolean }>`
  background-color: ${({ cancel }) => (cancel ? "transparent" : colors.acentoMorado)};
  color: ${({ cancel }) => (cancel ? colors.acentoVinotinto : "#fff")};
  border: ${({ cancel }) => (cancel ? `2px solid ${colors.acentoVinotinto}` : "none")};
  padding: 0.7rem 1.6rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease;
  margin-top: 1.5rem;
  align-self: flex-end;

  &:hover {
    background-color: ${colors.acentoVinotinto};
    color: #fff;
  }
`;

const EditButton = styled(Button)`
  background-color: ${colors.acentoVinotinto};
  margin-top: 1rem;
  align-self: center;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background: ${colors.panel};
  padding: 2rem;
  border-radius: 1rem;
  width: 90vw;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: ${colors.texto};
  font-size: 1.5rem;
  cursor: pointer;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
`;

const LabelInput = styled.label`
  color: ${colors.acentoMorado};
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  background: ${colors.inputBg};
  border: 1.5px solid ${({ hasError }) => (hasError ? colors.error : "transparent")};
  border-radius: 8px;
  padding: 0.7rem 1rem;
  color: ${colors.texto};
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.acentoMorado};
  }
`;

const ErrorText = styled.span`
  color: ${colors.error};
  font-size: 0.8rem;
  margin-top: -0.6rem;
  margin-bottom: 0.8rem;
`;

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Avatar = styled.div<{ url: string }>`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background-image: url('${(p) => p.url}');

  background-size: cover;
  background-position: center;
  border: 2px solid ${colors.acentoMorado};
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${colors.acentoMorado};
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: ${colors.acentoVinotinto};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

type FormField = keyof typeof initialForm;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  current_password: "",
  new_password: "",
  confirm_password: "",
};

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

const Account = () => {
  const navigate = useNavigate();
  const storeUser = useUserStore((s) => s.user);

  const [userData, setUserData] = useState(initialForm);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await getCurrentUser();
      if (res.success && res.user) {
        setUserData({
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone || "",
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
setForm({
  name: res.user.name || "",
  email: res.user.email || "",
  phone: res.user.phone || "",
  current_password: "",
  new_password: "",
  confirm_password: "",
});        setAvatar(res.user.avatar_url ? `${API_AVATAR}${res.user.avatar_url}` : `https://ui-avatars.com/api/?name=${res.user.name}`);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as FormField]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0] && storeUser) {
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    const res = await updateUserAvatar(storeUser.id_user, file);
    if (res.success && res.user.avatar_url) {
      const finalUrl = `${API_AVATAR}${res.user.avatar_url}`;
      setAvatar(finalUrl);
      useUserStore.getState().setUser(res.user);
      alert("Imagen actualizada correctamente.");
    }
  }
};

  const validateForm = () => {
    let valid = true;
    const newErrors: Partial<Record<FormField, string>> = {};

    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!form.email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!validateEmail(form.email)) newErrors.email = "Correo inválido";
    if (!form.phone.trim()) newErrors.phone = "El teléfono es obligatorio";
    if (form.new_password || form.confirm_password || form.current_password) {
      if (form.new_password.length < 4) newErrors.new_password = "Mínimo 4 caracteres";
      if (form.new_password !== form.confirm_password) newErrors.confirm_password = "No coinciden";
      if (!form.current_password) newErrors.current_password = "Requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !storeUser) return;

    const updateRes = await updateCurrentUser({
      id_user: storeUser.id_user,
      name: form.name,
      email: form.email,
      phone: form.phone,
    });
    if (!updateRes) return alert("Error actualizando");

    if (form.new_password) {
      const passRes = await changeUserPassword(
        storeUser.id_user,
        form.current_password,
        form.new_password
      );
      if (!passRes.success) return alert(passRes.error);
    }

    setUserData(form);
    setEditing(false);
    useUserStore.getState().setUser({ ...storeUser, name: form.name, email: form.email, phone: form.phone });
    setForm({ ...form, current_password: "", new_password: "", confirm_password: "" });
    alert("Información actualizada correctamente");
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({ ...userData, current_password: "", new_password: "", confirm_password: "" });
    setErrors({});
  };

  return (
    <Container>
      <Sidebar>
        <DrawerItem active={location.pathname === "/dashboard"} onClick={() => navigate("/dashboard")}> <FaHome /> Dashboard </DrawerItem>
        <DrawerItem active={location.pathname === "/mi-cuenta"} onClick={() => navigate("/mi-cuenta")}> <FaUserCircle /> Cuenta </DrawerItem>
        <DrawerItem active={false} onClick={() => alert("Cerrando sesión...")}> <FaSignOutAlt /> Cerrar Sesión </DrawerItem>
      </Sidebar>

      <Content>
        <Title>Mi Cuenta</Title>

        <ProfileCard>
          <AvatarWrapper>
            <Avatar url={avatar} />
          </AvatarWrapper>

          <InfoRow><Label>Nombre:</Label><Value>{userData.name}</Value></InfoRow>
          <InfoRow><Label>Correo:</Label><Value>{userData.email}</Value></InfoRow>
          <InfoRow><Label>Teléfono:</Label><Value>{userData.phone}</Value></InfoRow>

          <EditButton onClick={() => setEditing(true)}>Editar Información</EditButton>
        </ProfileCard>

        {editing && (
          <ModalBackground>
            <ModalContent>
              <CloseButton onClick={handleCancel}><FaTimes /></CloseButton>
              <AvatarWrapper>
                <Avatar url={avatar} />
                <UploadButton htmlFor="avatar-upload">
                  <FaUpload /> Cambiar Foto
                  <HiddenInput id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} />
                </UploadButton>
              </AvatarWrapper>

              {(["name", "email", "phone", "current_password", "new_password", "confirm_password"] as FormField[]).map((field) => (
                <Field key={field}>
                  <LabelInput htmlFor={field}>{field.replace("_", " ").toUpperCase()}</LabelInput>
                  <Input
                    id={field}
                    name={field}
                    type={field.includes("password") ? "password" : "text"}
                    value={form[field]}
                    onChange={handleChange}
                    hasError={!!errors[field]}
                  />
                  {errors[field] && <ErrorText>{errors[field]}</ErrorText>}
                </Field>
              ))}

              <Actions>
                <Button cancel onClick={handleCancel}>Cancelar</Button>
                <Button onClick={handleSave}>Guardar</Button>
              </Actions>
            </ModalContent>
          </ModalBackground>
        )}
      </Content>
    </Container>
  );
};

export default Account;
