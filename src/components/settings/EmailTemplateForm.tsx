import React from 'react';
import { useForm } from 'react-hook-form';
import { EmailTemplate } from '../../types';

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSubmit: (data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

interface EmailTemplateFormData {
  name: string;
  subject: string;
  body: string;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  template,
  onSubmit,
  onClose,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailTemplateFormData>({
    defaultValues: template ? {
      name: template.name,
      subject: template.subject,
      body: template.body,
    } : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Template Name *
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          placeholder="e.g., Welcome Email"
          {...register('name', { required: 'Template name is required' })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-white">
          Email Subject *
        </label>
        <input
          type="text"
          id="subject"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          placeholder="e.g., Welcome to {{organization.name}}"
          {...register('subject', { required: 'Email subject is required' })}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-white">
          Email Body *
        </label>
        <textarea
          id="body"
          rows={8}
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          placeholder="Dear {{contact.name}},&#10;&#10;Welcome to {{organization.name}}..."
          {...register('body', { required: 'Email body is required' })}
        ></textarea>
        {errors.body && (
          <p className="mt-1 text-sm text-red-500">{errors.body.message}</p>
        )}
      </div>

      <div className="bg-gray-900/30 rounded-md p-4">
        <h4 className="text-sm font-medium text-white mb-2">Available Placeholders</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
          <div>
            <p className="font-medium mb-1">Contact</p>
            <ul className="space-y-1 text-gray-400">
              <li>{'{{contact.name}}'}</li>
              <li>{'{{contact.email}}'}</li>
              <li>{'{{contact.phone}}'}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Organization</p>
            <ul className="space-y-1 text-gray-400">
              <li>{'{{organization.name}}'}</li>
              <li>{'{{organization.website}}'}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Deal</p>
            <ul className="space-y-1 text-gray-400">
              <li>{'{{deal.title}}'}</li>
              <li>{'{{deal.value}}'}</li>
              <li>{'{{deal.formatted_value}}'}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">User</p>
            <ul className="space-y-1 text-gray-400">
              <li>{'{{user.name}}'}</li>
              <li>{'{{user.email}}'}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-white bg-gray-900/50 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          {template ? 'Update Template' : 'Create Template'}
        </button>
      </div>
    </form>
  );
};

export default EmailTemplateForm;