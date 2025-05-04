import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCRM } from '../../context/CRMContext';
import { Email } from '../../types';
import { format } from 'date-fns';
import { replaceTemplateTokens } from '../../utils/emailUtils';

interface EmailFormProps {
  email?: Email;
  dealId?: string;
  contactId?: string;
  organizationId?: string;
  onClose: () => void;
}

interface EmailFormData {
  subject: string;
  body: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  status: 'draft' | 'sent' | 'scheduled';
  scheduledFor?: string;
  scheduledTime?: string;
  dealId?: string;
  contactId?: string;
  organizationId?: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ 
  email, 
  dealId, 
  contactId, 
  organizationId, 
  onClose 
}) => {
  const { currentUser, deals, contacts, organizations, emailTemplates, createEmail, updateEmail } = useCRM();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // If there's a scheduled date, format it for the form
  const defaultScheduledDate = email?.scheduledFor 
    ? format(new Date(email.scheduledFor), 'yyyy-MM-dd')
    : '';
  
  const defaultScheduledTime = email?.scheduledFor 
    ? format(new Date(email.scheduledFor), 'HH:mm')
    : '';
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<EmailFormData>({
    defaultValues: email ? {
      subject: email.subject,
      body: email.body,
      to: email.to,
      cc: email.cc,
      bcc: email.bcc,
      status: email.status,
      scheduledFor: defaultScheduledDate,
      scheduledTime: defaultScheduledTime,
      contactId: email.contactId,
      organizationId: email.organizationId,
      dealId: email.dealId,
    } : {
      to: [],
      status: 'draft',
      contactId,
      organizationId,
      dealId,
    },
  });
  
  const status = watch('status');
  const watchedContactId = watch('contactId');
  const watchedDealId = watch('dealId');
  const watchedOrganizationId = watch('organizationId');
  
  // Handle template selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (!templateId) return;
    
    const template = emailTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    // Get the selected entities for token replacement
    const selectedContact = watchedContactId ? contacts.find(c => c.id === watchedContactId) : undefined;
    const selectedDeal = watchedDealId ? deals.find(d => d.id === watchedDealId) : undefined;
    const selectedOrganization = watchedOrganizationId 
      ? organizations.find(o => o.id === watchedOrganizationId) 
      : undefined;
    
    // Replace tokens in template
    const { subject, body } = replaceTemplateTokens(
      template, 
      currentUser, 
      selectedContact, 
      selectedOrganization, 
      selectedDeal
    );
    
    setValue('subject', subject);
    setValue('body', body);
  };
  
  const onSubmit = async (data: EmailFormData) => {
    if (!currentUser) return;
    
    // Combine date and time for scheduledFor if needed
    let scheduledFor: string | undefined;
    if (data.status === 'scheduled' && data.scheduledFor && data.scheduledTime) {
      scheduledFor = new Date(`${data.scheduledFor}T${data.scheduledTime}`).toISOString();
    }
    
    const now = new Date().toISOString();
    
    if (email) {
      // Update existing email
      await updateEmail(email.id, {
        subject: data.subject,
        body: data.body,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        status: data.status,
        scheduledFor,
        sentAt: data.status === 'sent' ? now : email.sentAt,
        contactId: data.contactId || undefined,
        organizationId: data.organizationId || undefined,
        dealId: data.dealId || undefined,
      });
    } else {
      // Create new email
      const newEmail: Omit<Email, 'id' | 'createdAt' | 'updatedAt'> = {
        subject: data.subject,
        body: data.body,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        from: currentUser.email,
        status: data.status,
        scheduledFor,
        sentAt: data.status === 'sent' ? now : undefined,
        contactId: data.contactId || undefined,
        organizationId: data.organizationId || undefined,
        dealId: data.dealId || undefined,
        ownerId: currentUser.id,
        opens: 0,
        clicks: 0,
      };
      
      await createEmail(newEmail);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="template" className="block text-sm font-medium text-black">
          Email template
        </label>
        <select
          id="template"
          className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <option value="">Select a template</option>
          {emailTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
        <div>
          <label htmlFor="contactId" className="block text-sm font-medium text-black">
            Contact
          </label>
          <select
            id="contactId"
            className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
            {...register('contactId')}
          >
            <option value="">None</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="organizationId" className="block text-sm font-medium text-black">
            Organization
          </label>
          <select
            id="organizationId"
            className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
            {...register('organizationId')}
          >
            <option value="">None</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="dealId" className="block text-sm font-medium text-black">
            Deal
          </label>
          <select
            id="dealId"
            className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
            {...register('dealId')}
          >
            <option value="">None</option>
            {deals.map(deal => (
              <option key={deal.id} value={deal.id}>
                {deal.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="to" className="block text-sm font-medium text-black">
          To *
        </label>
        <input
          type="text"
          id="to"
          placeholder="recipient@example.com, another@example.com"
          className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
          {...register('to', { 
            required: 'At least one recipient is required',
            setValueAs: (value: string | string[]) => 
              Array.isArray(value) ? value : value.split(',').map(email => email.trim()),
          })}
        />
        {errors.to && (
          <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cc" className="block text-sm font-medium text-black">
            CC
          </label>
          <input
            type="text"
            id="cc"
            placeholder="cc@example.com"
            className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
            {...register('cc', { 
              setValueAs: (value: string | string[]) => 
                Array.isArray(value) ? value : value ? value.split(',').map(email => email.trim()) : undefined,
            })}
          />
        </div>
        
        <div>
          <label htmlFor="bcc" className="block text-sm font-medium text-black">
            BCC
          </label>
          <input
            type="text"
            id="bcc"
            placeholder="bcc@example.com"
            className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
            {...register('bcc', { 
              setValueAs: (value: string | string[]) => 
                Array.isArray(value) ? value : value ? value.split(',').map(email => email.trim()) : undefined,
            })}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-black">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
          {...register('subject', { required: 'Subject is required' })}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-black">
          Message *
        </label>
        <textarea
          id="body"
          rows={6}
          className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
          {...register('body', { required: 'Message body is required' })}
        ></textarea>
        {errors.body && (
          <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-black">
          Email status
        </label>
        <div className="mt-2 space-y-4">
          <div className="flex items-center">
            <input
              id="status-draft"
              type="radio"
              value="draft"
              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
              {...register('status')}
            />
            <label htmlFor="status-draft" className="ml-3 block text-sm font-medium text-black">
              Save as draft
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="status-send"
              type="radio"
              value="sent"
              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
              {...register('status')}
            />
            <label htmlFor="status-send" className="ml-3 block text-sm font-medium text-black">
              Send now
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="status-schedule"
              type="radio"
              value="scheduled"
              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
              {...register('status')}
            />
            <label htmlFor="status-schedule" className="ml-3 block text-sm font-medium text-black">
              Schedule for later
            </label>
          </div>
        </div>
      </div>
      
      {status === 'scheduled' && (
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="scheduledFor" className="block text-sm font-medium text-black">
              Date *
            </label>
            <input
              type="date"
              id="scheduledFor"
              className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
              {...register('scheduledFor', { 
                required: status === 'scheduled' ? 'Schedule date is required' : false, 
              })}
            />
            {errors.scheduledFor && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduledFor.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="scheduledTime" className="block text-sm font-medium text-black">
              Time *
            </label>
            <input
              type="time"
              id="scheduledTime"
              className="mt-1 block w-full rounded-md bg-white/5 py-1.5 text-black focus:ring-2 focus:ring-primary-500"
              {...register('scheduledTime', { 
                required: status === 'scheduled' ? 'Schedule time is required' : false, 
              })}
            />
            {errors.scheduledTime && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduledTime.message}</p>
            )}
          </div>
        </div>
      )}
      
      <div className="pt-5 flex justify-end space-x-3">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting 
            ? 'Saving...' 
            : status === 'sent' 
              ? 'Send Email' 
              : status === 'scheduled' 
                ? 'Schedule Email' 
                : 'Save Draft'
          }
        </button>
      </div>
    </form>
  );
};

export default EmailForm;