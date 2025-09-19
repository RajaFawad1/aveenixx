// Customer Support & Ticketing System Library
// This file handles all customer support and ticketing functionality

export interface TicketData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  category: string;
  customer: {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
  };
  assignedTo?: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  resolvedAt?: string;
  tags: string[];
  attachments?: TicketAttachment[];
  messages: TicketMessage[];
  tenant?: string; // For multi-tenant SaaS
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: string;
  isInternal: boolean;
  attachments?: TicketAttachment[];
}

export interface TicketAttachment {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'supervisor' | 'admin';
  status: 'online' | 'offline' | 'away';
  assignedTickets: number;
  resolvedToday: number;
  department: string;
  skills: string[];
  lastActive: string;
  tenant?: string;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  pendingTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  urgentTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  firstCallResolution: number;
  slaCompliance: number;
  activeAgents: number;
  totalAgents: number;
  backlogCount: number;
}

export interface SLAConfig {
  urgent: number; // hours
  high: number;
  medium: number;
  low: number;
  businessHours: {
    start: string;
    end: string;
    timezone: string;
    workingDays: number[];
  };
}

export interface TicketEscalation {
  id: string;
  ticketId: string;
  escalatedBy: string;
  escalatedTo: string;
  escalatedAt: string;
  reason: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface CustomerFeedback {
  id: string;
  ticketId: string;
  customerId: string;
  rating: number; // 1-5 scale
  feedback: string;
  feedbackDate: string;
  category: 'resolution' | 'response_time' | 'agent_helpfulness' | 'overall';
}

export interface SupportConfiguration {
  allowCustomerAttachments: boolean;
  maxAttachmentSize: number; // in MB
  allowedAttachmentTypes: string[];
  autoAssignmentRules: AutoAssignmentRule[];
  emailNotifications: boolean;
  smsNotifications: boolean;
  businessHours: BusinessHours;
  slaConfig: SLAConfig;
  escalationRules: EscalationRule[];
  customFields: CustomField[];
  canned_responses: CannedResponse[];
  tenant?: string;
}

export interface AutoAssignmentRule {
  id: string;
  name: string;
  conditions: AssignmentCondition[];
  assignToAgent?: string;
  assignToTeam?: string;
  priority: number;
  active: boolean;
}

export interface AssignmentCondition {
  field: string;
  operator: 'equals' | 'contains' | 'not_equals' | 'greater_than' | 'less_than';
  value: string;
}

export interface BusinessHours {
  timezone: string;
  monday: { start: string; end: string; active: boolean };
  tuesday: { start: string; end: string; active: boolean };
  wednesday: { start: string; end: string; active: boolean };
  thursday: { start: string; end: string; active: boolean };
  friday: { start: string; end: string; active: boolean };
  saturday: { start: string; end: string; active: boolean };
  sunday: { start: string; end: string; active: boolean };
}

export interface EscalationRule {
  id: string;
  name: string;
  conditions: EscalationCondition[];
  escalateTo: string;
  escalateAfter: number; // minutes
  active: boolean;
}

export interface EscalationCondition {
  field: string;
  operator: string;
  value: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'number';
  options?: string[];
  required: boolean;
  visibleToCustomer: boolean;
  position: number;
}

export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  useCount: number;
  tenant?: string;
}

export interface TicketTemplate {
  id: string;
  name: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  tags: string[];
  assignToAgent?: string;
  estimatedTime: number; // in minutes
  tenant?: string;
}

// API Functions for Ticket Management
export class TicketingService {
  private apiBase = '/api/support';

