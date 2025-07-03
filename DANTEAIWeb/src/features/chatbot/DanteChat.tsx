import React from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaRobot, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  inputBg: '#2A1E3D',
  accentPurple: '#6A0DAD',
  vinotinto: '#8B1E3F',
  border: '#3a2a4d',
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${colors.fondo};
  color: ${colors.texto};
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
`;

const Drawer = styled.aside`
  width: 320px;
  background-color: ${colors.panel};
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 1rem;
  border-right: 1px solid ${colors.border};
  box-sizing: border-box;
  height: 100vh;
  user-select: none;

  @media (max-width: 768px) {
    width: 100%;
    height: 130px;
    padding: 0.8rem 1rem;
    border-right: none;
    border-bottom: 1px solid ${colors.border};
    flex-direction: row;
    align-items: center;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: transparent;
  border: none;
  color: ${colors.accentPurple};
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0;
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.vinotinto};
  }

  svg {
    font-size: 1.3rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
    margin-right: 1rem;
  }
`;

const ChatsList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 1rem;
  scrollbar-width: thin;
  scrollbar-color: ${colors.accentPurple} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.accentPurple};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 768px) {
    margin-top: 0;
    margin-left: 0;
    overflow-x: auto;
    display: flex;
    gap: 1rem;
  }
`;

const ChatItem = styled.div<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? colors.accentPurple : '#2a1e3d')};
  color: ${({ active }) => (active ? '#fff' : colors.texto)};
  padding: 0.8rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  box-shadow: ${({ active }) =>
    active ? `0 0 10px ${colors.accentPurple}` : 'none'};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${colors.vinotinto};
    color: #fff;
    box-shadow: 0 0 10px ${colors.vinotinto};
  }

  @media (max-width: 768px) {
    flex: none;
    margin-bottom: 0;
  }
`;

const InputForm = styled.form`
  display: flex;
  padding-top: 1rem;
  border-top: 1px solid ${colors.border};
  gap: 0.8rem;
  background: ${colors.panel};
`;

const TextInput = styled.textarea`
  flex: 1;
  resize: none;
  height: 44px;
  max-height: 44px;
  line-height: 1.2;
  border-radius: 22px;
  border: none;
  background-color: ${colors.inputBg};
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  color: ${colors.texto};
  font-family: 'Poppins', sans-serif;
  box-shadow: inset 0 0 8px #3a1a5a;
  transition: box-shadow 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 12px ${colors.accentPurple};
  }
`;

const SendButton = styled.button`
  background-color: ${colors.accentPurple};
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 0 10px ${colors.accentPurple};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.vinotinto};
  }
`;

const ChatArea = styled.section`
  flex: 1;
  background-color: ${colors.panel};
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ChatHeader = styled.div`
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: ${colors.accentPurple};
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  scrollbar-width: thin;
  scrollbar-color: ${colors.accentPurple} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.accentPurple};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Message = styled.div<{ fromUser?: boolean }>`
  background-color: ${({ fromUser }) => (fromUser ? colors.accentPurple : '#3a1a5a')};
  color: white;
  max-width: 70%;
  padding: 0.8rem 1rem;
  border-radius: 14px;
  margin-bottom: 0.8rem;
  align-self: ${({ fromUser }) => (fromUser ? 'flex-end' : 'flex-start')};
  box-shadow: 0 0 8px rgba(0,0,0,0.3);
  word-wrap: break-word;
`;

const DanteChat = () => {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [messages, setMessages] = React.useState([
    { id: 1, fromUser: false, text: 'Hola, ¿en qué puedo ayudarte hoy?' },
  ]);
  const [inputText, setInputText] = React.useState('');
  const [selectedChat, setSelectedChat] = React.useState(1);

  const chats = [
    { id: 1, name: 'Proyecto' },
    { id: 2, name: 'Ideas' },
    { id: 3, name: 'Consultas' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now(), fromUser: true, text: inputText.trim() }]);
    setInputText('');
    // Aquí iría la llamada a la API para respuesta de Dante AI
  };

  return (
    <Container>
      <Drawer>
        <BackButton onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Dashboard
        </BackButton>
        <ChatsList>
          {chats.map(chat => (
            <ChatItem
              key={chat.id}
              active={chat.id === selectedChat}
              onClick={() => setSelectedChat(chat.id)}
            >
              <FaComments /> {chat.name}
            </ChatItem>
          ))}
        </ChatsList>
    
      </Drawer>

      <ChatArea>
        <ChatHeader>
          <FaRobot />
          {chats.find(c => c.id === selectedChat)?.name || 'Chat'}
        </ChatHeader>
        <ChatMessages>
          {messages.map(msg => (
            <Message key={msg.id} fromUser={msg.fromUser}>
              {msg.text}
            </Message>
          ))}
        </ChatMessages>
            <InputForm onSubmit={handleSend}>
          <TextInput
            rows={1}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <SendButton type="submit">
            <FaRobot />
          </SendButton>
        </InputForm>
      </ChatArea>

    </Container>
  );
};

export default DanteChat;
