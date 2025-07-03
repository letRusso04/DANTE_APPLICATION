import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBell, FaHome, FaUsers, FaPlus, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const colors = {
    fondo: '#0D0D11',
    panel: '#1A1A1F',
    texto: '#E8E8E8',
    acento: '#6B2233',
    secundario: '#888',
    noLeidoBg: '#3a1f2b',
    leidoBg: '#1a1a1f',
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${colors.fondo};
  color: ${colors.texto};
  font-family: 'Poppins', sans-serif;
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
  color: ${({ active }) => (active ? colors.acento : colors.texto)};
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

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NotificationItem = styled.li<{ read: boolean }>`
  background-color: ${({ read }) => (read ? colors.leidoBg : colors.noLeidoBg)};
  padding: 1rem 1.2rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background-color 0.25s;

  &:hover {
    background-color: ${({ read }) => (read ? '#29292f' : '#4a2c41')};
  }
`;

const NotificationTitle = styled.h3`
  margin: 0 0 0.3rem 0;
  font-weight: 700;
  font-size: 1.1rem;
`;

const NotificationDate = styled.span`
  font-size: 0.8rem;
  color: ${colors.secundario};
  margin-bottom: 0.5rem;
  display: block;
`;

const NotificationDesc = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${colors.texto};
  opacity: 0.85;
`;

const Notificaciones: React.FC = () => {
    const navigate = useNavigate();
    const [drawerExpanded, setDrawerExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Nuevo usuario registrado',
            description: 'Juan Pérez se ha registrado como nuevo usuario.',
            date: '2025-06-25 09:45',
            read: false,
        },
        {
            id: 2,
            title: 'Inventario actualizado',
            description: 'Se agregaron 50 nuevos productos al inventario.',
            date: '2025-06-24 15:20',
            read: true,
        },
        {
            id: 3,
            title: 'Mensaje recibido',
            description: 'Ana Gómez te envió un mensaje en Mensajería.',
            date: '2025-06-23 11:05',
            read: false,
        },
    ]);

    // Filtrado básico
    const filteredNotifications = notifications.filter(
        (n) =>
            n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Marcar como leído (toggle)
    const toggleRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
        );
    };

    return (
        <Layout>
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

            <Main>
                <Header>
                    <Title>Notificaciones</Title>
                    <SearchInput
                        placeholder="Buscar notificaciones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Header>

                <NotificationList>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((n) => (
                            <NotificationItem
                                key={n.id}
                                read={n.read}
                                onClick={() => toggleRead(n.id)}
                                title={n.read ? 'Marcar como no leído' : 'Marcar como leído'}
                            >
                                <NotificationTitle>{n.title}</NotificationTitle>
                                <NotificationDate>{n.date}</NotificationDate>
                                <NotificationDesc>{n.description}</NotificationDesc>
                            </NotificationItem>
                        ))
                    ) : (
                        <p style={{ color: colors.secundario, textAlign: 'center', marginTop: '2rem' }}>
                            No se encontraron notificaciones.
                        </p>
                    )}
                </NotificationList>
            </Main>
        </Layout>
    );
};

export default Notificaciones;