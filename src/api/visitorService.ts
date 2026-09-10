import { apiClient } from './client';
import type { NewVisitor, Visitor } from '../types';

export const visitorService = {
  getAll: async (): Promise<Visitor[]> => {
    const { data } = await apiClient.get<Visitor[]>('/visitors');
    return data;
  },
  getById: async (id: string): Promise<Visitor> => {
    const { data } = await apiClient.get<Visitor>(`/visitors/${id}`);
    return data;
  },
  create: async (visitor: NewVisitor): Promise<Visitor> => {
    const { data } = await apiClient.post<Visitor>('/visitors', visitor);
    return data;
  },
  update: async (id: string, visitor: Partial<NewVisitor>): Promise<Visitor> => {
    const { data } = await apiClient.put<Visitor>(`/visitors/${id}`, visitor);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/visitors/${id}`);
  },
  approve: async (id: string): Promise<Visitor> => {
    const { data } = await apiClient.patch<Visitor>(`/visitors/${id}/approve`);
    return data;
  },
  reject: async (id: string): Promise<Visitor> => {
    const { data } = await apiClient.patch<Visitor>(`/visitors/${id}/reject`);
    return data;
  },
};
