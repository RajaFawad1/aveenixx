// Sales API client for Aveenix platform
import { apiRequest } from './queryClient';

const headers = { 'x-user-id': 'demo-user' };

export const SalesAPI = {
  // Orders
  createOrder: (payload: any) => apiRequest('/api/orders', { method: 'POST', body: payload }),
  listOrders: () => apiRequest('/api/orders'),
  myOrders: () => apiRequest('/api/orders/me', { headers }),
  orderDetail: (id: string) => apiRequest(`/api/orders/${id}`),
  capture: (id: string) => apiRequest(`/api/orders/${id}/capture`, { method: 'POST' }),
  ship: (id: string, carrier: string, tracking: string) => 
    apiRequest(`/api/orders/${id}/ship`, { method: 'POST', body: { carrier, tracking } }),
  complete: (id: string) => apiRequest(`/api/orders/${id}/complete`, { method: 'POST' }),
  refund: (id: string, amountCents: number) => 
    apiRequest(`/api/orders/${id}/refund`, { method: 'POST', body: { amountCents } }),
  note: (id: string, text: string) => 
    apiRequest(`/api/orders/${id}/notes`, { method: 'POST', body: { text } }),

  // Returns
  returnsList: () => apiRequest('/api/returns'),
  returnsCreate: (payload: any) => apiRequest('/api/returns', { method: 'POST', body: payload }),
  returnsApprove: (id: string) => apiRequest(`/api/returns/${id}/approve`, { method: 'POST' }),
  returnsReject: (id: string) => apiRequest(`/api/returns/${id}/reject`, { method: 'POST' }),
  returnsComplete: (id: string) => apiRequest(`/api/returns/${id}/complete`, { method: 'POST' }),

  // Sales Analytics
  metrics: () => apiRequest('/api/sales/metrics'),
  daily: () => apiRequest('/api/sales/report/daily'),
};

// Helper functions
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString();
}