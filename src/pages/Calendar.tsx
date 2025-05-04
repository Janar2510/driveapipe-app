import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import ActivityForm from '../components/activities/ActivityForm';
import ActivityDetail from '../components/activities/ActivityDetail';
import { Activity } from '../types';
import { Plus } from 'lucide-react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar: React.FC = () => {
  const { activities, updateActivity } = useCRM();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showActivityDetail, setShowActivityDetail] = useState(false);
  const [view, setView] = useState(Views.MONTH);

  // Convert activities to calendar events
  const events = useMemo(() => {
    return activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      start: new Date(activity.dueDate),
      end: new Date(activity.dueDate),
      allDay: false,
      resource: activity,
      className: getActivityClass(activity),
    }));
  }, [activities]);

  // Get activity class based on type and status
  function getActivityClass(activity: Activity): string {
    if (activity.isDone) return 'bg-gray-900/50 text-gray-300 line-through';
    
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
  }

  // Handle slot selection (clicking on a time slot)
  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setShowActivityForm(true);
  };

  // Handle event selection (clicking on an activity)
  const handleSelectEvent = (event: any) => {
    setSelectedActivity(event.resource);
    setShowActivityDetail(true);
  };

  // Handle event drag and drop
  const handleEventDrop = ({ event, start }: any) => {
    if (event.resource) {
      updateActivity(event.resource.id, {
        dueDate: start.toISOString(),
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="View and manage your activities in a calendar layout"
        actions={
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowActivityForm(true);
            }}
            className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Activity
          </button>
        }
      />

      <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 p-6">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          onView={setView}
          tooltipAccessor={event => event.title}
          eventPropGetter={event => ({
            className: event.className,
          })}
          className="calendar-dark"
        />
      </div>

      {/* Activity Form Modal */}
      <Modal
        isOpen={showActivityForm}
        onClose={() => {
          setShowActivityForm(false);
          setSelectedDate(null);
        }}
        title="Add Activity"
        size="lg"
      >
        <ActivityForm
          initialDate={selectedDate}
          onClose={() => {
            setShowActivityForm(false);
            setSelectedDate(null);
          }}
        />
      </Modal>

      {/* Activity Detail Modal */}
      <Modal
        isOpen={showActivityDetail}
        onClose={() => {
          setShowActivityDetail(false);
          setSelectedActivity(null);
        }}
        title="Activity Details"
        size="lg"
      >
        {selectedActivity && (
          <ActivityDetail
            activity={selectedActivity}
            onEdit={() => {
              setShowActivityDetail(false);
              setSelectedActivity(null);
              setShowActivityForm(true);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Calendar;