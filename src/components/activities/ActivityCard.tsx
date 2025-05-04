import React, { useState } from 'react';
import { Activity, Deal, Contact, Organization } from '../../types';
import { CheckCircle, Calendar, Clock, Link as LinkIcon } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { format, isPast, isValid } from 'date-fns';
import Modal from '../common/Modal';
import ActivityDetail from './ActivityDetail';
import ActivityForm from './ActivityForm';

interface ActivityCardProps {
  activity: Activity;
  onComplete: (id: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onComplete }) => {
  const { deals, contacts, organizations } = useCRM();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Get linked entities
  const deal = activity.dealId ? deals.find(d => d.id === activity.dealId) : undefined;
  const contact = activity.contactId ? contacts.find(c => c.id === activity.contactId) : undefined;
  const organization = activity.organizationId ? organizations.find(o => o.id === activity.organizationId) : undefined;
  
  // Format dates
  const parsedDueDate = activity.dueDate ? new Date(activity.dueDate) : null;
  const isValidDate = parsedDueDate && isValid(parsedDueDate);
  
  const formattedDueDate = isValidDate ? format(parsedDueDate, 'MMM d, yyyy') : 'Invalid date';
  const formattedDueTime = isValidDate ? format(parsedDueDate, 'h:mm a') : 'Invalid time';
  
  // Check if overdue
  const isOverdue = isValidDate && isPast(parsedDueDate) && !activity.isDone;
  
  // Get color for activity type
  const getActivityTypeColor = () => {
    if (!activity.type) return 'bg-gray-900/50 text-gray-100 ring-1 ring-gray-500/30';
    
    switch (activity.type) {
      case 'call':
        return 'bg-blue-900/50 text-blue-100 ring-1 ring-blue-500/30';
      case 'meeting':
        return 'bg-purple-900/50 text-purple-100 ring-1 ring-purple-500/30';
      case 'task':
        return 'bg-green-900/50 text-green-100 ring-1 ring-green-500/30';
      case 'deadline':
        return 'bg-red-900/50 text-red-100 ring-1 ring-red-500/30';
      case 'email':
        return 'bg-yellow-900/50 text-yellow-100 ring-1 ring-yellow-500/30';
      default:
        return 'bg-gray-900/50 text-gray-100 ring-1 ring-gray-500/30';
    }
  };

  return (
    <>
      <div 
        className={`bg-gray-900/40 backdrop-blur-md rounded-lg border ${
          isOverdue ? 'border-red-500/30' : activity.isDone ? 'border-green-500/30' : 'border-white/10'
        } hover:bg-gray-900/50 transition-all duration-200`}
      >
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setShowDetailModal(true)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityTypeColor()}`}>
                {activity.type ? `${activity.type.charAt(0).toUpperCase()}${activity.type.slice(1)}` : 'Unknown'}
              </span>
              {activity.isRecurring && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                  Recurring
                </span>
              )}
            </div>
            
            {!activity.isDone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(activity.id);
                }}
                className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
                title="Mark as done"
              >
                <CheckCircle className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <h3 className={`mt-2 text-base font-medium ${
            activity.isDone ? 'text-gray-400 line-through' : isOverdue ? 'text-red-300' : 'text-white'
          }`}>
            {activity.title}
          </h3>
          
          {activity.description && (
            <p className="mt-1 text-sm text-gray-300 line-clamp-2">{activity.description}</p>
          )}
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center text-sm text-gray-300">
              <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
              <span className={isOverdue ? 'text-red-300 font-medium' : ''}>
                {formattedDueDate}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-300">
              <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
              <span>{formattedDueTime}</span>
            </div>
          </div>
          
          {(deal || contact || organization) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {deal && (
                <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                  <LinkIcon className="mr-1 h-3 w-3" />
                  Deal: {deal.title}
                </div>
              )}
              
              {contact && (
                <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                  <LinkIcon className="mr-1 h-3 w-3" />
                  Contact: {contact.name}
                </div>
              )}
              
              {organization && (
                <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                  <LinkIcon className="mr-1 h-3 w-3" />
                  Org: {organization.name}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Activity Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Activity Details"
        size="lg"
      >
        <ActivityDetail 
          activity={activity}
          onEdit={() => {
            setShowDetailModal(false);
            setShowEditModal(true);
          }}
        />
      </Modal>

      {/* Edit Activity Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Activity"
        size="lg"
      >
        <ActivityForm
          activity={activity}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
};

export default ActivityCard;