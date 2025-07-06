import { create } from 'zustand';

import { useCompanyStore } from './companyStore';
import type { ClientModel } from '../models/clientModels';
import { clientServices } from '../services/clientServices';

interface ClientState {
  clients: ClientModel[];
  loading: boolean;
  error: string | null;
  logout: () => void;

  fetchClients: () => Promise<void>;
  addClient: (data: Partial<ClientModel>, avatarFile?: File) => Promise<void>;
  updateClient: (id: string, data: Partial<ClientModel>, avatar?: File) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  setClients: (clients: ClientModel[]) => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  loading: false,
  error: null,
  logout: () => set({ clients: [] }),

  fetchClients: async () => {
    const companyId = useCompanyStore.getState().company?.id_company;
    if (!companyId) return;

    set({ loading: true, error: null });
    try {
      const clients = await clientServices.getClients(companyId);
      set({ clients });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addClient: async (data, avatarFile) => {
    const companyId = useCompanyStore.getState().company?.id_company;
    if (!companyId) return;

    const newClient = await clientServices.createClient(
      { ...data, company_id: companyId },
      avatarFile
    );
    set({ clients: [newClient, ...get().clients] });
  },

updateClient: async (id, data, avatar) => {
  const updated = await clientServices.updateClient(id, data, avatar);
  const updatedList = get().clients.map(client =>
    client.id === id ? updated : client
  );
  set({ clients: updatedList });
},

  deleteClient: async (id) => {
    await clientServices.deleteClient(id);
    const filtered = get().clients.filter(client => client.id !== id);
    set({ clients: filtered });
  },

  setClients: (clients) => set({ clients }),
}));
