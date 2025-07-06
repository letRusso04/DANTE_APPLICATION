import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaComments,
  FaUsers,
  FaLayerGroup,
  FaLifeRing,
  FaChevronRight,
  FaChevronLeft,
  FaSearch,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import type { UserModel } from '../../../models/userModels';
import { getUsers } from '../../../services/userServices';
import { API_AVATAR } from '../../../services/routes/routesAPI';
import { useSearchParams } from 'react-router-dom';
import ChatMessages from './components/chatMessage';


const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  secundario: '#888',
  acento: '#6B2233',
  acento2: '#4B0082',
  sidebar: '#111117',
  header: '#1F1F23',
  morado: '#6A0DAD',
  vinotinto: '#8B1E3F',
  hoverBg: 'rgba(107, 34, 51, 0.15)',
  chatPlaceholderBg: 'rgba(107, 34, 51, 0.1)',
};

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: ${colors.fondo};
  color: ${colors.texto};
  overflow: hidden;
`;

const Drawer = styled.nav<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '230px' : '60px')};
  background-color: ${colors.sidebar};
  display: flex;
  flex-direction: column;
  padding: 1.8rem 0.6rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.7);
  transition: width 0.3s ease;
  position: relative;
  z-index: 10;
`;

const DrawerItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  color: ${({ active }) => (active ? colors.acento : colors.texto)};
  background: ${({ active }) => (active ? colors.panel : 'transparent')};
  transition: background 0.3s, color 0.3s;
  user-select: none;
  white-space: nowrap;
  font-weight: 600;
  font-size: 1rem;

  &:hover {
    background: ${colors.acento2};
    color: #fff;
  }

  svg {
    font-size: 1.4rem;
    flex-shrink: 0;
  }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  background: ${colors.panel};
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
`;

const ChatListPanel = styled.div`
  width: 320px;
  border-right: 2px solid ${colors.acento2};
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 1rem 1.4rem;
  background-color: ${colors.panel};
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 1rem;

  input {
    padding: 10px 38px 10px 12px;
    border-radius: 12px;
    border: none;
    font-size: 1rem;
    background: #22222b;
    color: ${colors.texto};
    outline: none;
    box-shadow: inset 1px 1px 4px #000000aa;
    transition: box-shadow 0.3s ease;

    &:focus {
      box-shadow: 0 0 8px ${colors.acento2};
      background: #1b1b23;
    }
  }

  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${colors.secundario};
    font-size: 1.2rem;
    pointer-events: none;
  }
`;

const UserList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
`;

const UserListItem = styled.li<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? colors.acento2 : 'transparent')};
  color: ${({ selected }) => (selected ? '#fff' : colors.texto)};
  transition: background-color 0.3s, color 0.3s;
  user-select: none;

  &:hover {
    background-color: ${colors.hoverBg};
  }
`;

const UserAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 0 10px ${colors.acento2};
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const UserName = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.span`
  font-size: 0.85rem;
  color: ${colors.secundario};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  color: ${colors.secundario};
  font-size: 1.2rem;
  font-weight: 600;
  user-select: none;
  background: ${colors.chatPlaceholderBg};
  border-radius: 12px;
  margin: 2rem;
  box-shadow: 0 0 15px ${colors.acento2};
  animation: ${fadeInUp} 0.5s ease forwards;
  text-align: center;

  svg {
    font-size: 4rem;
    color: ${colors.acento2};
    opacity: 0.6;
  }
`;

const Messaging: React.FC = () => {
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get('user');
  return (
    <Layout>
      <Drawer
        expanded={drawerExpanded}
        onMouseEnter={() => setDrawerExpanded(true)}
        onMouseLeave={() => setDrawerExpanded(false)}
      >
        <DrawerItem active={false} title="Dashboard Principal" onClick={() => navigate('/dashboard')}>
          <FaUsers />
          {drawerExpanded && 'Dashboard'}
        </DrawerItem>
        <DrawerItem active title="Mensajería" onClick={() => navigate('/chat-interno')}>
          <FaComments />
          {drawerExpanded && 'Mensajería'}
        </DrawerItem>
        <DrawerItem active={false} title="Soporte" onClick={() => navigate('/chat-soporte')}>
          <FaLifeRing />
          {drawerExpanded && 'Soporte'}
        </DrawerItem>
      </Drawer>

      <Main>
        <ChatListPanel>
          <SearchBox>
            <input
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <FaSearch />
          </SearchBox>

          <UserList>
            {filteredUsers.length === 0 && (
              <p style={{ color: colors.secundario, paddingLeft: '10px' }}>No se encontraron usuarios</p>
            )}
            {filteredUsers.map((user, i) => (
              <UserListItem
                key={user.id_user}
                selected={selectedUserIndex === i}
                onClick={() => {
                  setSelectedUserIndex(i);
                  navigate(`/chat-interno?user=${user.id_user}`);
                }}
                title={`${user.name} (${user.email})`}
              >
                <UserAvatar
                  src={
                    user.avatar_url
                      ? `${API_AVATAR}${user.avatar_url}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
                  }
                  alt={user.name}
                />
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
              </UserListItem>
            ))}
          </UserList>
        </ChatListPanel>

        {receiverId ? (
          <ChatMessages receiverId={receiverId} />
        ) : (
          <ChatPanel>
            <FaComments />
            <div>Selecciona un chat para comenzar a conversar</div>
          </ChatPanel>
        )}
      </Main>
    </Layout>
  );
};

export default Messaging;
