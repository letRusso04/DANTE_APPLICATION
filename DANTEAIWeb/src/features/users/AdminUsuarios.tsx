import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  FaUserEdit,
  FaUserTimes,
  FaTrashAlt,
  FaPlus,
  FaUsers,
  FaHome,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { UserModel } from "../../models/userModels";
import {
  deleteUser,
  getUsers,
  updateOtherUser,
} from "../../services/userServices";
import EditUserModal from "./components/editModal";
import CreateUserModal from "./components/createModal";
import { API_AVATAR } from "../../services/routes/routesAPI";
import { useCompanyStore } from "../../stores/companyStore";

// Colores de la UI
const colors = {
  fondo: "#0D0D11",
  panel: "#1A1A1F",
  texto: "#E8E8E8",
  acento: "#6B2233",
  secundario: "#888",
  verde: "#27AE60",
  rojo: "#E74C3C",
};

// Styled components...

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${colors.fondo};
  color: ${colors.texto};
  font-family: "Poppins", sans-serif;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
`;

const AddButton = styled.button`
  background-color: ${colors.acento};
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #8e2a42;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${colors.panel};
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background: #2a2a2a;
  color: ${colors.secundario};
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #2d2d2d;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const ActionBtn = styled.button<{ color?: string }>`
  background: ${({ color }) => color || "#444"};
  color: white;
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

const Drawer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? "220px" : "100px")};
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
`;

const DrawerItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ active }) => (active ? colors.acento : colors.texto)};
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.3rem;
  background-color: ${({ active }) => (active ? "#1f1f23" : "transparent")};
  &:hover {
    background-color: #22222a;
  }
`;

const SearchInput = styled.input`
  background-color: #262630;
  border: 1px solid #3c3c3c;
  color: ${colors.texto};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
  max-width: 320px;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: ${colors.acento};
  }

  &::placeholder {
    color: ${colors.secundario};
  }
`;

const UsuariosDashboard = () => {
  const navigate = useNavigate();
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const company = useCompanyStore((state) => state.company);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const res = await getUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      } else {
        setUsers([]);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar este usuario?"))
      return;

    const res = await deleteUser(id);
    if (res.success) {
      setUsers(users.filter((u) => u.id_user !== id));
      alert("Usuario eliminado correctamente");
    } else {
      alert(`Error eliminando usuario: ${res.error || "Desconocido"}`);
    }
  };

  const handleToggleActive = async (user: UserModel) => {
    const newStatus = !user.is_active;
    const res = await updateOtherUser(user.id_user, { is_active: newStatus });
    if (res.success) {
      setUsers(
        users.map((u) =>
          u.id_user === user.id_user ? { ...u, is_active: newStatus } : u
        )
      );
      alert(`Usuario ${newStatus ? "activado" : "desactivado"} correctamente`);
    } else {
      alert(`Error actualizando estado: ${res.error || "Desconocido"}`);
    }
  };

  const handleEdit = (id: string) => {
    const found = users.find((u) => u.id_user === id);
    if (found) setSelectedUser(found);
  };

  const handleSaveUser = async (
    changes: Partial<UserModel>,
    avatarFile?: File,
    newPassword?: string
  ) => {
    if (!selectedUser) return;

    const formData = new FormData();
    for (const key in changes) {
      if ((changes as any)[key]) {
        formData.append(key, (changes as any)[key]);
      }
    }
    if (avatarFile) formData.append("avatar", avatarFile);
    if (newPassword) formData.append("password", newPassword);

    const res = await updateOtherUser(selectedUser.id_user, formData, true);

    if (res.success && res.user) {
      setUsers(
        users.map((u) => (u.id_user === res.user.id_user ? res.user : u))
      );
      setSelectedUser(null);
    } else {
      alert(`Error actualizando: ${res.error || "Desconocido"}`);
    }
  };

  return (
    <Layout>
      <Drawer
        expanded={drawerExpanded}
        onMouseEnter={() => setDrawerExpanded(true)}
        onMouseLeave={() => setDrawerExpanded(false)}
      >
        <DrawerItem
          onClick={() => navigate("/dashboard")}
          active={location.pathname === "/dashboard"}
        >
          <FaHome />
          {drawerExpanded && "Dashboard"}
        </DrawerItem>

        <DrawerItem
          onClick={() => navigate("/usuario/admin")}
          active={location.pathname === "/usuario/admin"}
        >
          <FaUsers />
          {drawerExpanded && "Usuarios"}
        </DrawerItem>
      </Drawer>

      <Main>
        <Header>
          <Title>Gestión de Usuarios</Title>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <SearchInput
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AddButton onClick={() => setShowAddModal(true)}>
              <FaPlus /> Agregar Usuario
            </AddButton>
          </div>
        </Header>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Avatar</Th>
                <Th>Nombre</Th>
                <Th>Correo</Th>
                <Th>Permisos</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <Td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: colors.secundario,
                    }}
                  >
                    No se encontraron usuarios.
                  </Td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id_user}>
                    <Td>
                      {user.avatar_url ? (
                        <img
                          src={`${API_AVATAR}${user.avatar_url}`}
                          alt="avatar"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#444",
                          }}
                        />
                      )}
                    </Td>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.role}</Td>
                    <Td
                      style={{
                        color: user.is_active ? colors.verde : colors.rojo,
                      }}
                    >
                      {user.is_active ? "Activo" : "Inactivo"}
                    </Td>
                    <Td>
                      <ActionButtons>
                        <ActionBtn
                          color={colors.verde}
                          onClick={() => handleEdit(user.id_user)}
                          title="Editar"
                        >
                          <FaUserEdit />
                        </ActionBtn>
                        <ActionBtn
                          color={user.is_active ? colors.acento : colors.verde}
                          onClick={() => handleToggleActive(user)}
                          title={
                            user.is_active
                              ? "Desactivar usuario"
                              : "Activar usuario"
                          }
                        >
                          <FaUserTimes />
                        </ActionBtn>
                        <ActionBtn
                          color={colors.rojo}
                          onClick={() => handleDelete(user.id_user)}
                          title="Eliminar"
                        >
                          <FaTrashAlt />
                        </ActionBtn>
                      </ActionButtons>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}

        {selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleSaveUser}
          />
        )}
        {showAddModal && company?.id_company && (
          <CreateUserModal
            companyId={company.id_company}
            onClose={() => setShowAddModal(false)}
            onCreate={(newUser) => {
              setUsers((prev) => [...prev, newUser]);
              setShowAddModal(false);
            }}
          />
        )}
      </Main>
    </Layout>
  );
};

export default UsuariosDashboard;
