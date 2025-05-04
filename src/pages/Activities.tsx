import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import ActivityCard from '../components/activities/ActivityCard';
import ActivityForm from '../components/activities/ActivityForm';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { Plus, Calendar, Clock, CheckCircle, Filter } from 'lucide-react';
import { format, isToday, isYesterday, isTomorrow, addDays } from 'date-fns';

const Activities: React.FC = () => {
  const { activities, updateActivity } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'upcoming' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  
  // Get current date information
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  
  // Filter activities based on filter type
  const filteredActivities = activities.filter(activity => {
    const dueDate = new Date(activity.dueDate);
    
    // Filter by status
    if (filter === 'overdue') {
      return !activity.isDone && dueDate < today;
    } else if (filter === 'today') {
      return !activity.isDone && isToday(dueDate);
    } else if (filter === 'upcoming') {
      return !activity.isDone && dueDate > today && dueDate <= nextWeek;
    } else if (filter === 'completed') {
      return activity.isDone;
    }
    
    // Type filter (applies to all filter types)
    if (typeFilter.length > 0) {
      return typeFilter.includes(activity.type);
    }
    
    return true;
  }).sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Group activities by date
  const groupedActivities: { [key: string]: typeof filteredActivities } = {};
  
  filteredActivities.forEach(activity => {
    const dueDate = new Date(activity.dueDate);
    let dateKey: string;
    
    if (isToday(dueDate)) {
      dateKey = 'Today';
    } else if (isTomorrow(dueDate)) {
      dateKey = 'Tomorrow';
    } else if (isYesterday(dueDate)) {
      dateKey = 'Yesterday';
    } else {
      dateKey = format(dueDate, 'MMMM d, yyyy');
    }
    
    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }
    
    groupedActivities[dateKey].push(activity);
  });
  
  const toggleTypeFilter = (type: string) => {
    setTypeFilter(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const handleComplete = (id: string) => {
    updateActivity(id, { isDone: true });
  };
  
  return (
    <div>
      <PageHeader
        title="Activities"
        subtitle="Manage your tasks, calls, meetings, and deadlines"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Activity
          </button>
        }
      />
      
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            filter === 'all'
              ? 'bg-primary-100 text-primary-800'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            filter === 'overdue'
              ? 'bg-error-100 text-error-800'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Clock className="h-4 w-4 mr-1" />
          Overdue
        </button>
        <button
          onClick={() => setFilter('today')}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            filter === 'today'
              ? 'bg-warning-100 text-warning-800'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Today
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            filter === 'upcoming'
              ? 'bg-secondary-100 text-secondary-800'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Upcoming
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            filter === 'completed'
              ? 'bg-success-100 text-success-800'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Completed
        </button>
        
        <div className="relative ml-auto">
          <button
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-1" />
            Type
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
            <div className="p-2">
              {['call', 'meeting', 'task', 'deadline', 'email'].map(type => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                    typeFilter.includes(type)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {activities.length > 0 ? (
        <>
          {Object.keys(groupedActivities).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                <div key={date}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{date}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dateActivities.map(activity => (
                      <ActivityCard 
                        key={activity.id}
                        activity={activity}
                        onComplete={handleComplete}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No activities match your filters</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or create a new activity.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setFilter('all')}
                  className="btn btn-primary mr-3"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-secondary"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Activity
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No activities yet"
          description="Start by creating your first activity"
          icon={<Calendar className="h-6 w-6" />}
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Activity
            </button>
          }
        />
      )}
      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Activity"
        size="lg"
      >
        <ActivityForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

export default Activities;