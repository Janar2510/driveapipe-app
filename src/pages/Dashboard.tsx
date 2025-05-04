import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import DashboardWidget from '../components/dashboard/DashboardWidget';
import EmptyState from '../components/common/EmptyState';
import { Plus, LayoutGrid } from 'lucide-react';
import { DashboardWidget as DashboardWidgetType } from '../types';

const Dashboard: React.FC = () => {
  const { currentUser, dashboardWidgets, getDashboardWidget, createDashboardWidget, updateDashboardWidget, deleteDashboardWidget } = useCRM();
  const [showAddWidget, setShowAddWidget] = useState(false);

  // Available widget types
  const widgetTypes = [
    { type: 'pipeline_value', name: 'Pipeline Value' },
    { type: 'conversion_rate', name: 'Conversion Rate' },
    { type: 'deal_velocity', name: 'Deal Velocity' },
    { type: 'leaderboard', name: 'Sales Leaderboard' },
    { type: 'activity_summary', name: 'Upcoming Activities' },
  ] as const;

  // User's widgets
  const userWidgets = dashboardWidgets.filter(widget => widget.userId === currentUser?.id);

  const handleAddWidget = (type: DashboardWidgetType['type']) => {
    const title = widgetTypes.find(w => w.type === type)?.name || 'New Widget';
    const position = userWidgets.length;

    createDashboardWidget({
      type,
      title,
      position,
      config: {
        pipelineId: '', // Default config
        period: 'current_month',
      },
      userId: currentUser?.id || '',
    });

    setShowAddWidget(false);
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your key metrics and insights at a glance"
        actions={
          <button
            onClick={() => setShowAddWidget(!showAddWidget)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Widget
          </button>
        }
      />

      {showAddWidget && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-3">Add Widget</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {widgetTypes.map((widget) => (
              <button
                key={widget.type}
                onClick={() => handleAddWidget(widget.type)}
                className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                  <LayoutGrid className="h-4 w-4" />
                </div>
                <span>{widget.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {userWidgets.length === 0 ? (
        <EmptyState
          title="Your dashboard is empty"
          description="Add widgets to see your key metrics and insights"
          icon={<LayoutGrid className="h-6 w-6" />}
          action={
            <button
              onClick={() => setShowAddWidget(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Widget
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userWidgets.map(widget => (
            <DashboardWidget key={widget.id} widget={widget} className="col-span-1" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;