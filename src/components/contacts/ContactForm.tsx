import React from 'react';
import { useForm } from 'react-hook-form';
import { useCRM } from '../../context/CRMContext';
import { Contact } from '../../types';

interface ContactFormProps {
  contact?: Contact;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  organizationId?: string;
  tags: string;
  customFields: { [key: string]: any };
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onClose }) => {
  const { currentUser, organizations, createContact, updateContact } = useCRM();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    defaultValues: contact ? {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      organizationId: contact.organizationId,
      tags: contact.tags.join(', '),
    } : {},
  });
  
  const onSubmit = async (data: ContactFormData) => {
    if (!currentUser) return;
    
    const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
    
    if (contact) {
      // Update existing contact
      await updateContact(contact.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        organizationId: data.organizationId || undefined,
        tags,
      });
    } else {
      // Create new contact
      const newContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        organizationId: data.organizationId || undefined,
        ownerId: currentUser.id,
        tags,
        customFields: {},
      };
      
      await createContact(newContact);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('email', { 
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please enter a valid email address',
            },
          })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('phone')}
        />
      </div>
      
      <div>
        <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
          Organization
        </label>
        <select
          id="organizationId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          placeholder="e.g. decision-maker, technical"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('tags')}
        />
      </div>
      
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
          {isSubmitting ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;