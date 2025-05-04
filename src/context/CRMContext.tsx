import React, { createContext, useState, useEffect, useContext } from 'react';
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

import * as localStorage from '../utils/localStorage';

interface CRMContextProps {
  // User
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User) => void;
  
  // Pipelines and Deals
  pipelines: Pipeline[];
  deals: Deal[];
  getPipeline: (id: string) => Pipeline | undefined;
  getDeal: (id: string) => Deal | undefined;
  createPipeline: (pipeline: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>) => Pipeline;
  updatePipeline: (id: string, pipeline: Partial<Pipeline>) => Pipeline | undefined;
  deletePipeline: (id: string) => boolean;
  createDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Deal | undefined;
  updateDeal: (id: string, deal: Partial<Deal>) => Deal | undefined;
  deleteDeal: (id: string) => boolean;
  
  // Contacts and Organizations
  contacts: Contact[];
  organizations: Organization[];
  getContact: (id: string) => Contact | undefined;
  getOrganization: (id: string) => Organization | undefined;
  createContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, contact: Partial<Contact>) => Contact | undefined;
  deleteContact: (id: string) => boolean;
  createOrganization: (org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>) => Organization;
  updateOrganization: (id: string, org: Partial<Organization>) => Organization | undefined;
  deleteOrganization: (id: string) => boolean;
  
  // Activities
  activities: Activity[];
  getActivity: (id: string) => Activity | undefined;
  createActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => Activity;
  updateActivity: (id: string, activity: Partial<Activity>) => Activity | undefined;
  deleteActivity: (id: string) => boolean;
  
  // Emails
  emails: Email[];
  emailTemplates: EmailTemplate[];
  getEmail: (id: string) => Email | undefined;
  getEmailTemplate: (id: string) => EmailTemplate | undefined;
  createEmail: (email: Omit<Email, 'id' | 'createdAt' | 'updatedAt'>) => Email;
  updateEmail: (id: string, email: Partial<Email>) => Email | undefined;
  deleteEmail: (id: string) => boolean;
  createEmailTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => EmailTemplate;
  updateEmailTemplate: (id: string, template: Partial<EmailTemplate>) => EmailTemplate | undefined;
  deleteEmailTemplate: (id: string) => boolean;
  
  // Leads
  leads: Lead[];
  getLead: (id: string) => Lead | undefined;
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, lead: Partial<Lead>) => Lead | undefined;
  deleteLead: (id: string) => boolean;
  convertLead: (
    leadId: string, 
    dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'contactIds'>
  ) => { contact: Contact; deal: Deal } | undefined;
  
  // Products
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => Product | undefined;
  deleteProduct: (id: string) => boolean;
  
  // Automations
  automations: Automation[];
  getAutomation: (id: string) => Automation | undefined;
  createAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => Automation;
  updateAutomation: (id: string, automation: Partial<Automation>) => Automation | undefined;
  deleteAutomation: (id: string) => boolean;
  
  // Custom Fields
  customFields: CustomField[];
  getCustomField: (id: string) => CustomField | undefined;
  getCustomFieldsByEntityType: (entityType: CustomField['entityType']) => CustomField[];
  createCustomField: (field: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>) => CustomField;
  updateCustomField: (id: string, field: Partial<CustomField>) => CustomField | undefined;
  deleteCustomField: (id: string) => boolean;
  
  // Dashboard Widgets
  dashboardWidgets: DashboardWidget[];
  getDashboardWidget: (id: string) => DashboardWidget | undefined;
  createDashboardWidget: (widget: Omit<DashboardWidget, 'id'>) => DashboardWidget;
  updateDashboardWidget: (id: string, widget: Partial<DashboardWidget>) => DashboardWidget | undefined;
  deleteDashboardWidget: (id: string) => boolean;
  
  // Data Refresh
  refreshData: () => void;
  loading: boolean;
}

const CRMContext = createContext<CRMContextProps | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data from localStorage
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      
      localStorage.initializeStorage();
      
      setCurrentUser(localStorage.getCurrentUser());
      setUsers(localStorage.getUsers());
      setPipelines(localStorage.getPipelines());
      setContacts(localStorage.getContacts());
      setOrganizations(localStorage.getOrganizations());
      setActivities(localStorage.getActivities());
      setEmails(localStorage.getEmails());
      setEmailTemplates(localStorage.getEmailTemplates());
      setLeads(localStorage.getLeads());
      setProducts(localStorage.getProducts());
      setAutomations(localStorage.getAutomations());
      setCustomFields(localStorage.getCustomFields());
      setDashboardWidgets(localStorage.getDashboardWidgets());
      
      setLoading(false);
    };
    
    initData();
  }, []);

  // Refresh all data
  const refreshData = () => {
    setLoading(true);
    
    setCurrentUser(localStorage.getCurrentUser());
    setUsers(localStorage.getUsers());
    setPipelines(localStorage.getPipelines());
    setContacts(localStorage.getContacts());
    setOrganizations(localStorage.getOrganizations());
    setActivities(localStorage.getActivities());
    setEmails(localStorage.getEmails());
    setEmailTemplates(localStorage.getEmailTemplates());
    setLeads(localStorage.getLeads());
    setProducts(localStorage.getProducts());
    setAutomations(localStorage.getAutomations());
    setCustomFields(localStorage.getCustomFields());
    setDashboardWidgets(localStorage.getDashboardWidgets());
    
    setLoading(false);
  };

  // Extract deals from pipelines for easier access
  const deals = pipelines.flatMap(pipeline => 
    pipeline.stages.flatMap(stage => stage.deals)
  );

  // User methods
  const handleSetCurrentUser = (user: User) => {
    localStorage.setCurrentUser(user);
    setCurrentUser(user);
  };

  // Pipeline methods
  const handleGetPipeline = (id: string) => {
    return localStorage.getPipeline(id);
  };

  const handleCreatePipeline = (pipeline: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPipeline = localStorage.createPipeline(pipeline);
    refreshData();
    return newPipeline;
  };

  const handleUpdatePipeline = (id: string, pipeline: Partial<Pipeline>) => {
    const updatedPipeline = localStorage.updatePipeline(id, pipeline);
    refreshData();
    return updatedPipeline;
  };

  const handleDeletePipeline = (id: string) => {
    const result = localStorage.deletePipeline(id);
    refreshData();
    return result;
  };

  // Deal methods
  const handleGetDeal = (id: string) => {
    return localStorage.getDeal(id);
  };

  const handleCreateDeal = (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeal = localStorage.createDeal(deal);
    refreshData();
    return newDeal;
  };

  const handleUpdateDeal = (id: string, deal: Partial<Deal>) => {
    const updatedDeal = localStorage.updateDeal(id, deal);
    refreshData();
    return updatedDeal;
  };

  const handleDeleteDeal = (id: string) => {
    const result = localStorage.deleteDeal(id);
    refreshData();
    return result;
  };

  // Contact methods
  const handleGetContact = (id: string) => {
    return localStorage.getContact(id);
  };

  const handleCreateContact = (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContact = localStorage.createContact(contact);
    refreshData();
    return newContact;
  };

  const handleUpdateContact = (id: string, contact: Partial<Contact>) => {
    const updatedContact = localStorage.updateContact(id, contact);
    refreshData();
    return updatedContact;
  };

  const handleDeleteContact = (id: string) => {
    const result = localStorage.deleteContact(id);
    refreshData();
    return result;
  };

  // Organization methods
  const handleGetOrganization = (id: string) => {
    return localStorage.getOrganization(id);
  };

  const handleCreateOrganization = (org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrg = localStorage.createOrganization(org);
    refreshData();
    return newOrg;
  };

  const handleUpdateOrganization = (id: string, org: Partial<Organization>) => {
    const updatedOrg = localStorage.updateOrganization(id, org);
    refreshData();
    return updatedOrg;
  };

  const handleDeleteOrganization = (id: string) => {
    const result = localStorage.deleteOrganization(id);
    refreshData();
    return result;
  };

  // Activity methods
  const handleGetActivity = (id: string) => {
    return localStorage.getActivity(id);
  };

  const handleCreateActivity = (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newActivity = localStorage.createActivity(activity);
    refreshData();
    return newActivity;
  };

  const handleUpdateActivity = (id: string, activity: Partial<Activity>) => {
    const updatedActivity = localStorage.updateActivity(id, activity);
    refreshData();
    return updatedActivity;
  };

  const handleDeleteActivity = (id: string) => {
    const result = localStorage.deleteActivity(id);
    refreshData();
    return result;
  };

  // Email methods
  const handleGetEmail = (id: string) => {
    return localStorage.getEmail(id);
  };

  const handleCreateEmail = (email: Omit<Email, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEmail = localStorage.createEmail(email);
    refreshData();
    return newEmail;
  };

  const handleUpdateEmail = (id: string, email: Partial<Email>) => {
    const updatedEmail = localStorage.updateEmail(id, email);
    refreshData();
    return updatedEmail;
  };

  const handleDeleteEmail = (id: string) => {
    const result = localStorage.deleteEmail(id);
    refreshData();
    return result;
  };

  // Email Template methods
  const handleGetEmailTemplate = (id: string) => {
    return localStorage.getEmailTemplate(id);
  };

  const handleCreateEmailTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate = localStorage.createEmailTemplate(template);
    refreshData();
    return newTemplate;
  };

  const handleUpdateEmailTemplate = (id: string, template: Partial<EmailTemplate>) => {
    const updatedTemplate = localStorage.updateEmailTemplate(id, template);
    refreshData();
    return updatedTemplate;
  };

  const handleDeleteEmailTemplate = (id: string) => {
    const result = localStorage.deleteEmailTemplate(id);
    refreshData();
    return result;
  };

  // Lead methods
  const handleGetLead = (id: string) => {
    return localStorage.getLead(id);
  };

  const handleCreateLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead = localStorage.createLead(lead);
    refreshData();
    return newLead;
  };

  const handleUpdateLead = (id: string, lead: Partial<Lead>) => {
    const updatedLead = localStorage.updateLead(id, lead);
    refreshData();
    return updatedLead;
  };

  const handleDeleteLead = (id: string) => {
    const result = localStorage.deleteLead(id);
    refreshData();
    return result;
  };

  // Convert lead to contact and deal
  const handleConvertLead = (
    leadId: string, 
    dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'contactIds'>
  ) => {
    const result = localStorage.convertLead(leadId, dealData);
    refreshData();
    return result;
  };

  // Product methods
  const handleGetProduct = (id: string) => {
    return localStorage.getProduct(id);
  };

  const handleCreateProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct = localStorage.createProduct(product);
    refreshData();
    return newProduct;
  };

  const handleUpdateProduct = (id: string, product: Partial<Product>) => {
    const updatedProduct = localStorage.updateProduct(id, product);
    refreshData();
    return updatedProduct;
  };

  const handleDeleteProduct = (id: string) => {
    const result = localStorage.deleteProduct(id);
    refreshData();
    return result;
  };

  // Automation methods
  const handleGetAutomation = (id: string) => {
    return localStorage.getAutomation(id);
  };

  const handleCreateAutomation = (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAutomation = localStorage.createAutomation(automation);
    refreshData();
    return newAutomation;
  };

  const handleUpdateAutomation = (id: string, automation: Partial<Automation>) => {
    const updatedAutomation = localStorage.updateAutomation(id, automation);
    refreshData();
    return updatedAutomation;
  };

  const handleDeleteAutomation = (id: string) => {
    const result = localStorage.deleteAutomation(id);
    refreshData();
    return result;
  };

  // Custom Field methods
  const handleGetCustomField = (id: string) => {
    return localStorage.getCustomField(id);
  };

  const handleGetCustomFieldsByEntityType = (entityType: CustomField['entityType']) => {
    return localStorage.getCustomFieldsByEntityType(entityType);
  };

  const handleCreateCustomField = (field: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newField = localStorage.createCustomField(field);
    refreshData();
    return newField;
  };

  const handleUpdateCustomField = (id: string, field: Partial<CustomField>) => {
    const updatedField = localStorage.updateCustomField(id, field);
    refreshData();
    return updatedField;
  };

  const handleDeleteCustomField = (id: string) => {
    const result = localStorage.deleteCustomField(id);
    refreshData();
    return result;
  };

  // Dashboard Widget methods
  const handleGetDashboardWidget = (id: string) => {
    return localStorage.getDashboardWidget(id);
  };

  const handleCreateDashboardWidget = (widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget = localStorage.createDashboardWidget(widget);
    refreshData();
    return newWidget;
  };

  const handleUpdateDashboardWidget = (id: string, widget: Partial<DashboardWidget>) => {
    const updatedWidget = localStorage.updateDashboardWidget(id, widget);
    refreshData();
    return updatedWidget;
  };

  const handleDeleteDashboardWidget = (id: string) => {
    const result = localStorage.deleteDashboardWidget(id);
    refreshData();
    return result;
  };

  const value = {
    // User
    currentUser,
    users,
    setCurrentUser: handleSetCurrentUser,
    
    // Pipelines and Deals
    pipelines,
    deals,
    getPipeline: handleGetPipeline,
    getDeal: handleGetDeal,
    createPipeline: handleCreatePipeline,
    updatePipeline: handleUpdatePipeline,
    deletePipeline: handleDeletePipeline,
    createDeal: handleCreateDeal,
    updateDeal: handleUpdateDeal,
    deleteDeal: handleDeleteDeal,
    
    // Contacts and Organizations
    contacts,
    organizations,
    getContact: handleGetContact,
    getOrganization: handleGetOrganization,
    createContact: handleCreateContact,
    updateContact: handleUpdateContact,
    deleteContact: handleDeleteContact,
    createOrganization: handleCreateOrganization,
    updateOrganization: handleUpdateOrganization,
    deleteOrganization: handleDeleteOrganization,
    
    // Activities
    activities,
    getActivity: handleGetActivity,
    createActivity: handleCreateActivity,
    updateActivity: handleUpdateActivity,
    deleteActivity: handleDeleteActivity,
    
    // Emails
    emails,
    emailTemplates,
    getEmail: handleGetEmail,
    getEmailTemplate: handleGetEmailTemplate,
    createEmail: handleCreateEmail,
    updateEmail: handleUpdateEmail,
    deleteEmail: handleDeleteEmail,
    createEmailTemplate: handleCreateEmailTemplate,
    updateEmailTemplate: handleUpdateEmailTemplate,
    deleteEmailTemplate: handleDeleteEmailTemplate,
    
    // Leads
    leads,
    getLead: handleGetLead,
    createLead: handleCreateLead,
    updateLead: handleUpdateLead,
    deleteLead: handleDeleteLead,
    convertLead: handleConvertLead,
    
    // Products
    products,
    getProduct: handleGetProduct,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    
    // Automations
    automations,
    getAutomation: handleGetAutomation,
    createAutomation: handleCreateAutomation,
    updateAutomation: handleUpdateAutomation,
    deleteAutomation: handleDeleteAutomation,
    
    // Custom Fields
    customFields,
    getCustomField: handleGetCustomField,
    getCustomFieldsByEntityType: handleGetCustomFieldsByEntityType,
    createCustomField: handleCreateCustomField,
    updateCustomField: handleUpdateCustomField,
    deleteCustomField: handleDeleteCustomField,
    
    // Dashboard Widgets
    dashboardWidgets,
    getDashboardWidget: handleGetDashboardWidget,
    createDashboardWidget: handleCreateDashboardWidget,
    updateDashboardWidget: handleUpdateDashboardWidget,
    deleteDashboardWidget: handleDeleteDashboardWidget,
    
    // Data Refresh
    refreshData,
    loading,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};