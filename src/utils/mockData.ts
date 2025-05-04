import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';
import {
  User,
  Pipeline,
  Stage,
  Deal,
  Contact,
  Organization,
  Activity,
  Email,
  EmailTemplate,
  Lead,
  Product,
  Automation,
  CustomField,
  DashboardWidget
} from '../types';

// Helper function to get date strings
const today = new Date();
const getDateString = (daysToAdd: number) => format(addDays(today, daysToAdd), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

// Generate mock users
const users: User[] = [
  {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
    role: 'admin',
    createdAt: getDateString(-30),
  },
  {
    id: uuidv4(),
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
    role: 'sales',
    createdAt: getDateString(-25),
  },
  {
    id: uuidv4(),
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
    role: 'readonly',
    createdAt: getDateString(-20),
  },
];

// Generate mock organizations
const organizations: Organization[] = [
  {
    id: uuidv4(),
    name: 'Acme Inc',
    website: 'https://acme.com',
    address: '123 Main St, San Francisco, CA',
    ownerId: users[0].id,
    createdAt: getDateString(-28),
    updatedAt: getDateString(-28),
    tags: ['customer', 'enterprise'],
    customFields: {
      industry: 'Technology',
      employees: 500,
    },
  },
  {
    id: uuidv4(),
    name: 'Widget Corp',
    website: 'https://widgetcorp.com',
    address: '456 Market St, New York, NY',
    ownerId: users[1].id,
    createdAt: getDateString(-26),
    updatedAt: getDateString(-20),
    tags: ['prospect', 'mid-market'],
    customFields: {
      industry: 'Manufacturing',
      employees: 150,
    },
    lastActivityDate: getDateString(-2),
  },
  {
    id: uuidv4(),
    name: 'Global Systems',
    website: 'https://globalsystems.com',
    address: '789 Broadway, Chicago, IL',
    ownerId: users[0].id,
    createdAt: getDateString(-22),
    updatedAt: getDateString(-15),
    tags: ['customer', 'enterprise'],
    customFields: {
      industry: 'Finance',
      employees: 1200,
    },
    lastActivityDate: getDateString(-5),
  },
];

// Generate mock contacts
const contacts: Contact[] = [
  {
    id: uuidv4(),
    name: 'Alice Brown',
    email: 'alice@acme.com',
    phone: '+1 555-123-4567',
    organizationId: organizations[0].id,
    ownerId: users[0].id,
    createdAt: getDateString(-27),
    updatedAt: getDateString(-27),
    tags: ['decision-maker', 'responsive'],
    customFields: {
      position: 'CTO',
      department: 'Technology',
    },
    lastActivityDate: getDateString(-1),
  },
  {
    id: uuidv4(),
    name: 'Carlos Rodriguez',
    email: 'carlos@widgetcorp.com',
    phone: '+1 555-234-5678',
    organizationId: organizations[1].id,
    ownerId: users[1].id,
    createdAt: getDateString(-25),
    updatedAt: getDateString(-20),
    tags: ['decision-maker'],
    customFields: {
      position: 'CFO',
      department: 'Finance',
    },
    lastActivityDate: getDateString(-3),
  },
  {
    id: uuidv4(),
    name: 'David Lee',
    email: 'david@globalsystems.com',
    phone: '+1 555-345-6789',
    organizationId: organizations[2].id,
    ownerId: users[0].id,
    createdAt: getDateString(-22),
    updatedAt: getDateString(-15),
    tags: ['influencer'],
    customFields: {
      position: 'VP Sales',
      department: 'Sales',
    },
    lastActivityDate: getDateString(-5),
  },
  {
    id: uuidv4(),
    name: 'Emily Chen',
    email: 'emily@acme.com',
    phone: '+1 555-456-7890',
    organizationId: organizations[0].id,
    ownerId: users[0].id,
    createdAt: getDateString(-20),
    updatedAt: getDateString(-18),
    tags: ['technical', 'responsive'],
    customFields: {
      position: 'Product Manager',
      department: 'Product',
    },
  },
];

// Generate mock pipelines and stages
const pipelines: Pipeline[] = [
  {
    id: uuidv4(),
    name: 'Main Sales Pipeline',
    createdAt: getDateString(-30),
    updatedAt: getDateString(-5),
    stages: [
      {
        id: uuidv4(),
        name: 'Qualification',
        position: 0,
        probability: 10,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Meeting',
        position: 1,
        probability: 25,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Proposal',
        position: 2,
        probability: 50,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Negotiation',
        position: 3,
        probability: 80,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Closed Won',
        position: 4,
        probability: 100,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Closed Lost',
        position: 5,
        probability: 0,
        pipelineId: '', // Will be set below
        deals: [],
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'Partner Pipeline',
    createdAt: getDateString(-20),
    updatedAt: getDateString(-20),
    stages: [
      {
        id: uuidv4(),
        name: 'Initial Contact',
        position: 0,
        probability: 10,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Partner Fit',
        position: 1,
        probability: 30,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Agreement',
        position: 2,
        probability: 70,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Onboarding',
        position: 3,
        probability: 90,
        pipelineId: '', // Will be set below
        deals: [],
      },
      {
        id: uuidv4(),
        name: 'Active Partner',
        position: 4,
        probability: 100,
        pipelineId: '', // Will be set below
        deals: [],
      },
    ],
  },
];

// Set pipeline IDs for stages
pipelines[0].stages.forEach(stage => {
  stage.pipelineId = pipelines[0].id;
});

pipelines[1].stages.forEach(stage => {
  stage.pipelineId = pipelines[1].id;
});

// Generate mock deals
const deal1: Deal = {
  id: uuidv4(),
  title: 'Enterprise Software Package',
  value: 75000,
  currency: 'USD',
  stageId: pipelines[0].stages[2].id,
  pipelineId: pipelines[0].id,
  contactIds: [contacts[0].id],
  organizationId: organizations[0].id,
  ownerId: users[0].id,
  createdAt: getDateString(-15),
  updatedAt: getDateString(-2),
  expectedCloseDate: getDateString(15),
  products: [],
  activities: [],
  emails: [],
  history: [
    {
      id: uuidv4(),
      dealId: '', // Will be set below
      stageId: pipelines[0].stages[0].id,
      stageName: pipelines[0].stages[0].name,
      date: getDateString(-15),
      userId: users[0].id,
      userName: users[0].name,
    },
    {
      id: uuidv4(),
      dealId: '', // Will be set below
      stageId: pipelines[0].stages[1].id,
      stageName: pipelines[0].stages[1].name,
      date: getDateString(-10),
      userId: users[0].id,
      userName: users[0].name,
    },
    {
      id: uuidv4(),
      dealId: '', // Will be set below
      stageId: pipelines[0].stages[2].id,
      stageName: pipelines[0].stages[2].name,
      date: getDateString(-5),
      userId: users[0].id,
      userName: users[0].name,
    },
  ],
  tags: ['priority', 'enterprise'],
  customFields: {
    source: 'Website',
    probability: 65,
  },
  lastActivityDate: getDateString(-1),
};

const deal2: Deal = {
  id: uuidv4(),
  title: 'Financial Services',
  value: 25000,
  currency: 'USD',
  stageId: pipelines[0].stages[1].id,
  pipelineId: pipelines[0].id,
  contactIds: [contacts[2].id],
  organizationId: organizations[2].id,
  ownerId: users[0].id,
  createdAt: getDateString(-10),
  updatedAt: getDateString(-3),
  expectedCloseDate: getDateString(30),
  products: [],
  activities: [],
  emails: [],
  history: [
    {
      id: uuidv4(),
      dealId: '', // Will be set below
      stageId: pipelines[0].stages[0].id,
      stageName: pipelines[0].stages[0].name,
      date: getDateString(-10),
      userId: users[0].id,
      userName: users[0].name,
    },
    {
      id: uuidv4(),
      dealId: '', // Will be set below
      stageId: pipelines[0].stages[1].id,
      stageName: pipelines[0].stages[1].name,
      date: getDateString(-5),
      userId: users[0].id,
      userName: users[0].name,
    },
  ],
  tags: ['financial'],
  customFields: {
    source: 'Referral',
    probability: 35,
  },
  lastActivityDate: getDateString(-3),
};

const deal3: Deal = {
  id: uuidv4(),
  title: 'Manufacturing Partner',
  value: 50000,
  currency: 'USD',
  stageId: pipelines[1].stages[2].id,
  pipelineId: pipelines[1].id,
  contactIds: [contacts[1].id],
  organizationId: organizations[1].id,
  ownerId: users[1].id,
  createdAt: getDateString(-20),
  updatedAt: getDateString(-8),
  expectedCloseDate: getDateString(10),
  products: [],
  activities: [],
  emails: [],
  history: [
    {
      id: uuidv4(),
      dealId: '', // Will be set below
      stageId: pipelines[1].stages[0].id,
      stageName: pipelines[1].stages[0].name,
      date: getDateString(-20),
      userId: users[1].id,
      userName: users[1].name,
    },
    {
      id: uuidv4(),
      dealId: '', // Will be set below
      stageId: pipelines[1].stages[1].id,
      stageName: pipelines[1].stages[1].name,
      date: getDateString(-15),
      userId: users[1].id,
      userName: users[1].name,
    },
    {
      id: uuidv4(),
      dealId: '', // Will be set below
      stageId: pipelines[1].stages[2].id,
      stageName: pipelines[1].stages[2].name,
      date: getDateString(-8),
      userId: users[1].id,
      userName: users[1].name,
    },
  ],
  tags: ['manufacturing', 'partner'],
  customFields: {
    source: 'Conference',
    probability: 70,
  },
  lastActivityDate: getDateString(-2),
};

// Set deal IDs in history records
deal1.history.forEach(h => { h.dealId = deal1.id; });
deal2.history.forEach(h => { h.dealId = deal2.id; });
deal3.history.forEach(h => { h.dealId = deal3.id; });

// Add deals to their respective stages
pipelines[0].stages[2].deals.push(deal1);
pipelines[0].stages[1].deals.push(deal2);
pipelines[1].stages[2].deals.push(deal3);

// Generate mock activities
const activities: Activity[] = [
  {
    id: uuidv4(),
    type: 'call',
    title: 'Follow-up call with Alice',
    description: 'Discuss proposal details and pricing',
    dueDate: getDateString(1),
    isDone: false,
    isRecurring: false,
    dealId: deal1.id,
    contactId: contacts[0].id,
    organizationId: organizations[0].id,
    ownerId: users[0].id,
    createdAt: getDateString(-2),
    updatedAt: getDateString(-2),
    reminderDate: getDateString(1),
  },
  {
    id: uuidv4(),
    type: 'meeting',
    title: 'Presentation meeting',
    description: 'Present the solution to Global Systems team',
    dueDate: getDateString(3),
    isDone: false,
    isRecurring: false,
    dealId: deal2.id,
    contactId: contacts[2].id,
    organizationId: organizations[2].id,
    ownerId: users[0].id,
    createdAt: getDateString(-3),
    updatedAt: getDateString(-3),
  },
  {
    id: uuidv4(),
    type: 'deadline',
    title: 'Submit partner agreement',
    dueDate: getDateString(5),
    isDone: false,
    isRecurring: false,
    dealId: deal3.id,
    contactId: contacts[1].id,
    organizationId: organizations[1].id,
    ownerId: users[1].id,
    createdAt: getDateString(-8),
    updatedAt: getDateString(-8),
    reminderDate: getDateString(4),
  },
  {
    id: uuidv4(),
    type: 'task',
    title: 'Prepare contract draft',
    description: 'Create legal document for review',
    dueDate: getDateString(-1),
    isDone: true,
    isRecurring: false,
    dealId: deal1.id,
    ownerId: users[0].id,
    createdAt: getDateString(-5),
    updatedAt: getDateString(-1),
  },
  {
    id: uuidv4(),
    type: 'call',
    title: 'Weekly check-in',
    description: 'Regular status update call',
    dueDate: getDateString(7),
    isDone: false,
    isRecurring: true,
    recurringPattern: 'weekly',
    contactId: contacts[3].id,
    organizationId: organizations[0].id,
    ownerId: users[0].id,
    createdAt: getDateString(-10),
    updatedAt: getDateString(-10),
  },
];

// Add activities to their respective deals
deal1.activities = [activities[0].id, activities[3].id];
deal2.activities = [activities[1].id];
deal3.activities = [activities[2].id];

// Generate mock emails
const emails: Email[] = [
  {
    id: uuidv4(),
    subject: 'Proposal for Acme Inc',
    body: '<p>Dear Alice,</p><p>Please find attached our proposal for the enterprise software package.</p><p>Best regards,<br>John</p>',
    to: [contacts[0].email],
    from: users[0].email,
    sentAt: getDateString(-3),
    status: 'sent',
    dealId: deal1.id,
    contactId: contacts[0].id,
    organizationId: organizations[0].id,
    ownerId: users[0].id,
    opens: 2,
    clicks: 1,
    createdAt: getDateString(-3),
    updatedAt: getDateString(-3),
  },
  {
    id: uuidv4(),
    subject: 'Meeting follow-up',
    body: '<p>Hi David,</p><p>Thank you for your time today. I\'ll send over the additional information we discussed.</p><p>Regards,<br>John</p>',
    to: [contacts[2].email],
    from: users[0].email,
    sentAt: getDateString(-2),
    status: 'sent',
    dealId: deal2.id,
    contactId: contacts[2].id,
    organizationId: organizations[2].id,
    ownerId: users[0].id,
    opens: 1,
    clicks: 0,
    createdAt: getDateString(-2),
    updatedAt: getDateString(-2),
  },
  {
    id: uuidv4(),
    subject: 'Partnership agreement',
    body: '<p>Hello Carlos,</p><p>I\'ve prepared a draft of our partnership agreement for your review.</p><p>Best,<br>Jane</p>',
    to: [contacts[1].email],
    from: users[1].email,
    status: 'draft',
    dealId: deal3.id,
    contactId: contacts[1].id,
    organizationId: organizations[1].id,
    ownerId: users[1].id,
    opens: 0,
    clicks: 0,
    createdAt: getDateString(-1),
    updatedAt: getDateString(-1),
  },
];

// Add emails to their respective deals
deal1.emails = [emails[0].id];
deal2.emails = [emails[1].id];
deal3.emails = [emails[2].id];

// Generate mock email templates
const emailTemplates: EmailTemplate[] = [
  {
    id: uuidv4(),
    name: 'Initial Contact',
    subject: 'Introduction: {{user.name}} from Driveapipe',
    body: '<p>Hello {{contact.name}},</p><p>My name is {{user.name}} from Driveapipe, and I noticed your company {{organization.name}} might benefit from our solutions.</p><p>Would you be available for a brief call to discuss how we might help?</p><p>Best regards,<br>{{user.name}}</p>',
    createdAt: getDateString(-20),
    updatedAt: getDateString(-20),
    ownerId: users[0].id,
  },
  {
    id: uuidv4(),
    name: 'Follow-up',
    subject: 'Following up on our conversation',
    body: '<p>Hi {{contact.name}},</p><p>I wanted to follow up on our recent conversation about {{deal.title}}.</p><p>Do you have any questions I can help with?</p><p>Regards,<br>{{user.name}}</p>',
    createdAt: getDateString(-15),
    updatedAt: getDateString(-15),
    ownerId: users[0].id,
  },
  {
    id: uuidv4(),
    name: 'Proposal',
    subject: 'Proposal for {{organization.name}}',
    body: '<p>Dear {{contact.name}},</p><p>Please find attached our proposal for {{deal.title}}.</p><p>I\'m available to discuss any questions you might have.</p><p>Best regards,<br>{{user.name}}</p>',
    createdAt: getDateString(-10),
    updatedAt: getDateString(-10),
    ownerId: users[0].id,
  },
];

// Generate mock leads
const leads: Lead[] = [
  {
    id: uuidv4(),
    name: 'Frank Wilson',
    email: 'frank@newprospect.com',
    phone: '+1 555-987-6543',
    source: 'Website Form',
    status: 'new',
    notes: 'Requested information about our enterprise solutions',
    ownerId: users[0].id,
    createdAt: getDateString(-2),
    updatedAt: getDateString(-2),
    tags: ['website'],
    customFields: {
      company: 'New Prospect Inc',
      position: 'IT Director',
    },
  },
  {
    id: uuidv4(),
    name: 'Grace Kim',
    email: 'grace@interestco.com',
    phone: '+1 555-876-5432',
    source: 'Trade Show',
    status: 'contacted',
    notes: 'Met at SaaS Expo, showed interest in our product',
    ownerId: users[1].id,
    createdAt: getDateString(-5),
    updatedAt: getDateString(-3),
    tags: ['event', 'hot-lead'],
    customFields: {
      company: 'Interest Co',
      position: 'CIO',
    },
  },
  {
    id: uuidv4(),
    name: 'Henry Clark',
    email: 'henry@potentialcorp.com',
    phone: '+1 555-765-4321',
    source: 'Referral',
    status: 'qualified',
    notes: 'Referred by David Lee, interested in financial module',
    ownerId: users[0].id,
    createdAt: getDateString(-8),
    updatedAt: getDateString(-4),
    tags: ['referral', 'finance'],
    customFields: {
      company: 'Potential Corp',
      position: 'CFO',
    },
  },
];

// Generate mock products
const products: Product[] = [
  {
    id: uuidv4(),
    name: 'Basic CRM',
    code: 'CRM-BASIC',
    description: 'Core CRM functionality for small teams',
    price: 1000,
    currency: 'USD',
    tax: 8.5,
    isActive: true,
    createdAt: getDateString(-30),
    updatedAt: getDateString(-30),
  },
  {
    id: uuidv4(),
    name: 'Professional CRM',
    code: 'CRM-PRO',
    description: 'Advanced CRM features for growing businesses',
    price: 3000,
    currency: 'USD',
    tax: 8.5,
    isActive: true,
    createdAt: getDateString(-30),
    updatedAt: getDateString(-15),
  },
  {
    id: uuidv4(),
    name: 'Enterprise CRM',
    code: 'CRM-ENT',
    description: 'Full-featured CRM solution for large organizations',
    price: 5000,
    currency: 'USD',
    tax: 8.5,
    isActive: true,
    createdAt: getDateString(-30),
    updatedAt: getDateString(-30),
  },
  {
    id: uuidv4(),
    name: 'Implementation Services',
    code: 'SVC-IMPL',
    description: 'Professional setup and configuration',
    price: 2000,
    currency: 'USD',
    tax: 8.5,
    isActive: true,
    createdAt: getDateString(-30),
    updatedAt: getDateString(-30),
  },
  {
    id: uuidv4(),
    name: 'Training Package',
    code: 'SVC-TRN',
    description: '10 hours of training for your team',
    price: 1500,
    currency: 'USD',
    tax: 8.5,
    isActive: true,
    createdAt: getDateString(-30),
    updatedAt: getDateString(-30),
  },
];

// Add products to deals
deal1.products = [
  {
    id: uuidv4(),
    dealId: deal1.id,
    productId: products[2].id,
    quantity: 1,
    price: products[2].price,
    discount: 0,
    tax: products[2].tax,
  },
  {
    id: uuidv4(),
    dealId: deal1.id,
    productId: products[3].id,
    quantity: 1,
    price: products[3].price,
    discount: 500,
    tax: products[3].tax,
  },
];

deal2.products = [
  {
    id: uuidv4(),
    dealId: deal2.id,
    productId: products[1].id,
    quantity: 1,
    price: products[1].price,
    discount: 0,
    tax: products[1].tax,
  },
];

deal3.products = [
  {
    id: uuidv4(),
    dealId: deal3.id,
    productId: products[1].id,
    quantity: 2,
    price: products[1].price,
    discount: 1000,
    tax: products[1].tax,
  },
  {
    id: uuidv4(),
    dealId: deal3.id,
    productId: products[4].id,
    quantity: 1,
    price: products[4].price,
    discount: 0,
    tax: products[4].tax,
  },
];

// Generate mock automations
const automations: Automation[] = [
  {
    id: uuidv4(),
    name: 'New Deal Welcome Email',
    isActive: true,
    trigger: {
      type: 'new_deal',
      conditions: [],
    },
    actions: [
      {
        type: 'send_email',
        params: {
          templateId: emailTemplates[0].id,
          delay: 0,
        },
      },
    ],
    createdAt: getDateString(-20),
    updatedAt: getDateString(-20),
  },
  {
    id: uuidv4(),
    name: 'Deal Stage Changed to Proposal',
    isActive: true,
    trigger: {
      type: 'deal_stage_change',
      conditions: [
        {
          field: 'stageName',
          operator: 'equals',
          value: 'Proposal',
        },
      ],
    },
    actions: [
      {
        type: 'send_email',
        params: {
          templateId: emailTemplates[2].id,
          delay: 0,
        },
      },
      {
        type: 'create_activity',
        params: {
          type: 'call',
          title: 'Follow-up on proposal',
          dueDate: 3, // days from now
        },
      },
    ],
    createdAt: getDateString(-15),
    updatedAt: getDateString(-15),
  },
  {
    id: uuidv4(),
    name: 'Activity Reminder',
    isActive: true,
    trigger: {
      type: 'new_activity',
      conditions: [],
    },
    actions: [
      {
        type: 'update_field',
        params: {
          field: 'reminderDate',
          value: 'subtract_1_day_from_dueDate',
        },
      },
    ],
    createdAt: getDateString(-10),
    updatedAt: getDateString(-10),
  },
  {
    id: uuidv4(),
    name: 'High Value Deal Alert',
    isActive: true,
    trigger: {
      type: 'new_deal',
      conditions: [
        {
          field: 'value',
          operator: 'greater_than',
          value: 50000,
        },
      ],
    },
    actions: [
      {
        type: 'send_email',
        params: {
          to: ['management@company.com'],
          subject: 'High Value Deal Alert',
          body: 'A new high value deal has been created: {{deal.title}}',
        },
      },
      {
        type: 'create_activity',
        params: {
          type: 'meeting',
          title: 'Strategy meeting for {{deal.title}}',
          dueDate: 2,
        },
      },
    ],
    createdAt: getDateString(-8),
    updatedAt: getDateString(-8),
  },
  {
    id: uuidv4(),
    name: 'Deal Stale Alert',
    isActive: true,
    trigger: {
      type: 'deal_stage_duration',
      conditions: [
        {
          field: 'daysInStage',
          operator: 'greater_than',
          value: 14,
        },
      ],
    },
    actions: [
      {
        type: 'send_email',
        params: {
          to: ['{{deal.owner.email}}'],
          subject: 'Deal Needs Attention',
          body: 'Deal {{deal.title}} has been in {{deal.stage}} for over 14 days',
        },
      },
      {
        type: 'create_activity',
        params: {
          
          type: 'task',
          title: 'Review stale deal: {{deal.title}}',
          dueDate: 1,
          priority: 'high',
        },
      },
    ],
    createdAt: getDateString(-5),
    updatedAt: getDateString(-5),
  },
  {
    id: uuidv4(),
    name: 'New Contact Assignment',
    isActive: true,
    trigger: {
      type: 'new_contact',
      conditions: [
        {
          field: 'source',
          operator: 'equals',
          value: 'website',
        },
      ],
    },
    actions: [
      {
        type: 'create_activity',
        params: {
          type: 'call',
          title: 'Initial contact with {{contact.name}}',
          dueDate: 1,
        },
      },
      {
        type: 'update_field',
        params: {
          field: 'status',
          value: 'pending_contact',
        },
      },
    ],
    createdAt: getDateString(-3),
    updatedAt: getDateString(-3),
  },
  {
    id: uuidv4(),
    name: 'Deal Won Celebration',
    isActive: true,
    trigger: {
      type: 'deal_stage_change',
      conditions: [
        {
          field: 'stageName',
          operator: 'equals',
          value: 'Closed Won',
        },
      ],
    },
    actions: [
      {
        type: 'send_email',
        params: {
          to: ['team@company.com'],
          subject: 'Deal Won! 🎉',
          body: 'Congratulations! {{deal.owner.name}} has closed the deal with {{deal.organization.name}}!',
        },
      },
      {
        type: 'create_activity',
        params: {
          type: 'task',
          title: 'Schedule onboarding for {{deal.organization.name}}',
          dueDate: 2,
        },
      },
    ],
    createdAt: getDateString(-2),
    updatedAt: getDateString(-2),
  },
];

// Generate mock custom fields
const customFields: CustomField[] = [
  {
    id: uuidv4(),
    name: 'Industry',
    type: 'select',
    entityType: 'organization',
    options: ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Other'],
    isRequired: false,
    createdAt: getDateString(-30),
    updatedAt: getDateString(-30),
  },
  {
    id: uuidv4(),
    name: 'Employees',
    type: 'number',
    entityType: 'organization',
    isRequired: false,
    createdAt: getDateString(-30),
    updatedAt: getDateString(-30),
  },
  {
    id: uuidv4(),
    name: 'Annual Revenue',
    type: 'number',
    entityType: 'organization',
    isRequired: false,
    createdAt: getDateString(-25),
    updatedAt: getDateString(-25),
  },
  {
    id: uuidv4(),
    name: 'LinkedIn URL',
    type: 'text',
    entityType: 'contact',
    isRequired: false,
    createdAt: getDateString(-25),
    updatedAt: getDateString(-25),
  },
  {
    id: uuidv4(),
    name: 'Lead Source',
    type: 'select',
    entityType: 'deal',
    options: ['Website', 'Referral', 'Cold Call', 'Event', 'Social Media', 'Other'],
    isRequired: true,
    createdAt: getDateString(-20),
    updatedAt: getDateString(-20),
  },
  {
    id: uuidv4(),
    name: 'Next Steps',
    type: 'text',
    entityType: 'deal',
    isRequired: false,
    createdAt: getDateString(-20),
    updatedAt: getDateString(-20),
  },
  {
    id: uuidv4(),
    name: 'Competition',
    type: 'text',
    entityType: 'deal',
    isRequired: false,
    createdAt: getDateString(-15),
    updatedAt: getDateString(-15),
  },
  {
    id: uuidv4(),
    name: 'Decision Timeline',
    type: 'select',
    entityType: 'deal',
    options: ['< 1 month', '1-3 months', '3-6 months', '6+ months'],
    isRequired: false,
    createdAt: getDateString(-15),
    updatedAt: getDateString(-15),
  },
  {
    id: uuidv4(),
    name: 'Budget Status',
    type: 'select',
    entityType: 'deal',
    options: ['Approved', 'Pending', 'No Budget', 'Unknown'],
    isRequired: false,
    createdAt: getDateString(-10),
    updatedAt: getDateString(-10),
  },
];

// Generate mock dashboard widgets
const dashboardWidgets: DashboardWidget[] = [
  {
    id: uuidv4(),
    type: 'pipeline_value',
    title: 'Pipeline Value by Stage',
    position: 0,
    config: {
      pipelineId: pipelines[0].id,
      period: 'current_quarter',
    },
    userId: users[0].id,
  },
  {
    id: uuidv4(),
    type: 'conversion_rate',
    title: 'Stage Conversion Rates',
    position: 1,
    config: {
      pipelineId: pipelines[0].id,
      period: 'last_90_days',
    },
    userId: users[0].id,
  },
  {
    id: uuidv4(),
    type: 'deal_velocity',
    title: 'Deal Velocity (Days per Stage)',
    position: 2,
    config: {
      pipelineId: pipelines[0].id,
      period: 'last_6_months',
    },
    userId: users[0].id,
  },
  {
    id: uuidv4(),
    type: 'leaderboard',
    title: 'Sales Leaderboard',
    position: 3,
    config: {
      period: 'current_month',
      metric: 'value',
    },
    userId: users[0].id,
  },
  {
    id: uuidv4(),
    type: 'activity_summary',
    title: 'Upcoming Activities',
    position: 4,
    config: {
      period: 'next_7_days',
      types: ['call', 'meeting', 'deadline'],
    },
    userId: users[0].id,
  },
];

export const mockData = {
  users,
  pipelines,
  contacts,
  organizations,
  activities,
  emails,
  emailTemplates,
  leads,
  products,
  automations,
  customFields,
  dashboardWidgets,
};