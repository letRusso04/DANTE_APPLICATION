import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
    FaUserCircle,
    FaEnvelope,
    FaLock,
    FaSignOutAlt,
    FaHome,
    FaPen,
    FaTimes,
    FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const colors = {
    fondo: "#0D0D11",
    panel: "#1A1A1F",
    texto: "#E8E8E8",
    acentoMorado: "#6A0DAD",
    acentoVinotinto: "#8B1E3F",
    inputBg: "#22222a",
    inputBorder: "#4B0082",
    btnEdit: "#6A0DAD",
    btnCancel: "#E74C3C",
};

const fadeInUp = keyframes`
  from {opacity: 0; transform: translateY(15px);}
  to {opacity:1; transform: translateY(0);}
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  font-family: "Poppins", sans-serif;
  background-color: ${colors.fondo};
  color: ${colors.texto};
  overflow: hidden;
  @media (max-width: 480px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
`;

const Sidebar = styled.nav<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? "220px" : "72px")};
  background-color: ${colors.panel};
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  transition: width 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.8);
  user-select: none;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 72px;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 56px;
    flex-direction: row;
    padding: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.8);
    overflow-x: auto;
  }
`;
const Drawer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '220px' : '100px')};
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
  background-color: ${colors.panel};
`;

const DrawerItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ active }) => (active ? colors.texto : colors.texto)};
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.3rem;
  background-color: ${({ active }) => (active ? '#1f1f23' : 'transparent')};

  &:hover {
    background-color: #22222a;
  }

  svg {
    min-width: 20px;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2.5rem 3rem;
  overflow-y: auto;
  animation: ${fadeInUp} 0.5s ease forwards;
  min-width: 0; /* importante para evitar overflow */

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: ${colors.acentoMorado};
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }
`;

const ProfileSection = styled.div`
  max-width: 600px;
  width: 100%;
  background-color: ${colors.panel};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(139, 30, 63, 0.5);
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 1.5rem;
  }
`;

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.6rem;
  gap: 1rem;
  position: relative;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FieldLabel = styled.label`
  flex: 0 0 130px;
  font-weight: 600;
  color: ${colors.acentoMorado};
  user-select: none;

  @media (max-width: 480px) {
    margin-bottom: 0.3rem;
  }
`;

const FieldValue = styled.span`
  flex: 1;
  font-size: 1.05rem;
  color: ${colors.texto};
  min-width: 150px;

  @media (max-width: 480px) {
    min-width: auto;
    width: 100%;
  }
`;

const Input = styled.input<{ editable: boolean }>`
  flex: 1;
  padding: 0.6rem 1rem 0.6rem 2.8rem;
  background-color: ${colors.inputBg};
  border: 2px solid
    ${({ editable }) => (editable ? colors.acentoMorado : "transparent")};
  border-radius: 8px;
  color: ${colors.texto};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  pointer-events: ${({ editable }) => (editable ? "auto" : "none")};
  opacity: ${({ editable }) => (editable ? 1 : 0)};
  position: absolute;
  left: 140px;
  top: 50%;
  transform: translateY(-50%);
  min-width: 200px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.acentoMorado};
    box-shadow: 0 0 10px ${colors.acentoMorado};
  }

  @media (max-width: 480px) {
    position: static;
    transform: none;
    opacity: 1;
    pointer-events: auto;
    min-width: auto;
    margin-left: 0;
    width: 100%;
    padding-left: 2.5rem;
    margin-top: -32px;
    margin-bottom: 8px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.acentoVinotinto};
  font-size: 1.3rem;
  pointer-events: none;

  @media (max-width: 480px) {
    left: 12px;
    top: 10px;
  }
`;

const EditBtn = styled.button<{ active?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ active }) => (active ? colors.acentoMorado : colors.acentoVinotinto)};
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.25s ease, color 0.25s ease;
  user-select: none;
  margin-left: auto;

  &:hover {
    background-color: ${colors.acentoMorado};
    color: #fff;
  }

  @media (max-width: 480px) {
    margin-left: 0;
    margin-top: 4px;
  }
`;

const SaveCancelWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SaveBtn = styled.button`
  background-color: ${colors.acentoMorado};
  padding: 0.8rem 1.8rem;
  border-radius: 10px;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 120px;

  &:hover {
    background-color: ${colors.acentoVinotinto};
  }
`;

const CancelBtn = styled.button`
  background-color: transparent;
  border: 2px solid ${colors.acentoVinotinto};
  padding: 0.75rem 1.6rem;
  border-radius: 10px;
  color: ${colors.acentoVinotinto};
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover {
    background-color: ${colors.acentoVinotinto};
    color: white;
  }
`;

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Avatar = styled.div<{ url: string }>`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background-image: url(${(p) => p.url});
  background-size: cover;
  background-position: center;
  border: 3px solid ${colors.acentoMorado};
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${colors.acentoVinotinto};
  }
`;

