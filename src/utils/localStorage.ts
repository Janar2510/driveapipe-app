import { v4 as uuidv4 } from 'uuid';
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
import { mockData } from './mockData';

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'driveapipe_users',
  CURRENT_USER: 'driveapipe_current_user',
  PIPELINES: 'driveapipe_pipelines',
  DEALS: 'driveapipe_deals',
  CONTACTS: 'driveapipe_contacts',
  ORGANIZATIONS: 'driveapipe_organizations',
  ACTIVITIES: 'driveapipe_activities',
  EMAILS: 'driveapipe_emails',
  EMAIL_TEMPLATES: 'driveapipe_email_templates',
  LEADS: 'driveapipe_leads',
  PRODUCTS: 'driveapipe_products',
  AUTOMATIONS: 'driveapipe_automations',
  CUSTOM_FIELDS: 'driveapipe_custom_fields',
  DASHBOARD_WIDGETS: 'driveapipe_dashboard_widgets',
};

// Helper function to get data from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error getting data from localStorage: ${error}`);
    return defaultValue;
  }
};

// Helper function to set data in localStorage
const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting data to localStorage: ${error}`);
  }
};

// Initialize local storage with mock data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setToStorage(STORAGE_KEYS.USERS, mockData.users);
    setToStorage(STORAGE_KEYS.CURRENT_USER, mockData.users[0]);
    setToStorage(STORAGE_KEYS.PIPELINES, mockData.pipelines);
    setToStorage(STORAGE_KEYS.CONTACTS, mockData.contacts);
    setToStorage(STORAGE_KEYS.ORGANIZATIONS, mockData.organizations);
    setToStorage(STORAGE_KEYS.ACTIVITIES, mockData.activities);
    setToStorage(STORAGE_KEYS.EMAILS, mockData.emails);
    setToStorage(STORAGE_KEYS.EMAIL_TEMPLATES, mockData.emailTemplates);
    setToStorage(STORAGE_KEYS.LEADS, mockData.leads);
    setToStorage(STORAGE_KEYS.PRODUCTS, mockData.products);
    setToStorage(STORAGE_KEYS.AUTOMATIONS, mockData.automations);
    setToStorage(STORAGE_KEYS.CUSTOM_FIELDS, mockData.customFields);
    setToStorage(STORAGE_KEYS.DASHBOARD_WIDGETS, mockData.dashboardWidgets);
  }
};

// User API
export const getUsers = (): User[] => getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
export const getCurrentUser = (): User | null => getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
export const setCurrentUser = (user: User): void => setToStorage(STORAGE_KEYS.CURRENT_USER, user);

// Pipeline API
export const getPipelines = (): Pipeline[] => getFromStorage<Pipeline[]>(STORAGE_KEYS.PIPELINES, []);
export const getPipeline = (id: string): Pipeline | undefined => {
  const pipelines = getPipelines();
  return pipelines.find(pipeline => pipeline.id === id);
};

export const createPipeline = (pipeline: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>): Pipeline => {
  const pipelines = getPipelines();
  const now = new Date().toISOString();
  
  const newPipeline: Pipeline = {
    ...pipeline,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  setToStorage(STORAGE_KEYS.PIPELINES, [...pipelines, newPipeline]);
  return newPipeline;
};

export const updatePipeline = (id: string, pipeline: Partial<Pipeline>): Pipeline | undefined => {
  const pipelines = getPipelines();
  const index = pipelines.findIndex(p => p.id === id);
  
  if (index === -1) return undefined;
  
  const updatedPipeline = {
    ...pipelines[index],
    ...pipeline,
    updatedAt: new Date().toISOString(),
  };
  
  pipelines[index] = updatedPipeline;
  setToStorage(STORAGE_KEYS.PIPELINES, pipelines);
  
  return updatedPipeline;
};

export const deletePipeline = (id: string): boolean => {
  const pipelines = getPipelines();
  const filteredPipelines = pipelines.filter(pipeline => pipeline.id !== id);
  
  if (filteredPipelines.length === pipelines.length) return false;
  
  setToStorage(STORAGE_KEYS.PIPELINES, filteredPipelines);
  return true;
};

// Deal API
export const getDeals = (): Deal[] => {
  const pipelines = getPipelines();
  const deals: Deal[] = [];
  
  pipelines.forEach(pipeline => {
    pipeline.stages.forEach(stage => {
      deals.push(...stage.deals);
    });
  });
  
  return deals;
};

export const getDeal = (id: string): Deal | undefined => {
  const deals = getDeals();
  return deals.find(deal => deal.id === id);
};

export const createDeal = (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal | undefined => {
  const pipelines = getPipelines();
  const pipelineIndex = pipelines.findIndex(p => p.id === deal.pipelineId);
  
  if (pipelineIndex === -1) return undefined;
  
  const stageIndex = pipelines[pipelineIndex].stages.findIndex(s => s.id === deal.stageId);
  
  if (stageIndex === -1) return undefined;
  
  const now = new Date().toISOString();
  
  const newDeal: Deal = {
    ...deal,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    history: [
      {
        id: uuidv4(),
        dealId: '',
        stageId: deal.stageId,
        stageName: pipelines[pipelineIndex].stages[stageIndex].name,
        date: now,
        userId: deal.ownerId,
        userName: 'Current User', // This would normally come from a user lookup
      }
    ],
    products: deal.products || [],
    activities: deal.activities || [],
    emails: deal.emails || [],
    tags: deal.tags || [],
    customFields: deal.customFields || {},
  };
  
  // Update the dealId in the history entry after we have the deal ID
  newDeal.history[0].dealId = newDeal.id;
  
  // Add the deal to the appropriate stage
  pipelines[pipelineIndex].stages[stageIndex].deals.push(newDeal);
  setToStorage(STORAGE_KEYS.PIPELINES, pipelines);
  
  return newDeal;
};

export const updateDeal = (id: string, dealUpdate: Partial<Deal>): Deal | undefined => {
  const pipelines = getPipelines();
  let foundDeal: Deal | undefined;
  let foundPipelineIndex = -1;
  let foundStageIndex = -1;
  let foundDealIndex = -1;
  
  // Find the deal in the pipeline stages
  for (let pi = 0; pi < pipelines.length; pi++) {
    for (let si = 0; si < pipelines[pi].stages.length; si++) {
      const di = pipelines[pi].stages[si].deals.findIndex(d => d.id === id);
      if (di !== -1) {
        foundDeal = pipelines[pi].stages[si].deals[di];
        foundPipelineIndex = pi;
        foundStageIndex = si;
        foundDealIndex = di;
        break;
      }
    }
    if (foundDeal) break;
  }
  
  if (!foundDeal) return undefined;
  
  const now = new Date().toISOString();
  
  // Handle stage change
  if (dealUpdate.stageId && dealUpdate.stageId !== foundDeal.stageId) {
    // Find the target stage
    let targetPipelineIndex = foundPipelineIndex;
    
    // If the pipeline is also changing, update the target pipeline index
    if (dealUpdate.pipelineId && dealUpdate.pipelineId !== foundDeal.pipelineId) {
      targetPipelineIndex = pipelines.findIndex(p => p.id === dealUpdate.pipelineId);
      if (targetPipelineIndex === -1) return undefined;
    }
    
    const targetStageIndex = pipelines[targetPipelineIndex].stages.findIndex(s => s.id === dealUpdate.stageId);
    if (targetStageIndex === -1) return undefined;
    
    // Add history entry for stage change
    const historyEntry = {
      id: uuidv4(),
      dealId: id,
      stageId: dealUpdate.stageId,
      stageName: pipelines[targetPipelineIndex].stages[targetStageIndex].name,
      date: now,
      userId: foundDeal.ownerId, // This would normally be the current user ID
      userName: 'Current User', // This would normally come from a user lookup
    };
    
    foundDeal.history = [...(foundDeal.history || []), historyEntry];
    
    // Remove the deal from the current stage
    pipelines[foundPipelineIndex].stages[foundStageIndex].deals.splice(foundDealIndex, 1);
    
    // Update the deal with new stage/pipeline and other updates
    const updatedDeal = {
      ...foundDeal,
      ...dealUpdate,
      updatedAt: now,
    };
    
    // Add the deal to the target stage
    pipelines[targetPipelineIndex].stages[targetStageIndex].deals.push(updatedDeal);
    
    setToStorage(STORAGE_KEYS.PIPELINES, pipelines);
    return updatedDeal;
  } else {
    // Regular update (no stage/pipeline change)
    const updatedDeal = {
      ...foundDeal,
      ...dealUpdate,
      updatedAt: now,
    };
    
    pipelines[foundPipelineIndex].stages[foundStageIndex].deals[foundDealIndex] = updatedDeal;
    setToStorage(STORAGE_KEYS.PIPELINES, pipelines);
    return updatedDeal;
  }
};

export const deleteDeal = (id: string): boolean => {
  const pipelines = getPipelines();
  let deleted = false;
  
  for (let pi = 0; !deleted && pi < pipelines.length; pi++) {
    for (let si = 0; !deleted && si < pipelines[pi].stages.length; si++) {
      const initialLength = pipelines[pi].stages[si].deals.length;
      pipelines[pi].stages[si].deals = pipelines[pi].stages[si].deals.filter(d => d.id !== id);
      
      if (pipelines[pi].stages[si].deals.length < initialLength) {
        deleted = true;
      }
    }
  }
  
  if (deleted) {
    setToStorage(STORAGE_KEYS.PIPELINES, pipelines);
  }
  
  return deleted;
};

// Contact API
export const getContacts = (): Contact[] => getFromStorage<Contact[]>(STORAGE_KEYS.CONTACTS, []);
export const getContact = (id: string): Contact | undefined => {
  const contacts = getContacts();
  return contacts.find(contact => contact.id === id);
};

export const createContact = (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact => {
  const contacts = getContacts();
  const now = new Date().toISOString();
  
  const newContact: Contact = {
    ...contact,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    tags: contact.tags || [],
    customFields: contact.customFields || {},
  };
  
  setToStorage(STORAGE_KEYS.CONTACTS, [...contacts, newContact]);
  return newContact;
};

export const updateContact = (id: string, contact: Partial<Contact>): Contact | undefined => {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  
  if (index === -1) return undefined;
  
  const updatedContact = {
    ...contacts[index],
    ...contact,
    updatedAt: new Date().toISOString(),
  };
  
  contacts[index] = updatedContact;
  setToStorage(STORAGE_KEYS.CONTACTS, contacts);
  
  return updatedContact;
};

export const deleteContact = (id: string): boolean => {
  const contacts = getContacts();
  const filteredContacts = contacts.filter(contact => contact.id !== id);
  
  if (filteredContacts.length === contacts.length) return false;
  
  setToStorage(STORAGE_KEYS.CONTACTS, filteredContacts);
  return true;
};

// Organization API
export const getOrganizations = (): Organization[] => getFromStorage<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, []);
export const getOrganization = (id: string): Organization | undefined => {
  const organizations = getOrganizations();
  return organizations.find(org => org.id === id);
};

export const createOrganization = (organization: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Organization => {
  const organizations = getOrganizations();
  const now = new Date().toISOString();
  
  const newOrganization: Organization = {
    ...organization,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    tags: organization.tags || [],
    customFields: organization.customFields || {},
  };
  
  setToStorage(STORAGE_KEYS.ORGANIZATIONS, [...organizations, newOrganization]);
  return newOrganization;
};

export const updateOrganization = (id: string, organization: Partial<Organization>): Organization | undefined => {
  const organizations = getOrganizations();
  const index = organizations.findIndex(org => org.id === id);
  
  if (index === -1) return undefined;
  
  const updatedOrganization = {
    ...organizations[index],
    ...organization,
    updatedAt: new Date().toISOString(),
  };
  
  organizations[index] = updatedOrganization;
  setToStorage(STORAGE_KEYS.ORGANIZATIONS, organizations);
  
  return updatedOrganization;
};

export const deleteOrganization = (id: string): boolean => {
  const organizations = getOrganizations();
  const filteredOrganizations = organizations.filter(org => org.id !== id);
  
  if (filteredOrganizations.length === organizations.length) return false;
  
  setToStorage(STORAGE_KEYS.ORGANIZATIONS, filteredOrganizations);
  
  // Update contacts that belong to this organization
  const contacts = getContacts();
  const updatedContacts = contacts.map(contact => {
    if (contact.organizationId === id) {
      return {
        ...contact,
        organizationId: undefined,
        updatedAt: new Date().toISOString(),
      };
    }
    return contact;
  });
  
  setToStorage(STORAGE_KEYS.CONTACTS, updatedContacts);
  
  return true;
};

// Activity API
export const getActivities = (): Activity[] => getFromStorage<Activity[]>(STORAGE_KEYS.ACTIVITIES, []);
export const getActivity = (id: string): Activity | undefined => {
  const activities = getActivities();
  return activities.find(activity => activity.id === id);
};

export const createActivity = (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Activity => {
  const activities = getActivities();
  const now = new Date().toISOString();
  
  const newActivity: Activity = {
    ...activity,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    isDone: activity.isDone || false,
    isRecurring: activity.isRecurring || false,
  };
  
  setToStorage(STORAGE_KEYS.ACTIVITIES, [...activities, newActivity]);
  return newActivity;
};

export const updateActivity = (id: string, activity: Partial<Activity>): Activity | undefined => {
  const activities = getActivities();
  const index = activities.findIndex(a => a.id === id);
  
  if (index === -1) return undefined;
  
  const updatedActivity = {
    ...activities[index],
    ...activity,
    updatedAt: new Date().toISOString(),
  };
  
  activities[index] = updatedActivity;
  setToStorage(STORAGE_KEYS.ACTIVITIES, activities);
  
  return updatedActivity;
};

export const deleteActivity = (id: string): boolean => {
  const activities = getActivities();
  const filteredActivities = activities.filter(activity => activity.id !== id);
  
  if (filteredActivities.length === activities.length) return false;
  
  setToStorage(STORAGE_KEYS.ACTIVITIES, filteredActivities);
  return true;
};

// Email API
export const getEmails = (): Email[] => getFromStorage<Email[]>(STORAGE_KEYS.EMAILS, []);
export const getEmail = (id: string): Email | undefined => {
  const emails = getEmails();
  return emails.find(email => email.id === id);
};

export const createEmail = (email: Omit<Email, 'id' | 'createdAt' | 'updatedAt'>): Email => {
  const emails = getEmails();
  const now = new Date().toISOString();
  
  const newEmail: Email = {
    ...email,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    opens: 0,
    clicks: 0,
  };
  
  setToStorage(STORAGE_KEYS.EMAILS, [...emails, newEmail]);
  return newEmail;
};

export const updateEmail = (id: string, email: Partial<Email>): Email | undefined => {
  const emails = getEmails();
  const index = emails.findIndex(e => e.id === id);
  
  if (index === -1) return undefined;
  
  const updatedEmail = {
    ...emails[index],
    ...email,
    updatedAt: new Date().toISOString(),
  };
  
  emails[index] = updatedEmail;
  setToStorage(STORAGE_KEYS.EMAILS, emails);
  
  return updatedEmail;
};

export const deleteEmail = (id: string): boolean => {
  const emails = getEmails();
  const filteredEmails = emails.filter(email => email.id !== id);
  
  if (filteredEmails.length === emails.length) return false;
  
  setToStorage(STORAGE_KEYS.EMAILS, filteredEmails);
  return true;
};

// Email Template API
export const getEmailTemplates = (): EmailTemplate[] => getFromStorage<EmailTemplate[]>(STORAGE_KEYS.EMAIL_TEMPLATES, []);
export const getEmailTemplate = (id: string): EmailTemplate | undefined => {
  const templates = getEmailTemplates();
  return templates.find(template => template.id === id);
};

export const createEmailTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): EmailTemplate => {
  const templates = getEmailTemplates();
  const now = new Date().toISOString();
  
  const newTemplate: EmailTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  setToStorage(STORAGE_KEYS.EMAIL_TEMPLATES, [...templates, newTemplate]);
  return newTemplate;
};

export const updateEmailTemplate = (id: string, template: Partial<EmailTemplate>): EmailTemplate | undefined => {
  const templates = getEmailTemplates();
  const index = templates.findIndex(t => t.id === id);
  
  if (index === -1) return undefined;
  
  const updatedTemplate = {
    ...templates[index],
    ...template,
    updatedAt: new Date().toISOString(),
  };
  
  templates[index] = updatedTemplate;
  setToStorage(STORAGE_KEYS.EMAIL_TEMPLATES, templates);
  
  return updatedTemplate;
};

export const deleteEmailTemplate = (id: string): boolean => {
  const templates = getEmailTemplates();
  const filteredTemplates = templates.filter(template => template.id !== id);
  
  if (filteredTemplates.length === templates.length) return false;
  
  setToStorage(STORAGE_KEYS.EMAIL_TEMPLATES, filteredTemplates);
  return true;
};

// Lead API
export const getLeads = (): Lead[] => getFromStorage<Lead[]>(STORAGE_KEYS.LEADS, []);
export const getLead = (id: string): Lead | undefined => {
  const leads = getLeads();
  return leads.find(lead => lead.id === id);
};

export const createLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead => {
  const leads = getLeads();
  const now = new Date().toISOString();
  
  const newLead: Lead = {
    ...lead,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    tags: lead.tags || [],
    customFields: lead.customFields || {},
  };
  
  setToStorage(STORAGE_KEYS.LEADS, [...leads, newLead]);
  return newLead;
};

export const updateLead = (id: string, lead: Partial<Lead>): Lead | undefined => {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  
  if (index === -1) return undefined;
  
  const updatedLead = {
    ...leads[index],
    ...lead,
    updatedAt: new Date().toISOString(),
  };
  
  leads[index] = updatedLead;
  setToStorage(STORAGE_KEYS.LEADS, leads);
  
  return updatedLead;
};

export const deleteLead = (id: string): boolean => {
  const leads = getLeads();
  const filteredLeads = leads.filter(lead => lead.id !== id);
  
  if (filteredLeads.length === leads.length) return false;
  
  setToStorage(STORAGE_KEYS.LEADS, filteredLeads);
  return true;
};

// Convert lead to contact and deal
export const convertLead = (
  leadId: string, 
  dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'contactIds'>
): { contact: Contact; deal: Deal } | undefined => {
  const lead = getLead(leadId);
  if (!lead) return undefined;
  
  // Create contact from lead
  const contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    ownerId: lead.ownerId,
    tags: lead.tags,
    customFields: lead.customFields,
  };
  
  const contact = createContact(contactData);
  
  // Create deal with the new contact
  const completeData = {
    ...dealData,
    contactIds: [contact.id],
  };
  
  const deal = createDeal(completeData);
  
  if (!deal) {
    // If deal creation fails, clean up by deleting the contact
    deleteContact(contact.id);
    return undefined;
  }
  
  // Delete the lead
  deleteLead(leadId);
  
  return { contact, deal };
};

// Product API
export const getProducts = (): Product[] => getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
export const getProduct = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

export const createProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const products = getProducts();
  const now = new Date().toISOString();
  
  const newProduct: Product = {
    ...product,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  setToStorage(STORAGE_KEYS.PRODUCTS, [...products, newProduct]);
  return newProduct;
};

export const updateProduct = (id: string, product: Partial<Product>): Product | undefined => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) return undefined;
  
  const updatedProduct = {
    ...products[index],
    ...product,
    updatedAt: new Date().toISOString(),
  };
  
  products[index] = updatedProduct;
  setToStorage(STORAGE_KEYS.PRODUCTS, products);
  
  return updatedProduct;
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  
  if (filteredProducts.length === products.length) return false;
  
  setToStorage(STORAGE_KEYS.PRODUCTS, filteredProducts);
  return true;
};

// Automation API
export const getAutomations = (): Automation[] => getFromStorage<Automation[]>(STORAGE_KEYS.AUTOMATIONS, []);
export const getAutomation = (id: string): Automation | undefined => {
  const automations = getAutomations();
  return automations.find(automation => automation.id === id);
};

export const createAutomation = (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>): Automation => {
  const automations = getAutomations();
  const now = new Date().toISOString();
  
  const newAutomation: Automation = {
    ...automation,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  setToStorage(STORAGE_KEYS.AUTOMATIONS, [...automations, newAutomation]);
  return newAutomation;
};

export const updateAutomation = (id: string, automation: Partial<Automation>): Automation | undefined => {
  const automations = getAutomations();
  const index = automations.findIndex(a => a.id === id);
  
  if (index === -1) return undefined;
  
  const updatedAutomation = {
    ...automations[index],
    ...automation,
    updatedAt: new Date().toISOString(),
  };
  
  automations[index] = updatedAutomation;
  setToStorage(STORAGE_KEYS.AUTOMATIONS, automations);
  
  return updatedAutomation;
};

export const deleteAutomation = (id: string): boolean => {
  const automations = getAutomations();
  const filteredAutomations = automations.filter(automation => automation.id !== id);
  
  if (filteredAutomations.length === automations.length) return false;
  
  setToStorage(STORAGE_KEYS.AUTOMATIONS, filteredAutomations);
  return true;
};

// Custom Field API
export const getCustomFields = (): CustomField[] => getFromStorage<CustomField[]>(STORAGE_KEYS.CUSTOM_FIELDS, []);
export const getCustomFieldsByEntityType = (entityType: CustomField['entityType']): CustomField[] => {
  const customFields = getCustomFields();
  return customFields.filter(field => field.entityType === entityType);
};

export const getCustomField = (id: string): CustomField | undefined => {
  const customFields = getCustomFields();
  return customFields.find(field => field.id === id);
};

export const createCustomField = (field: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>): CustomField => {
  const customFields = getCustomFields();
  const now = new Date().toISOString();
  
  const newField: CustomField = {
    ...field,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  setToStorage(STORAGE_KEYS.CUSTOM_FIELDS, [...customFields, newField]);
  return newField;
};

export const updateCustomField = (id: string, field: Partial<CustomField>): CustomField | undefined => {
  const customFields = getCustomFields();
  const index = customFields.findIndex(f => f.id === id);
  
  if (index === -1) return undefined;
  
  const updatedField = {
    ...customFields[index],
    ...field,
    updatedAt: new Date().toISOString(),
  };
  
  customFields[index] = updatedField;
  setToStorage(STORAGE_KEYS.CUSTOM_FIELDS, customFields);
  
  return updatedField;
};

export const deleteCustomField = (id: string): boolean => {
  const customFields = getCustomFields();
  const filteredCustomFields = customFields.filter(field => field.id !== id);
  
  if (filteredCustomFields.length === customFields.length) return false;
  
  setToStorage(STORAGE_KEYS.CUSTOM_FIELDS, filteredCustomFields);
  return true;
};

// Dashboard Widget API
export const getDashboardWidgets = (): DashboardWidget[] => getFromStorage<DashboardWidget[]>(STORAGE_KEYS.DASHBOARD_WIDGETS, []);
export const getDashboardWidget = (id: string): DashboardWidget | undefined => {
  const widgets = getDashboardWidgets();
  return widgets.find(widget => widget.id === id);
};

export const createDashboardWidget = (widget: Omit<DashboardWidget, 'id'>): DashboardWidget => {
  const widgets = getDashboardWidgets();
  
  const newWidget: DashboardWidget = {
    ...widget,
    id: uuidv4(),
  };
  
  setToStorage(STORAGE_KEYS.DASHBOARD_WIDGETS, [...widgets, newWidget]);
  return newWidget;
};

export const updateDashboardWidget = (id: string, widget: Partial<DashboardWidget>): DashboardWidget | undefined => {
  const widgets = getDashboardWidgets();
  const index = widgets.findIndex(w => w.id === id);
  
  if (index === -1) return undefined;
  
  const updatedWidget = {
    ...widgets[index],
    ...widget,
  };
  
  widgets[index] = updatedWidget;
  setToStorage(STORAGE_KEYS.DASHBOARD_WIDGETS, widgets);
  
  return updatedWidget;
};

export const deleteDashboardWidget = (id: string): boolean => {
  const widgets = getDashboardWidgets();
  const filteredWidgets = widgets.filter(widget => widget.id !== id);
  
  if (filteredWidgets.length === widgets.length) return false;
  
  setToStorage(STORAGE_KEYS.DASHBOARD_WIDGETS, filteredWidgets);
  return true;
};