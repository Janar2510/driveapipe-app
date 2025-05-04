import React from 'react';
import { useForm } from 'react-hook-form';
import { useCRM } from '../../context/CRMContext';
import { Organization } from '../../types';

interface OrganizationFormProps {
  organization?: Organization;
  onClose: () => void;
}

interface OrganizationFormData {
  name: string;
  website?: string;
  address?: string;
  tags: string;
  customFields: {
    industry?: string;
    employees?: number;
  };
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization, onClose }) => {
  const { currentUser, createOrganization, updateOrganization } = useCRM();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OrganizationFormData>({
    defaultValues: organization ? {
      name: organization.name,
      website: organization.website,
      address: organization.address,
      tags: organization.tags.join(', '),
      customFields: {
        industry: organization.customFields?.industry,
        employees: organization.customFields?.employees,
      },
    } : {
      customFields: {},
    },
  });
  
  const onSubmit = async (data: OrganizationFormData) => {
    if (!currentUser) return;
    
    const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
    
    if (organization) {
      // Update existing organization
      await updateOrganization(organization.id, {
        name: data.name,
        website: data.website,
        address: data.address,
        tags,
        customFields: {
          ...organization.customFields,
          ...data.customFields,
        },
      });
    } else {
      // Create new organization
      const newOrganization: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        website: data.website,
        address: data.address,
        ownerId: currentUser.id,
        tags,
        customFields: data.customFields,
      };
      
      await createOrganization(newOrganization);
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
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="url"
          id="website"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="https://example.com"
          {...register('website', {
            pattern: {
              value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
              message: 'Please enter a valid URL',
            },
          })}
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('address')}
        ></textarea>
      </div>
      
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Industry
        </label>
        <select
          id="industry"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('customFields.industry')}
        >
          <option value="">Select industry</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Retail">Retail</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="employees" className="block text-sm font-medium text-gray-700">
          Number of employees
        </label>
        <input
          type="number"
          id="employees"
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('customFields.employees', {
            valueAsNumber: true,
            min: { value: 1, message: 'Number of employees must be positive' },
          })}
        />
        {errors.customFields?.employees && (
          <p className="mt-1 text-sm text-red-600">{errors.customFields.employees.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          placeholder="e.g. customer, enterprise"
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
          {isSubmitting ? 'Saving...' : organization ? 'Update Organization' : 'Create Organization'}
        </button>
      </div>
    </form>
  );
};

export default OrganizationForm;