const UploadLabel = styled.label`
  cursor: pointer;
  padding: 0.6rem 1.2rem;
  background-color: ${colors.acentoMorado};
  color: white;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  user-select: none;

  &:hover {
    background-color: ${colors.acentoVinotinto};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;



const ToggleDrawerBtn = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  background: ${colors.acentoMorado};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 2100;
  display: none;

  @media (max-width: 480px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Account = () => {
    const [drawerExpanded, setDrawerExpanded] = useState(true);
    const [drawerRightOpen, setDrawerRightOpen] = useState(false);
    const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=12");

    const [editing, setEditing] = useState({
        name: false,
        email: false,
        password: false,
    });

    const [formData, setFormData] = useState({
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        password: "",
    });

    const toggleEdit = (field: keyof typeof editing) => {
        setEditing((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof typeof formData
    ) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setAvatar(url);
        }
    };

    const handleSave = () => {
        setEditing({ name: false, email: false, password: false });
        alert("Cambios guardados.");
    };

    const handleCancel = () => {
        setEditing({ name: false, email: false, password: false });
        setFormData({
            name: "Juan Pérez",
            email: "juan.perez@example.com",
            password: "",
        });
    };
    const navigate = useNavigate();
    return (
        <>
            <ToggleDrawerBtn onClick={() => setDrawerExpanded((prev) => !prev)} aria-label="Toggle sidebar">
                <FaBars />
            </ToggleDrawerBtn>
            <Container>
                <Drawer
                    expanded={drawerExpanded}
                    onMouseEnter={() => setDrawerExpanded(true)}
                    onMouseLeave={() => setDrawerExpanded(false)}
                >
                    <DrawerItem onClick={() => navigate('/dashboard')} active={location.pathname === '/dashboard'}>
                        <FaHome />
                        {drawerExpanded && 'Dashboard'}
                    </DrawerItem>

                    <DrawerItem onClick={() => navigate('/mi-cuenta')} active={location.pathname === '/mi-cuenta'}>

                        <FaUserCircle />
                        {drawerExpanded && 'Cuenta'}
                    </DrawerItem>
                    <DrawerItem
                        active={false}
                        onClick={() => {
                            alert('Cerrando sesión...');
                        }}
                    >
                        <FaSignOutAlt />                     {drawerExpanded && 'Cerrar Sesión'}

                    </DrawerItem>
                </Drawer>

                <Content>
                    <Title>Mi Cuenta</Title>

                    <ProfileSection>
                        <AvatarWrapper>
                            <Avatar url={avatar} title="Cambiar foto" />
                            <UploadLabel htmlFor="avatarUpload">Cambiar foto</UploadLabel>
                            <HiddenInput
                                id="avatarUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </AvatarWrapper>

                        {/* Nombre */}
                        <FieldRow>
                            <FieldLabel>Nombre completo</FieldLabel>
                            <FieldValue>{!editing.name && formData.name}</FieldValue>
                            <Input
                                editable={editing.name}
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange(e, "name")}
                            />
                            <EditBtn
                                onClick={() => toggleEdit("name")}
                                aria-label={editing.name ? "Cancelar edición" : "Editar nombre"}
                            >
                                {editing.name ? <FaTimes /> : <FaPen />}
                            </EditBtn>
                        </FieldRow>

                        {/* Email */}
                        <FieldRow>
                            <FieldLabel>Email</FieldLabel>
                            <FieldValue>{!editing.email && formData.email}</FieldValue>
                            <Input
                                editable={editing.email}
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange(e, "email")}
                            />
                            <EditBtn
                                onClick={() => toggleEdit("email")}
                                aria-label={editing.email ? "Cancelar edición" : "Editar email"}
                            >
                                {editing.email ? <FaTimes /> : <FaPen />}
                            </EditBtn>
                        </FieldRow>

                        {/* Password */}
                        <FieldRow>
                            <FieldLabel>Contraseña</FieldLabel>
                            <FieldValue>{!editing.password && "********"}</FieldValue>
                            <Input
                                editable={editing.password}
                                type="password"
                                placeholder="Nueva contraseña"
                                value={formData.password}
                                onChange={(e) => handleChange(e, "password")}
                            />
                            <EditBtn
                                onClick={() => toggleEdit("password")}
                                aria-label={editing.password ? "Cancelar edición" : "Editar contraseña"}
                            >
                                {editing.password ? <FaTimes /> : <FaPen />}
                            </EditBtn>
                        </FieldRow>

                        {(editing.name || editing.email || editing.password) && (
                            <SaveCancelWrapper>
                                <SaveBtn onClick={handleSave}>Guardar Cambios</SaveBtn>
                                <CancelBtn onClick={handleCancel}>Cancelar</CancelBtn>
                            </SaveCancelWrapper>
                        )}
                    </ProfileSection>
                </Content>


            </Container>
        </>
    );
};

export default Account;
