import React from 'react';
import { useForm } from 'react-hook-form';
import { useCRM } from '../../context/CRMContext';
import { Lead } from '../../types';

interface ConvertLeadFormProps {
  lead: Lead;
  onClose: () => void;
  onSuccess: () => void;
}

interface ConvertLeadFormData {
  dealTitle: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  expectedCloseDate?: string;
}

const ConvertLeadForm: React.FC<ConvertLeadFormProps> = ({ lead, onClose, onSuccess }) => {
  const { currentUser, pipelines, convertLead } = useCRM();
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ConvertLeadFormData>({
    defaultValues: {
      dealTitle: lead.customFields?.company 
        ? `Deal with ${lead.customFields.company}`
        : `Deal with ${lead.name}`,
      value: 0,
      currency: 'USD',
      pipelineId: pipelines[0]?.id || '',
    },
  });
  
  const selectedPipelineId = watch('pipelineId');
  
  // When pipeline changes, reset stage
  React.useEffect(() => {
    if (selectedPipelineId) {
      const pipeline = pipelines.find(p => p.id === selectedPipelineId);
      if (pipeline && pipeline.stages.length > 0) {
        setValue('stageId', pipeline.stages[0].id);
      }
    }
  }, [selectedPipelineId, pipelines, setValue]);
  
  const onSubmit = async (data: ConvertLeadFormData) => {
    if (!currentUser) return;
    
    // Convert lead to deal and contact
    const result = await convertLead(lead.id, {
      title: data.dealTitle,
      value: data.value,
      currency: data.currency,
      pipelineId: data.pipelineId,
      stageId: data.stageId,
      ownerId: currentUser.id,
      expectedCloseDate: data.expectedCloseDate,
      products: [],
      activities: [],
      emails: [],
      history: [],
      tags: lead.tags || [],
      customFields: {},
    });
    
    if (result) {
      onSuccess();
      onClose();
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="dealTitle" className="block text-sm font-medium text-gray-700">
          Deal title *
        </label>
        <input
          type="text"
          id="dealTitle"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('dealTitle', { required: 'Deal title is required' })}
        />
        {errors.dealTitle && (
          <p className="mt-1 text-sm text-red-600">{errors.dealTitle.message}</p>
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
        <label htmlFor="pipelineId" className="block text-sm font-medium text-gray-700">
          Pipeline *
        </label>
        <select
          id="pipelineId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('pipelineId', { required: 'Pipeline is required' })}
        >
          {pipelines.map(pipeline => (
            <option key={pipeline.id} value={pipeline.id}>
              {pipeline.name}
            </option>
          ))}
        </select>
        {errors.pipelineId && (
          <p className="mt-1 text-sm text-red-600">{errors.pipelineId.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="stageId" className="block text-sm font-medium text-gray-700">
          Stage *
        </label>
        <select
          id="stageId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          {...register('stageId', { required: 'Stage is required' })}
        >
          {selectedPipelineId && 
            pipelines
              .find(p => p.id === selectedPipelineId)
              ?.stages.map(stage => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
        </select>
        {errors.stageId && (
          <p className="mt-1 text-sm text-red-600">{errors.stageId.message}</p>
        )}
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
      
      <div className="mt-2 rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              Converting will create a new contact and deal, and delete the lead.
            </p>
          </div>
        </div>
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
          {isSubmitting ? 'Converting...' : 'Convert Lead'}
        </button>
      </div>
    </form>
  );
};

export default ConvertLeadForm;