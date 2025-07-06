import axios from 'axios';
import type { MessageModel } from '../models/messageModels';

const API_URL = 'http://127.0.0.1:5000/api/messages';

export async function sendMessage(sender_id: string, receiver_id: string, content: string) {
  try {
    const res = await axios.post(API_URL, { sender_id, receiver_id, content });
    return { success: true, message: res.data as MessageModel };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.message || 'Error al enviar mensaje' };
  }
}

export async function getConversation(user_id: string, other_user_id: string) {
  try {
    const res = await axios.get(`${API_URL}/${user_id}`, {
      params: { other_user_id },
    });
    return { success: true, messages: res.data as MessageModel[] };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.message || 'Error al obtener conversación' };
  }
}

export async function markMessageAsRead(message_id: string) {
  try {
    const res = await axios.put(`${API_URL}/${message_id}/read`);
    return { success: true, message: res.data as MessageModel };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.message || 'Error al marcar como leído' };
  }
}

export async function deleteMessage(message_id: string) {
  try {
    await axios.delete(`${API_URL}/${message_id}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.message || 'Error al eliminar mensaje' };
  }
}
