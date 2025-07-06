import React, { useState, useMemo, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getUsers, loginUser, createUser } from '../../services/userServices';
import { useNavigate } from 'react-router-dom';
import { useCompanyStore } from '../../stores/companyStore';
import { useUserStore } from '../../stores/userStore';
import type { UserModel } from '../../models/userModels';
import { API_AVATAR } from '../../services/routes/routesAPI';

const phonePrefixes = [
  { code: '+1', country: 'USA/Canada' },
  { code: '+52', country: 'México' },
  { code: '+57', country: 'Colombia' },
  { code: '+58', country: 'Venezuela' },
  { code: '+54', country: 'Argentina' },
  { code: '+55', country: 'Brasil' },
  { code: '+507', country: 'Panamá' },
  { code: '+56', country: 'Chile' },
];

const UserSelection: React.FC = () => {
  const navigate = useNavigate();
  const { company, token: companyToken, logout: logoutCompany } = useCompanyStore();
  const { setUser, clearUser, user } = useUserStore();

  // Cambiar tipo a UserModel[]
  const [users, setUsers] = useState<UserModel[]>([]);
  const [search, setSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // selectedUser como UserModel | null
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Estados para crear usuario modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhonePrefix, setNewPhonePrefix] = useState(phonePrefixes[0].code);
  const [newPhone, setNewPhone] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (!company || !companyToken) {
      navigate('/');
    }
  }, [company, companyToken, navigate]);

  useEffect(() => {
    if (!company) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      setUsersError(null);
      try {
        const res = await getUsers();
        if (res.success) {
          // Si res.users puede ser undefined, protegemos
          setUsers(res.users ?? []);
        } else {
          setUsersError(res.error || 'Error cargando usuarios');
          setUsers([]);
        }
      } catch {
        setUsersError('Error inesperado cargando usuarios');
        setUsers([]);
      }
      setLoadingUsers(false);
    };

    fetchUsers();
  }, [company]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u => u.name.toLowerCase().includes(term));
  }, [search, users]);

  const openLoginModal = (user: UserModel) => {
    if (user.is_active === false) return; // usar is_active para deshabilitar
    setSelectedUser(user);
    setPassword('');
    setLoginError('');
  };

  const closeLoginModal = () => {
    setSelectedUser(null);
    setPassword('');
    setLoginError('');
    setLoadingLogin(false);
  };

  const handleLogin = async () => {
    if (!password) {
      setLoginError('Por favor ingresa la contraseña.');
      return;
    }
    if (!selectedUser) {
      setLoginError('No hay usuario seleccionado.');
      return;
    }
    setLoginError('');
    setLoadingLogin(true);

    try {
      const res = await loginUser(selectedUser.email, password);
      if (res.success) {
        setUser(selectedUser);
        closeLoginModal();
        navigate('/dashboard');
      } else {
        setLoginError(res.error || 'Credenciales inválidas.');
      }
    } catch {
      setLoginError('Error inesperado al iniciar sesión.');
    } finally {
      setLoadingLogin(false);
    }
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      setNewAvatarPreview(URL.createObjectURL(file));
    }
  };

  const resetCreateForm = () => {
    setNewAvatarFile(null);
    setNewAvatarPreview(null);
    setNewName('');
    setNewEmail('');
    setNewPhonePrefix(phonePrefixes[0].code);
    setNewPhone('');
    setNewJobTitle('');
    setNewPassword('');
    setNewGender('');
    setNewBirthDate('');
    setCreateError(null);
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleCreateUser = async () => {
    if (!newName.trim()) {
      setCreateError('El nombre es obligatorio');
      return;
    }
    if (!isValidEmail(newEmail)) {
      setCreateError('Correo inválido');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setCreateError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    if (!newGender) {
      setCreateError('Selecciona un sexo');
      return;
    }
    if (!newBirthDate) {
      setCreateError('Selecciona fecha de nacimiento');
      return;
    }

    setCreateError(null);
    setCreatingUser(true);

    try {
      const res = await createUser({
        company_id: company!.id_company,
        avatarFile: newAvatarFile,
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhonePrefix + newPhone.trim(),
        job_title: newJobTitle.trim(),
        password: newPassword,
        gender: newGender,
        birth_date: newBirthDate,
      });

      if (res.success) {
        setUsers(prev => [...prev, res.user]);
        setShowAddModal(false);
        resetCreateForm();
      } else {
        setCreateError(res.error || 'Error al crear usuario');
      }
    } catch {
      setCreateError('Error inesperado al crear usuario');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleLogout = () => {
    clearUser();
    logoutCompany();
    navigate('/');
  };


  return (
    <div style={{ background: '#000', color: '#eee', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6B2233' }}>Selecciona tu usuario</h1>
        <button
          onClick={handleLogout}
          style={{
            background: '#6B2233',
            color: '#000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Desconectar
        </button>
      </header>

      <input
        type="search"
        placeholder="Buscar usuario..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Buscar usuario"
        spellCheck={false}
        autoComplete="off"
        style={{
          width: '100%',
          maxWidth: 520,
          padding: '1rem',
          fontSize: '1.1rem',
          borderRadius: 8,
          border: 'none',
          backgroundColor: '#24242a',
          color: '#ccc',
          marginBottom: '2rem',
        }}
      />

      {loadingUsers && <p>Cargando usuarios...</p>}
      {usersError && <p style={{ color: 'red' }}>{usersError}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingRight: 10,
        }}
      >
        {filteredUsers.map(user => (
          <div
            key={user.id_user}
            onClick={() => openLoginModal(user)}
            role="button"
            
            tabIndex={user.is_active === false ? -1 : 0}
            aria-disabled={user.is_active === false}
            title={user.is_active === false ? 'Usuario deshabilitado' : `Entrar como ${user.name}`}
            style={{
              background: '#1F1F23',
              borderRadius: 24,
              padding: '2rem',
        
              textAlign: 'center',
              cursor: user.is_active === false ? 'not-allowed' : 'pointer',
              border: `4px double ${user.is_active === false ? 'rgba(230, 57, 70, 0.6)' : 'rgba(38, 166, 91, 0.6)'}`,
              userSelect: 'none',
              transition: 'transform 0.3s ease',
            }}
          >
            <div
              style={{
                width: 130,
                height: 130,
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                backgroundColor: '#4a4a57',
                backgroundImage: user.avatar_url ? `url(${API_AVATAR}${user.avatar_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <p
              style={{
                fontWeight: 700,
                fontSize: '1.4rem',
                marginBottom: 4,
                color: '#eee',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.name}
            </p>
            <p style={{ fontWeight: 500, fontSize: '1rem', color: '#a0a0a0', userSelect: 'none' }}>
              {user.role || 'Usuario'}
            </p>
          </div>
        ))}

        {users.length === 0 && (
          <div
            onClick={() => setShowAddModal(true)}
            role="button"
            tabIndex={0}
            aria-label="Agregar nuevo usuario"
            title="Agregar nuevo usuario"
            style={{
              background: '#1F1F23',
              width: '180px',
              borderRadius: 24,
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              border: '4px double #6B2233',
              color: '#6B2233',
              fontSize: '4rem',
              fontWeight: 900,
              userSelect: 'none',
            }}
          >
            +
          </div>
        )}
      </div>

      {/* Modal login */}
      {selectedUser && (
        <div
          onClick={e => {
            if (e.target === e.currentTarget) closeLoginModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            zIndex: 9999,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a24, #2e2e3a)',
              borderRadius: 24,
              padding: '2rem 3rem',
              maxWidth: 480,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              color: '#eee',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                backgroundColor: '#4a4a57',
                backgroundImage: selectedUser.avatar_url ? `url(${API_AVATAR}${selectedUser.avatar_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '1.5rem',
              }}
            />
            <h2 id="modal-title" style={{ marginBottom: 8, color: '#6B2233' }}>
              {selectedUser.name}
            </h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#a0a0a0' }}>
              {selectedUser.role || 'Usuario'}
            </p>
            <input
              type="password"
              placeholder="Contraseña"
              aria-label="Contraseña"
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                padding: '1rem',
                borderRadius: 10,
                border: 'none',
                backgroundColor: '#24242a',
                color: '#ccc',
                marginBottom: 16,
                width: '100%',
                fontSize: '1rem',
              }}
            />
            {loginError && (
              <p
                style={{
                  color: 'rgba(230, 57, 70, 0.8)',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {loginError}
              </p>
            )}
            <button
              onClick={handleLogin}
              disabled={loadingLogin}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#6B2233',
                border: 'none',
                borderRadius: 12,
                fontWeight: '700',
                fontSize: '1.1rem',
                cursor: loadingLogin ? 'not-allowed' : 'pointer',
                color: '#000',
              }}
            >
              {loadingLogin ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </div>
        </div>
      )}

      {/* Modal crear usuario */}
      {showAddModal && (
        <div
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
              resetCreateForm();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-user-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            zIndex: 9999,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a24, #2e2e3a)',
              borderRadius: 24,
              padding: '2rem 3rem',
              maxWidth: '50vw',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              color: '#eee',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2
              id="add-user-modal-title"
              style={{ marginBottom: '1.5rem', color: '#6B2233', textAlign: 'center' }}
            >
              Agregar nuevo usuario
            </h2>

            <label
              htmlFor="avatarFile"
              style={{ marginBottom: '1rem', cursor: 'pointer', display: 'block', textAlign: 'center' }}
              title="Seleccionar avatar"
            >
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  backgroundColor: '#4a4a57',
                  backgroundImage: newAvatarPreview ? `url(${newAvatarPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  margin: '0 auto 0.5rem',
                }}
              />
              <input
                id="avatarFile"
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                style={{ display: 'none' }}
                aria-label="Seleccionar avatar"
              />
              <small style={{ color: '#a0a0a0' }}>Haz clic en el avatar para seleccionar imagen</small>
            </label>

            <label>
              Nombre completo
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Ejemplo: Juan Pérez"
                autoComplete="name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#24242a',
                  color: '#ccc',
                }}
              />
            </label>

            <label>
              Correo electrónico
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#24242a',
                  color: '#ccc',
                }}
              />
            </label>

            <label>
              Prefijo telefónico
              <select
                value={newPhonePrefix}
                onChange={e => setNewPhonePrefix(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#24242a',
                  color: '#ccc',
                  fontSize: '1rem',
                }}
              >
                {phonePrefixes.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.code} ({p.country})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Teléfono
              <input
                type="tel"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="1234567890"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#24242a',
                  color: '#ccc',
                }}
              />
            </label>

            <label>
              Cargo
              <input
                type="text"
                value={newJobTitle}
                onChange={e => setNewJobTitle(e.target.value)}
                placeholder="Ejemplo: Soporte Técnico"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#24242a',
                  color: '#ccc',
                }}
              />
            </label>

            <label>
              Sexo
              <select
                value={newGender}
                onChange={e => setNewGender(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#24242a',
                  color: '#ccc',
                  fontSize: '1rem',
                }}
              >
                <option value="">Seleccione...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </label>

            <label>
              Fecha de nacimiento
              <input
                type="date"
                value={newBirthDate}
                onChange={e => setNewBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#24242a',
                  color: '#ccc',
                }}
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Al menos 6 caracteres"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#24242a',
                  color: '#ccc',
                }}
              />
            </label>

            {createError && (
              <p style={{ color: 'rgba(230, 57, 70, 0.8)', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>
                {createError}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetCreateForm();
                }}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#444',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  color: '#ccc',
                }}
                disabled={creatingUser}
              >
                Cancelar
              </button>

              <button
                onClick={handleCreateUser}
                disabled={creatingUser}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#6B2233',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  cursor: creatingUser ? 'not-allowed' : 'pointer',
                  color: '#000',
                }}
              >
                {creatingUser ? 'Creando...' : 'Crear usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelection;