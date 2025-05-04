import React from 'react';
import { useForm } from 'react-hook-form';
import { CustomField } from '../../types';

interface CustomFieldFormProps {
  field?: CustomField;
  entityType: CustomField['entityType'];
  onSubmit: (data: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

interface CustomFieldFormData {
  name: string;
  type: CustomField['type'];
  options?: string;
  isRequired: boolean;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
  field,
  entityType,
  onSubmit,
  onClose,
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CustomFieldFormData>({
    defaultValues: field ? {
      name: field.name,
      type: field.type,
      options: field.options?.join(', '),
      isRequired: field.isRequired,
    } : {
      type: 'text',
      isRequired: false,
    },
  });

  const fieldType = watch('type');

  const handleFormSubmit = (data: CustomFieldFormData) => {
    const options = data.options
      ? data.options.split(',').map(opt => opt.trim()).filter(Boolean)
      : undefined;

    onSubmit({
      name: data.name,
      type: data.type,
      entityType,
      options,
      isRequired: data.isRequired,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Field Name *
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          {...register('name', { required: 'Field name is required' })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-white">
          Field Type *
        </label>
        <select
          id="type"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          {...register('type')}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="select">Dropdown</option>
          <option value="multiselect">Multi-Select</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div>

      {(fieldType === 'select' || fieldType === 'multiselect') && (
        <div>
          <label htmlFor="options" className="block text-sm font-medium text-white">
            Options * (comma-separated)
          </label>
          <input
            type="text"
            id="options"
            className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
            placeholder="Option 1, Option 2, Option 3"
            {...register('options', {
              required: 'Options are required for dropdown fields',
            })}
          />
          {errors.options && (
            <p className="mt-1 text-sm text-red-500">{errors.options.message}</p>
          )}
        </div>
      )}

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isRequired"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-700 bg-gray-900/50 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
            {...register('isRequired')}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isRequired" className="font-medium text-white">
            Required Field
          </label>
          <p className="text-gray-400">Make this field mandatory when creating or editing records</p>
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
          {field ? 'Update Field' : 'Create Field'}
        </button>
      </div>
    </form>
  );
};

export default CustomFieldForm;