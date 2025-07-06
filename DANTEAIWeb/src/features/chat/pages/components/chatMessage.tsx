// Este es un ejemplo funcional del componente de chat con carga y envío de mensajes
// Suponiendo que usas Zustand para la sesión y tienes una API similar a la que mostraste

import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useUserStore } from '../../../../stores/userStore';
import type { MessageModel } from '../../../../models/messageModels';
import type { UserModel } from '../../../../models/userModels';
import { getConversation, sendMessage } from '../../../../services/messageServices';
import { getUsers } from '../../../../services/userServices';


const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;
`;

const ChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #1a1a1f;
  border-radius: 12px;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  align-self: ${({ isOwn }) => (isOwn ? 'flex-end' : 'flex-start')};
  background-color: ${({ isOwn }) => (isOwn ? '#4B0082' : '#6B2233')};
  padding: 0.75rem 1rem;
  border-radius: 16px;
  max-width: 70%;
  color: #fff;
`;

const InputRow = styled.form`
  display: flex;
  gap: 1rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 12px;
  border: none;
  background: #22222b;
  color: #fff;
  outline: none;
`;

const SendButton = styled.button`
  background: #6A0DAD;
  color: white;
  padding: 0 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #8B1E3F;
  }
`;
interface ChatMessagesProps {
  receiverId: string;
  // otras props si tienes
}
const ChatMessages: React.FC<ChatMessagesProps> = ({ receiverId }) => {
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [receiver, setReceiver] = useState<UserModel | null>(null);
  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (receiverId && user) {
      getConversation(user.id_user, receiverId).then((res) => {
        if (res.success && res.messages) setMessages(res.messages);
      });

      getUsers().then((res) => {
        if (res.success && res.users) {
          const r = res.users.find((u) => u.id_user === receiverId);
          setReceiver(r || null);
        }
      });
    }
  }, [receiverId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !receiver || !user) return;

    const res = await sendMessage(
      user.id_user,
      receiver.id_user,
      message.trim(),
    );

    if (res.success && res.message) {
      setMessages([...messages, res.message]);
      setMessage('');
    }
  };

  if (!receiver) {
    return <div style={{ color: '#888', padding: '2rem' }}>Selecciona un usuario para comenzar a chatear.</div>;
  }

  return (
    <Container>
      <h2>Conversación con {receiver.name}</h2>
      <ChatBox ref={chatRef}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} isOwn={msg.sender_id === user?.id_user}>
            {msg.content}
          </MessageBubble>
        ))}
      </ChatBox>
      <InputRow onSubmit={handleSend}>
        <MessageInput
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SendButton type="submit">Enviar</SendButton>
      </InputRow>
    </Container>
  );
};

export default ChatMessages;
