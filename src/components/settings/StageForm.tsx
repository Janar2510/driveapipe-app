import React from 'react';
import { useForm } from 'react-hook-form';
import { Stage } from '../../types';

interface StageFormProps {
  stage?: Stage;
  onSubmit: (data: Pick<Stage, 'name' | 'probability'>) => void;
  onClose: () => void;
}

interface StageFormData {
  name: string;
  probability: number;
}

const StageForm: React.FC<StageFormProps> = ({
  stage,
  onSubmit,
  onClose,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<StageFormData>({
    defaultValues: stage ? {
      name: stage.name,
      probability: stage.probability,
    } : {
      probability: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Stage Name *
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          {...register('name', { required: 'Stage name is required' })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="probability" className="block text-sm font-medium text-white">
          Win Probability (%) *
        </label>
        <input
          type="number"
          id="probability"
          min="0"
          max="100"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          {...register('probability', {
            required: 'Probability is required',
            min: { value: 0, message: 'Probability must be between 0 and 100' },
            max: { value: 100, message: 'Probability must be between 0 and 100' },
            valueAsNumber: true,
          })}
        />
        {errors.probability && (
          <p className="mt-1 text-sm text-red-500">{errors.probability.message}</p>
        )}
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
          {stage ? 'Update Stage' : 'Create Stage'}
        </button>
      </div>
    </form>
  );
};

export default StageForm;