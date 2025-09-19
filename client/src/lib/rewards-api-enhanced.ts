import axios from 'axios';

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
const headers = { 'x-user-id': 'demo-user' }; // replace with real auth

export const EnhancedRewardsAPI = {
  // Customer endpoints
  me: () => axios.get(`${API_BASE_URL}/rewards/me`, { headers }).then(r => r.data),
  createVoucher: (amountCents: number) => 
    axios.post(`${API_BASE_URL}/rewards/me/vouchers`, { amountCents }, { headers }).then(r => r.data),
  createRedemption: (payload: any) => 
    axios.post(`${API_BASE_URL}/rewards/me/redemptions`, payload, { headers }).then(r => r.data),
  myRedemptions: () => 
    axios.get(`${API_BASE_URL}/rewards/me/redemptions`, { headers }).then(r => r.data),

  // Admin endpoints
  adminSummary: () => 
    axios.get(`${API_BASE_URL}/admin/rewards/summary`).then(r => r.data),
  adminRedemptions: () => 
    axios.get(`${API_BASE_URL}/admin/redemptions`).then(r => r.data),
  approve: (id: number) => 
    axios.post(`${API_BASE_URL}/admin/redemptions/${id}/approve`).then(r => r.data),
  reject: (id: number) => 
    axios.post(`${API_BASE_URL}/admin/redemptions/${id}/reject`).then(r => r.data),
  markPaid: (id: number, providerRef: string) => 
    axios.post(`${API_BASE_URL}/admin/redemptions/${id}/mark-paid`, { providerRef }).then(r => r.data),

  // Events endpoint for tracking rewards
  submitEvent: (payload: any) => 
    axios.post(`${API_BASE_URL}/events`, payload).then(r => r.data),

  // Export functionality
  exportRewards: () => 
    axios.get(`${API_BASE_URL}/admin/rewards/export.csv`).then(r => r.data),
};

export function formatCentsEnhanced(n: number): string {
  return `$${(n / 100).toFixed(2)}`;
}

export type ProductType = 
  | "affiliate"
  | "dropship" 
  | "physical"
  | "consumable"
  | "service"
  | "digital"
  | "custom"
  | "multivendor";

export interface RewardCalculation {
  productType: ProductType;
  marginCents?: number;
  salePriceCents?: number;
  costCents?: number;
  paymentFeeCents?: number;
  shippingSubsidyCents?: number;
  commissionCents?: number;
  promoMultiplier?: number;
}

export interface RewardOutput {
  netMarginCents: number;
  customerRewardCents: number;
  applied: {
    tierPercent: number;
    minApplied: boolean;
    maxApplied: boolean;
    promoMultiplier: number;
    operatingBufferCents: number;
  };
}