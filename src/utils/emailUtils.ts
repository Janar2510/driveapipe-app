import { User, Contact, Organization, Deal, EmailTemplate } from '../types';

export const replaceTemplateTokens = (
  template: EmailTemplate,
  user?: User | null,
  contact?: Contact,
  organization?: Organization,
  deal?: Deal
): { subject: string; body: string } => {
  let subject = template.subject;
  let body = template.body;
  
  // Replace user tokens
  if (user) {
    subject = subject.replace(/{{user\.name}}/g, user.name);
    subject = subject.replace(/{{user\.email}}/g, user.email);
    
    body = body.replace(/{{user\.name}}/g, user.name);
    body = body.replace(/{{user\.email}}/g, user.email);
  }
  
  // Replace contact tokens
  if (contact) {
    subject = subject.replace(/{{contact\.name}}/g, contact.name);
    subject = subject.replace(/{{contact\.email}}/g, contact.email || '');
    
    body = body.replace(/{{contact\.name}}/g, contact.name);
    body = body.replace(/{{contact\.email}}/g, contact.email || '');
    
    if (contact.phone) {
      subject = subject.replace(/{{contact\.phone}}/g, contact.phone);
      body = body.replace(/{{contact\.phone}}/g, contact.phone);
    }
  }
  
  // Replace organization tokens
  if (organization) {
    subject = subject.replace(/{{organization\.name}}/g, organization.name);
    body = body.replace(/{{organization\.name}}/g, organization.name);
    
    if (organization.website) {
      subject = subject.replace(/{{organization\.website}}/g, organization.website);
      body = body.replace(/{{organization\.website}}/g, organization.website);
    }
    
    if (organization.address) {
      subject = subject.replace(/{{organization\.address}}/g, organization.address);
      body = body.replace(/{{organization\.address}}/g, organization.address);
    }
  }
  
  // Replace deal tokens
  if (deal) {
    subject = subject.replace(/{{deal\.title}}/g, deal.title);
    subject = subject.replace(/{{deal\.value}}/g, deal.value.toString());
    
    body = body.replace(/{{deal\.title}}/g, deal.title);
    body = body.replace(/{{deal\.value}}/g, deal.value.toString());
    
    // Format currency and value together
    const formattedValue = `${deal.currency} ${deal.value.toLocaleString()}`;
    subject = subject.replace(/{{deal\.formatted_value}}/g, formattedValue);
    body = body.replace(/{{deal\.formatted_value}}/g, formattedValue);
  }
  
  return { subject, body };
};

export const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const parseEmails = (emailString: string): string[] => {
  if (!emailString) return [];
  
  return emailString
    .split(',')
    .map(email => email.trim())
    .filter(email => validateEmail(email));
};