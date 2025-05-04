// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'sales' | 'readonly';
  createdAt: string;
}

// Pipeline types
export interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: string;
  name: string;
  position: number;
  probability: number; // 0-100
  pipelineId: string;
  deals: Deal[];
}

// Deal types
export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stageId: string;
  pipelineId: string;
  contactIds: string[];
  organizationId?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  expectedCloseDate?: string;
  products: DealProduct[];
  activities: string[];
  emails: string[];
  history: DealHistory[];
  tags: string[];
  customFields: { [key: string]: any };
  lastActivityDate?: string;
}

export interface DealHistory {
  id: string;
  dealId: string;
  stageId: string;
  stageName: string;
  date: string;
  userId: string;
  userName: string;
}

export interface DealProduct {
  id: string;
  dealId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  organizationId?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lastActivityDate?: string;
  tags: string[];
  customFields: { [key: string]: any };
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  website?: string;
  address?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lastActivityDate?: string;
  tags: string[];
  customFields: { [key: string]: any };
}

// Activity types
export interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'task' | 'deadline' | 'email' | 'custom';
  title: string;
  description?: string;
  dueDate: string;
  isDone: boolean;
  isRecurring: boolean;
  recurringPattern?: string;
  dealId?: string;
  contactId?: string;
  organizationId?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  reminderDate?: string;
}

// Email types
export interface Email {
  id: string;
  subject: string;
  body: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  from: string;
  sentAt?: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledFor?: string;
  dealId?: string;
  contactId?: string;
  organizationId?: string;
  ownerId: string;
  opens: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

// Lead types
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  notes?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  customFields: { [key: string]: any };
}

// Product types
export interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  price: number;
  currency: string;
  tax: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Automation types
export interface Automation {
  id: string;
  name: string;
  isActive: boolean;
  trigger: {
    type: 'new_deal' | 'deal_stage_change' | 'new_activity' | 'activity_completed' | 'new_contact';
    conditions: AutomationCondition[];
  };
  actions: AutomationAction[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface AutomationAction {
  type: 'send_email' | 'create_activity' | 'update_field' | 'create_deal';
  params: { [key: string]: any };
}

// Custom field types
export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox';
  entityType: 'deal' | 'contact' | 'organization' | 'lead';
  options?: string[];
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard widget types
export interface DashboardWidget {
  id: string;
  type: 'pipeline_value' | 'conversion_rate' | 'deal_velocity' | 'leaderboard' | 'activity_summary';
  title: string;
  position: number;
  config: { [key: string]: any };
  userId: string;
}