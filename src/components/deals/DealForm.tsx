import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCRM } from '../../context/CRMContext';
import { Deal } from '../../types';

interface DealFormProps {
  pipelineId: string;
  stageId: string;
  deal?: Deal;
  onClose: () => void;
}

interface DealFormData {
  title: string;
  value: number;
  currency: string;
  contactIds: string[];
  organizationId?: string;
  expectedCloseDate?: string;
  tags: string;
  customFields: { [key: string]: any };
}

const DealForm: React.FC<DealFormProps> = ({ pipelineId, stageId, deal, onClose }) => {
  const { currentUser, contacts, organizations, createDeal, updateDeal } = useCRM();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<DealFormData>({
    defaultValues: deal ? {
      title: deal.title,
      value: deal.value,
      currency: deal.currency,
      contactIds: deal.contactIds,
      organizationId: deal.organizationId,
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.substring(0, 10) : undefined,
      tags: deal.tags.join(', '),
    } : {
      currency: 'USD',
      contactIds: [],
    },
  });
  
  const onSubmit = async (data: DealFormData) => {
    if (!currentUser) return;
    
    const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
    
    if (deal) {
      // Update existing deal
      await updateDeal(deal.id, {
        title: data.title,
        value: data.value,
        currency: data.currency,
        contactIds: data.contactIds,
        organizationId: data.organizationId || undefined,
        expectedCloseDate: data.expectedCloseDate,
        tags,
      });
    } else {
      // Create new deal
      const newDeal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> = {
        title: data.title,
        value: data.value,
        currency: data.currency,
        pipelineId,
        stageId,
        contactIds: data.contactIds,
        organizationId: data.organizationId || undefined,
        ownerId: currentUser.id,
        expectedCloseDate: data.expectedCloseDate,
        products: [],
        activities: [],
        emails: [],
        history: [],
        tags,
        customFields: {},
      };
      
      await createDeal(newDeal);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Deal title *
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Value *
          </label>
          <input
            type="number"
            id="value"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            {...register('value', { 
              required: 'Value is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Value must be positive' },
            })}
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>
        
        <div className="sm:col-span-3">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency *
          </label>
          <select
            id="currency"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            {...register('currency', { required: 'Currency is required' })}
          >
            <option value="USD">USD - $</option>
            <option value="EUR">EUR - €</option>
            <option value="GBP">GBP - £</option>
            <option value="CAD">CAD - $</option>
            <option value="AUD">AUD - $</option>
            <option value="JPY">JPY - ¥</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="contactIds" className="block text-sm font-medium text-gray-700">
          Contacts *
        </label>
        <Controller
          control={control}
          name="contactIds"
          rules={{ required: 'At least one contact is required' }}
          render={({ field }) => (
            <select
              multiple
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={field.value}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions);
                field.onChange(options.map(option => option.value));
              }}
            >
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} {contact.email ? `(${contact.email})` : ''}
                </option>
              ))}
            </select>
          )}
        />
        {errors.contactIds && (
          <p className="mt-1 text-sm text-red-600">{errors.contactIds.message}</p>
        )}
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
        <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700">
          Expected close date
        </label>
        <input
          type="date"
          id="expectedCloseDate"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('expectedCloseDate')}
        />
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          placeholder="e.g. priority, needs-followup"
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
          {isSubmitting ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
        </button>
      </div>
    </form>
  );
};

export default DealForm;