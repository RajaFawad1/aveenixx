import axios from 'axios';

const API_BASE = '/api';
const headers = { 'x-user-id': 'demo-user' }; // Replace with real auth

export const RewardsAPI = {
  // User rewards endpoints
  me: () => axios.get(`${API_BASE}/rewards/me`, { headers }).then(r => r.data),
  createVoucher: (amountCents: number) => 
    axios.post(`${API_BASE}/rewards/me/vouchers`, { amountCents }, { headers }).then(r => r.data),
  createRedemption: (payload: any) => 
    axios.post(`${API_BASE}/rewards/me/redemptions`, payload, { headers }).then(r => r.data),
  myRedemptions: () => 
    axios.get(`${API_BASE}/rewards/me/redemptions`, { headers }).then(r => r.data),

  // Admin endpoints
  adminSummary: () => 
    axios.get(`${API_BASE}/rewards/admin/summary`).then(r => r.data),
  adminRedemptions: () => 
    axios.get(`${API_BASE}/rewards/admin/redemptions`).then(r => r.data),
  approve: (id: number) => 
    axios.post(`${API_BASE}/rewards/admin/redemptions/${id}/approve`).then(r => r.data),
  reject: (id: number) => 
    axios.post(`${API_BASE}/rewards/admin/redemptions/${id}/reject`).then(r => r.data),
  markPaid: (id: number, providerRef: string) => 
    axios.post(`${API_BASE}/rewards/admin/redemptions/${id}/mark-paid`, { providerRef }).then(r => r.data),

  // Award sale rewards (called by system)
  awardSaleReward: (payload: {
    userId: string;
    sourceType: 'affiliate' | 'dropship';
    sourceId: string;
    amountCents: number;
    points?: number;
  }) => axios.post(`${API_BASE}/rewards/award-sale-reward`, payload).then(r => r.data),
};

// Helper function for currency formatting
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}