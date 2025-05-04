import React from 'react';
import { useForm } from 'react-hook-form';
import { useCRM } from '../../context/CRMContext';
import { Activity } from '../../types';
import { format } from 'date-fns';

interface ActivityFormProps {
  activity?: Activity;
  dealId?: string;
  contactId?: string;
  organizationId?: string;
  initialDate?: Date | null;
  onClose: () => void;
}

interface ActivityFormData {
  title: string;
  type: Activity['type'];
  description?: string;
  dueDate: string;
  dueTime: string;
  isRecurring: boolean;
  recurringPattern?: string;
  dealId?: string;
  contactId?: string;
  organizationId?: string;
  reminderDate?: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  activity,
  dealId,
  contactId,
  organizationId,
  initialDate,
  onClose
}) => {
  const { currentUser, deals, contacts, organizations, createActivity, updateActivity } = useCRM();
  
  const defaultDueDate = activity 
    ? format(new Date(activity.dueDate), 'yyyy-MM-dd')
    : initialDate 
      ? format(initialDate, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd');

  const defaultDueTime = activity 
    ? format(new Date(activity.dueDate), 'HH:mm')
    : initialDate 
      ? format(initialDate, 'HH:mm')
      : '12:00';
  
  const defaultReminderDate = activity?.reminderDate 
    ? format(new Date(activity.reminderDate), 'yyyy-MM-dd')
    : '';
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ActivityFormData>({
    defaultValues: activity ? {
      title: activity.title,
      type: activity.type,
      description: activity.description,
      dueDate: defaultDueDate,
      dueTime: defaultDueTime,
      isRecurring: activity.isRecurring,
      recurringPattern: activity.recurringPattern,
      dealId: activity.dealId,
      contactId: activity.contactId,
      organizationId: activity.organizationId,
      reminderDate: defaultReminderDate,
    } : {
      type: 'task',
      dueDate: defaultDueDate,
      dueTime: defaultDueTime,
      isRecurring: false,
      dealId,
      contactId,
      organizationId,
    },
  });
  
  const isRecurring = watch('isRecurring');
  
  const onSubmit = async (data: ActivityFormData) => {
    if (!currentUser) return;
    
    // Combine date and time for dueDate
    const dueDateObj = new Date(`${data.dueDate}T${data.dueTime}`);
    
    // Create reminder date object if provided
    let reminderDateObj: Date | undefined;
    if (data.reminderDate) {
      reminderDateObj = new Date(`${data.reminderDate}T${data.dueTime}`);
    }
    
    if (activity) {
      // Update existing activity
      await updateActivity(activity.id, {
        title: data.title,
        type: data.type,
        description: data.description,
        dueDate: dueDateObj.toISOString(),
        isRecurring: data.isRecurring,
        recurringPattern: data.isRecurring ? data.recurringPattern : undefined,
        dealId: data.dealId || undefined,
        contactId: data.contactId || undefined,
        organizationId: data.organizationId || undefined,
        reminderDate: reminderDateObj?.toISOString(),
      });
    } else {
      // Create new activity
      const newActivity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> = {
        title: data.title,
        type: data.type,
        description: data.description,
        dueDate: dueDateObj.toISOString(),
        isDone: false,
        isRecurring: data.isRecurring,
        recurringPattern: data.isRecurring ? data.recurringPattern : undefined,
        dealId: data.dealId || undefined,
        contactId: data.contactId || undefined,
        organizationId: data.organizationId || undefined,
        ownerId: currentUser.id,
        reminderDate: reminderDateObj?.toISOString(),
      };
      
      await createActivity(newActivity);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white">
          Title *
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-white">
          Type *
        </label>
        <select
          id="type"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          {...register('type', { required: 'Type is required' })}
        >
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
          <option value="task">Task</option>
          <option value="deadline">Deadline</option>
          <option value="email">Email</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          {...register('description')}
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="dueDate" className="block text-sm font-medium text-white">
            Due date *
          </label>
          <input
            type="date"
            id="dueDate"
            className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
            {...register('dueDate', { required: 'Due date is required' })}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>
        
        <div className="sm:col-span-3">
          <label htmlFor="dueTime" className="block text-sm font-medium text-white">
            Due time *
          </label>
          <input
            type="time"
            id="dueTime"
            className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
            {...register('dueTime', { required: 'Due time is required' })}
          />
          {errors.dueTime && (
            <p className="mt-1 text-sm text-red-500">{errors.dueTime.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isRecurring"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-700 bg-gray-900/50 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
            {...register('isRecurring')}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isRecurring" className="font-medium text-white">
            Recurring activity
          </label>
          <p className="text-gray-400">Set up a repeating schedule for this activity</p>
        </div>
      </div>
      
      {isRecurring && (
        <div>
          <label htmlFor="recurringPattern" className="block text-sm font-medium text-white">
            Recurring pattern
          </label>
          <select
            id="recurringPattern"
            className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
            {...register('recurringPattern', { required: isRecurring })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          {errors.recurringPattern && (
            <p className="mt-1 text-sm text-red-500">{errors.recurringPattern.message}</p>
          )}
        </div>
      )}
      
      <div>
        <label htmlFor="reminderDate" className="block text-sm font-medium text-white">
          Reminder date
        </label>
        <input
          type="date"
          id="reminderDate"
          className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          {...register('reminderDate')}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
        <div>
          <label htmlFor="dealId" className="block text-sm font-medium text-white">
            Linked deal
          </label>
          <select
            id="dealId"
            className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
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
        
        <div>
          <label htmlFor="contactId" className="block text-sm font-medium text-white">
            Linked contact
          </label>
          <select
            id="contactId"
            className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
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
          <label htmlFor="organizationId" className="block text-sm font-medium text-white">
            Linked organization
          </label>
          <select
            id="organizationId"
            className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
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
      </div>
      
      <div className="pt-5 flex justify-end space-x-3">
        <button
          type="button"
          className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-white bg-gray-900/50 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : activity ? 'Update Activity' : 'Create Activity'}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;