import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaComments,
  FaUsers,
  FaLayerGroup,
  FaLifeRing,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

const TicketListPanel = styled.div`
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

const TicketList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
`;

const TicketListItem = styled.li<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

const TicketTitle = styled.span`
  font-weight: 700;
  font-size: 1.05rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TicketDateStatus = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${colors.secundario};
  user-select: none;
`;

const TicketStatus = styled.div<{ status: 'open' | 'closed' | 'pending' }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: ${({ status }) =>
    status === 'open' ? '#4caf50' : status === 'pending' ? '#ff9800' : '#f44336'};
  
  svg {
    font-size: 1rem;
  }
`;

const TicketChatPanel = styled.div`
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

const FormPanel = styled.div`
  flex: 1;
  padding: 3rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${colors.chatPlaceholderBg};
  border-radius: 12px;
  margin: 2rem;
  box-shadow: 0 0 15px ${colors.acento2};
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: ${colors.texto};
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  background: #22222b;
  color: ${colors.texto};
  outline: none;
  box-shadow: inset 1px 1px 4px #000000aa;

  &:focus {
    box-shadow: 0 0 8px ${colors.acento2};
    background: #1b1b23;
  }
`;

const Textarea = styled.textarea`
  padding: 1rem;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  background: #22222b;
  color: ${colors.texto};
  outline: none;
  box-shadow: inset 1px 1px 4px #000000aa;
  resize: vertical;

  &:focus {
    box-shadow: 0 0 8px ${colors.acento2};
    background: #1b1b23;
  }
`;

const SubmitBtn = styled.button`
  background-color: ${colors.acento};
  color: #fff;
  font-weight: 700;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: auto;
  align-self: flex-start;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.vinotinto};
  }
`;

const tickets = [
  {
    id: 1,
    title: 'No puedo iniciar sesión',
    date: '2025-06-20',
    status: 'open' as const,
  },
  {
    id: 2,
    title: 'Error en la facturación',
    date: '2025-06-18',
    status: 'pending' as const,
  },
  {
    id: 3,
    title: 'Solicitud de actualización',
    date: '2025-06-16',
    status: 'closed' as const,
  },
  {
    id: 4,
    title: 'Problema con la sincronización',
    date: '2025-06-15',
    status: 'open' as const,
  },
  {
    id: 5,
    title: 'Consulta general',
    date: '2025-06-14',
    status: 'pending' as const,
  },
];

const Support: React.FC = () => {
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');

  // Esta variable simula si es admin o usuario (más adelante puedes conectarla con tu autenticación)
  const isAdmin = true; // Cambia a true para ver vista admin

  // Filtrar tickets por búsqueda
  const filteredTickets = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.date.includes(searchTerm)
  );

  const getStatusIcon = (status: 'open' | 'closed' | 'pending') => {
    switch (status) {
      case 'open':
        return <FaCheckCircle />;
      case 'closed':
        return <FaTimesCircle />;
      case 'pending':
        return <FaClock />;
      default:
        return null;
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    alert(`Ticket enviado:\nTítulo: ${newTicketTitle}\nDescripción: ${newTicketDescription}`);
    setNewTicketTitle('');
    setNewTicketDescription('');
  };
  const navigate = useNavigate();
  return (
    <Layout>
   <Drawer
        expanded={drawerExpanded}
        onMouseEnter={() => setDrawerExpanded(true)}
        onMouseLeave={() => setDrawerExpanded(false)}
      >
        <DrawerItem
          active={false}
          title="Dashboard Principal"
          onClick={() => navigate('/dashboard')}
        >
          <FaUsers />
          {drawerExpanded && 'Dashboard'}
        </DrawerItem>
        <DrawerItem
          active={false}
          title="Mensajería"
          onClick={() => navigate('/chat-interno')}
        >
          <FaComments />
          {drawerExpanded && 'Mensajería'}
        </DrawerItem>

        <DrawerItem
          active
          title="Soporte"
          onClick={() => navigate('/chat-soporte')}
        >
          <FaLifeRing />
          {drawerExpanded && 'Soporte'}
        </DrawerItem>
      </Drawer>

      <Main>
        {isAdmin ? (
          <>
            <TicketListPanel>
              <SearchBox>
                <input
                  placeholder="Buscar ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch />
              </SearchBox>

              <TicketList>
                {filteredTickets.length === 0 && (
                  <p style={{ color: colors.secundario, paddingLeft: '10px' }}>
                    No se encontraron tickets
                  </p>
                )}
                {filteredTickets.map((ticket, i) => (
                  <TicketListItem
                    key={ticket.id}
                    selected={selectedTicketIndex === i}
                    onClick={() => setSelectedTicketIndex(i)}
                    title={`${ticket.title} - ${ticket.date}`}
                  >
                    <TicketTitle>{ticket.title}</TicketTitle>
                    <TicketDateStatus>
                      <span>{ticket.date}</span>
                      <TicketStatus status={ticket.status}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </TicketStatus>
                    </TicketDateStatus>
                  </TicketListItem>
                ))}
              </TicketList>
            </TicketListPanel>

            <TicketChatPanel>
              <FaLifeRing />
              <div>Selecciona un ticket para ver los detalles y responder</div>
            </TicketChatPanel>
          </>
        ) : (
          <FormPanel as="form" onSubmit={handleTicketSubmit}>
            <Label htmlFor="title">Título del ticket</Label>
            <Input
              id="title"
              type="text"
              value={newTicketTitle}
              onChange={(e) => setNewTicketTitle(e.target.value)}
              placeholder="Escribe el asunto del problema"
              maxLength={100}
            />

            <Label htmlFor="description">Descripción detallada</Label>
            <Textarea
              id="description"
              rows={6}
              value={newTicketDescription}
              onChange={(e) => setNewTicketDescription(e.target.value)}
              placeholder="Describe el problema o la solicitud con la mayor precisión posible"
              maxLength={1000}
            />

            <SubmitBtn type="submit">Enviar ticket</SubmitBtn>
          </FormPanel>
        )}
      </Main>
    </Layout>
  );
};

export default Support;
