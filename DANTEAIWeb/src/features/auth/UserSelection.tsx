import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const colors = {
  fondo: '#121212',
  panelFondo: '#1F1F23',
  texto: '#E8E8E8',
  textoSecundario: '#a0a0a0',
  acento: '#6B2233',
  bordeActivo: 'rgba(38, 166, 91, 0.6)',
  bordeInactivo: 'rgba(230, 57, 70, 0.6)',
  hoverShadow: 'rgba(107, 34, 51, 0.5)',
  inputBg: '#24242a',
  inputTexto: '#ccc',
  modalBg: 'rgba(0, 0, 0, 0.75)',
  buttonBg: '#6B2233',
  buttonHoverBg: '#8E2A42',
};

const moveStars = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -1000px 1000px; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Background = styled.div`
  background: #000 url('https://www.transparenttextures.com/patterns/stardust.png') repeat;
  animation: ${moveStars} 120s linear infinite;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${colors.texto};
  font-family: 'Montserrat', sans-serif;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: ${colors.acento};
  font-weight: 700;
  user-select: none;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 520px;
  padding: 1rem 1.4rem;
  font-size: 1.15rem;
  border-radius: 0.6rem;
  border: none;
  background-color: ${colors.inputBg};
  color: ${colors.inputTexto};
  margin-bottom: 2.8rem;
  box-shadow: inset 0 0 8px #000000cc;
  transition: box-shadow 0.3s ease;

  &::placeholder {
    color: ${colors.inputTexto};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 12px ${colors.acento};
    background-color: #2c2c33;
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 3.4rem;
  width: 100%;
  justify-items: center;
`;

const UserCard = styled.div<{ disabled?: boolean }>`
  background: ${colors.panelFondo};
  border-radius: 1.5rem;
  padding: 3rem 2rem 3.5rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-align: center;
  box-shadow: 0 0 12px transparent;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.4s ease;
  border: 4px double
    ${({ disabled }) => (disabled ? colors.bordeInactivo : colors.bordeActivo)};
  animation: ${fadeInUp} 0.45s ease forwards;
  user-select: none;
  width: 200px;
  &:hover {
    ${({ disabled }) =>
      !disabled &&
      `
      transform: scale(1.12);
      box-shadow: 0 14px 40px ${colors.hoverShadow};
      border-color: ${colors.acento};
    `}
  }
`;

const Avatar = styled.div<{ image?: string }>`
  width: 130px;
  height: 130px;
  margin: 0 auto 1.8rem;
  border-radius: 50%;
  background-color: #4a4a57;
  background-image: ${({ image }) => (image ? `url(${image})` : 'none')};
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.9);
`;

const UserName = styled.p`
  font-weight: 700;
  font-size: 1.5rem;
  color: ${colors.texto};
  margin-bottom: 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.p`
  font-weight: 500;
  font-size: 1.05rem;
  color: ${colors.textoSecundario};
  user-select: none;
`;

const AddUserCard = styled(UserCard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${colors.acento};
  font-size: 5rem;
  font-weight: 900;
  user-select: none;
  border-color: ${colors.acento};

  &:hover {
    color: #9a3145;
    border-color: #9a3145;
  }
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${colors.modalBg};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: ${colors.panelFondo};
  border-radius: 1.5rem;
  padding: 3rem 3.5rem;
  width: 380px;
  max-width: 90vw;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeInUp} 0.4s ease forwards;
`;

const ModalAvatar = styled(Avatar)`
  width: 160px;
  height: 160px;
  margin-bottom: 2rem;
`;

const ModalUserName = styled(UserName)`
  font-size: 2rem;
  margin-bottom: 0.25rem;
`;

const ModalUserRole = styled(UserRole)`
  font-size: 1.2rem;
  margin-bottom: 1.8rem;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 0.9rem 1.2rem;
  border-radius: 0.65rem;
  border: none;
  background-color: ${colors.inputBg};
  color: ${colors.inputTexto};
  font-size: 1rem;
  margin-bottom: 2rem;
  box-shadow: inset 0 0 7px #000000bb;

  &::placeholder {
    color: ${colors.inputTexto};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 10px ${colors.acento};
    background-color: #2c2c33;
  }
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 1.1rem 0;
  background-color: ${colors.buttonBg};
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #000;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.buttonHoverBg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface User {
  id: string;
  name: string;
  avatar?: string;
  disabled?: boolean;
  role?: 'Administrador' | 'Usuario';
}

interface UserSelectionProps {
  users: User[];
  onSelect: (id: string, password: string) => void;
  onAddUser: () => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ users, onSelect, onAddUser }) => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => u.name.toLowerCase().includes(term));
  }, [search, users]);

  const openModal = (user: User) => {
    if (user.disabled) return;
    setSelectedUser(user);
    setPassword('');
    setError(null);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setPassword('');
    setError(null);
    setLoading(false);
  };

  const handleLogin = () => {
    if (!password) {
      setError('Por favor ingresa la contraseña.');
      return;
    }
    setError(null);
    setLoading(true);

    // Simula validación (aquí pones tu lógica real)
    setTimeout(() => {
      setLoading(false);
      // Ejemplo: password == '1234' para permitir login
      if (password === '1234') {
        onSelect(selectedUser!.id, password);
        closeModal();
      } else {
        setError('Contraseña incorrecta.');
      }
    }, 1200);
  };

  return (
    <Background>
      <Container>
        <Title>Selecciona tu usuario</Title>

        <SearchInput
          type="search"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar usuario"
          spellCheck={false}
          autoComplete="off"
        />

        <UsersGrid>
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              onClick={() => openModal(user)}
              title={user.disabled ? 'Usuario deshabilitado' : `Entrar como ${user.name}`}
              disabled={user.disabled}
              tabIndex={user.disabled ? -1 : 0}
              role="button"
              aria-disabled={user.disabled}
            >
              <Avatar image={user.avatar} />
              <UserName>{user.name}</UserName>
              <UserRole>{user.role || 'Usuario'}</UserRole>
            </UserCard>
          ))}

          <AddUserCard
            onClick={onAddUser}
            title="Agregar nuevo usuario"
            tabIndex={0}
            role="button"
            aria-label="Agregar nuevo usuario"
          >
            +
          </AddUserCard>
        </UsersGrid>

        {selectedUser && (
          <ModalOverlay
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <ModalContent>
              <ModalAvatar image={selectedUser.avatar} />
              <ModalUserName id="modal-title">{selectedUser.name}</ModalUserName>
              <ModalUserRole>{selectedUser.role || 'Usuario'}</ModalUserRole>
              <PasswordInput
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                aria-label="Contraseña"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
              />
              {error && (
                <p
                  style={{
                    color: colors.bordeInactivo,
                    marginBottom: '1rem',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  {error}
                </p>
              )}
              <ModalButton onClick={handleLogin} disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar sesión'}
              </ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </Background>
  );
};

export default UserSelection;