  // Ticket Operations
  async createTicket(ticketData: Partial<TicketData>): Promise<TicketData> {
    const response = await fetch(`${this.apiBase}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }

    return response.json();
  }

  async getTickets(filters?: TicketFilters): Promise<TicketData[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.apiBase}/tickets?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  }

  async getTicket(ticketId: string): Promise<TicketData> {
    const response = await fetch(`${this.apiBase}/tickets/${ticketId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    return response.json();
  }

  async updateTicket(ticketId: string, updates: Partial<TicketData>): Promise<TicketData> {
    const response = await fetch(`${this.apiBase}/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update ticket');
    }

    return response.json();
  }

  async deleteTicket(ticketId: string): Promise<void> {
    const response = await fetch(`${this.apiBase}/tickets/${ticketId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete ticket');
    }
  }

  // Message Operations
  async addMessage(ticketId: string, messageData: Partial<TicketMessage>): Promise<TicketMessage> {
    const response = await fetch(`${this.apiBase}/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error('Failed to add message');
    }

    return response.json();
  }

  async getMessages(ticketId: string): Promise<TicketMessage[]> {
    const response = await fetch(`${this.apiBase}/tickets/${ticketId}/messages`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  }

  // Agent Operations
  async getAgents(): Promise<Agent[]> {
    const response = await fetch(`${this.apiBase}/agents`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    return response.json();
  }

  async updateAgentStatus(agentId: string, status: Agent['status']): Promise<Agent> {
    const response = await fetch(`${this.apiBase}/agents/${agentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update agent status');
    }

    return response.json();
  }

  // Statistics
  async getStats(): Promise<SupportStats> {
    const response = await fetch(`${this.apiBase}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  }

  // File Upload
  async uploadAttachment(ticketId: string, file: File): Promise<TicketAttachment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.apiBase}/tickets/${ticketId}/attachments`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload attachment');
    }

    return response.json();
  }

  // Canned Responses
  async getCannedResponses(): Promise<CannedResponse[]> {
    const response = await fetch(`${this.apiBase}/canned-responses`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch canned responses');
    }

    return response.json();
  }

  // Email Integration
  async sendEmail(ticketId: string, emailData: EmailData): Promise<void> {
    const response = await fetch(`${this.apiBase}/tickets/${ticketId}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  }

  // Bulk Operations
  async bulkUpdateTickets(ticketIds: string[], updates: Partial<TicketData>): Promise<void> {
    const response = await fetch(`${this.apiBase}/tickets/bulk-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticketIds, updates }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk update tickets');
    }
  }

  // Reporting
  async generateReport(reportType: string, filters?: any): Promise<any> {
    const response = await fetch(`${this.apiBase}/reports/${reportType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    return response.json();
  }

  // Multi-tenant Operations
  async getTenantConfig(tenantId: string): Promise<SupportConfiguration> {
    const response = await fetch(`${this.apiBase}/tenants/${tenantId}/config`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tenant config');
    }

    return response.json();
  }

  async updateTenantConfig(tenantId: string, config: Partial<SupportConfiguration>): Promise<SupportConfiguration> {
    const response = await fetch(`${this.apiBase}/tenants/${tenantId}/config`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to update tenant config');
    }

    return response.json();
  }
}

// Utility Interfaces
export interface TicketFilters {
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  customerId?: string;
  createdAfter?: string;
  createdBefore?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
  tenant?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  isHtml: boolean;
  cc?: string[];
  bcc?: string[];
  attachments?: string[];
}

// Priority and Status Utilities
export const TICKET_PRIORITIES = {
  urgent: { label: 'Urgent', color: 'red', sla: 2 },
  high: { label: 'High', color: 'orange', sla: 4 },
  medium: { label: 'Medium', color: 'yellow', sla: 24 },
  low: { label: 'Low', color: 'green', sla: 48 },
} as const;

export const TICKET_STATUSES = {
  open: { label: 'Open', color: 'blue', description: 'New ticket awaiting assignment' },
  in_progress: { label: 'In Progress', color: 'yellow', description: 'Ticket is being worked on' },
  pending: { label: 'Pending', color: 'orange', description: 'Waiting for customer response' },
  resolved: { label: 'Resolved', color: 'green', description: 'Issue has been resolved' },
  closed: { label: 'Closed', color: 'gray', description: 'Ticket is closed and archived' },
} as const;

// Helper Functions
export function calculateSLABreach(ticket: TicketData, slaConfig: SLAConfig): boolean {
  const createdAt = new Date(ticket.createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  
  const slaHours = slaConfig[ticket.priority];
  return hoursDiff > slaHours;
}

export function formatTicketId(id: string): string {
  return `TK-${id.padStart(6, '0')}`;
}

export function getTicketAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Less than 1 hour ago';
  }
}

// Export the service instance
export const ticketingService = new TicketingService();

// Multi-tenant utilities
export class MultiTenantTicketingService extends TicketingService {
  constructor(private tenantId: string) {
    super();
  }

  // Override API calls to include tenant context
  async createTicket(ticketData: Partial<TicketData>): Promise<TicketData> {
    return super.createTicket({ ...ticketData, tenant: this.tenantId });
  }

  async getTickets(filters?: TicketFilters): Promise<TicketData[]> {
    return super.getTickets({ ...filters, tenant: this.tenantId });
  }

  // Additional tenant-specific methods
  async getTenantStats(): Promise<SupportStats> {
    const response = await fetch(`${this.apiBase}/tenants/${this.tenantId}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tenant stats');
    }

    return response.json();
  }
}

// Factory function for creating tenant-specific service instances
export function createTenantTicketingService(tenantId: string): MultiTenantTicketingService {
  return new MultiTenantTicketingService(tenantId);
}

// Mock data for the CustomerSupportModal
export const supportCategories = [
  { id: 'general', name: 'General Support', description: 'General questions and support' },
  { id: 'technical', name: 'Technical Issues', description: 'Technical problems and troubleshooting' },
  { id: 'billing', name: 'Billing & Payments', description: 'Billing questions and payment issues' },
  { id: 'account', name: 'Account Management', description: 'Account settings and management' }
];

export const faqItems = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on "Forgot Password" on the login page.',
    category: 'general'
  },
  {
    id: '2',
    question: 'How do I update my billing information?',
    answer: 'Go to Account Settings > Billing to update your payment information.',
    category: 'billing'
  },
  {
    id: '3',
    question: 'Why is my website loading slowly?',
    answer: 'This could be due to several factors. Try clearing your browser cache first.',
    category: 'technical'
  }
];