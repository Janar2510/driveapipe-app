import React from 'react';
import { Activity } from '../../types';
import { Calendar, Clock, Link as LinkIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityDetailProps {
  activity: Activity;
  onEdit: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, onEdit }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">{activity.title}</h3>
        {activity.description && (
          <p className="mt-2 text-gray-300 whitespace-pre-wrap">{activity.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="font-medium text-gray-300">Due Date:</span>
          </div>
          <div className="mt-1 pl-6 text-gray-300">
            {format(new Date(activity.dueDate), 'MMMM d, yyyy')}
          </div>
        </div>

        <div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="font-medium text-gray-300">Due Time:</span>
          </div>
          <div className="mt-1 pl-6 text-gray-300">
            {format(new Date(activity.dueDate), 'h:mm a')}
          </div>
        </div>
      </div>

      {(activity.dealId || activity.contactId || activity.organizationId) && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Related Records</h4>
          <div className="space-y-2">
            {activity.dealId && (
              <div className="flex items-center text-sm">
                <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-primary-400 hover:text-primary-300">
                  Deal: {activity.dealId}
                </span>
              </div>
            )}
            {activity.contactId && (
              <div className="flex items-center text-sm">
                <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-primary-400 hover:text-primary-300">
                  Contact: {activity.contactId}
                </span>
              </div>
            )}
            {activity.organizationId && (
              <div className="flex items-center text-sm">
                <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-primary-400 hover:text-primary-300">
                  Organization: {activity.organizationId}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {activity.isRecurring && (
        <div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="font-medium text-gray-300">Recurring Pattern:</span>
          </div>
          <div className="mt-1 pl-6 text-gray-300 capitalize">
            {activity.recurringPattern || 'Not specified'}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onEdit}
          className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          Edit Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityDetail;