import React, { useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DashboardWidget as DashboardWidgetType } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { getDaysBetween } from '../../utils/dateUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardWidgetProps {
  widget: DashboardWidgetType;
  className?: string;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ widget, className = '' }) => {
  const { pipelines, deals, users, activities } = useCRM();

  // Get the pipeline for this widget if specified
  const pipeline = widget.config.pipelineId
    ? pipelines.find(p => p.id === widget.config.pipelineId)
    : pipelines[0];

  // Chart theme configuration
  const chartTheme = {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    grid: {
      color: 'rgba(255, 255, 255, 0.1)',
    },
    font: {
      family: 'system-ui, -apple-system, sans-serif',
    },
  };

  // Calculate conversion rates between stages
  const calculateConversionRates = useMemo(() => {
    if (!pipeline) return [];

    const stageDeals = new Map<string, Set<string>>();
    
    // First, gather all deals that have ever been in each stage
    deals.forEach(deal => {
      if (deal.pipelineId === pipeline.id) {
        // Current stage counts as reached
        if (!stageDeals.has(deal.stageId)) {
          stageDeals.set(deal.stageId, new Set());
        }
        stageDeals.get(deal.stageId)?.add(deal.id);

        // Add to all previous stages from history
        deal.history.forEach(entry => {
          if (!stageDeals.has(entry.stageId)) {
            stageDeals.set(entry.stageId, new Set());
          }
          stageDeals.get(entry.stageId)?.add(deal.id);
        });
      }
    });

    // Calculate conversion rates between adjacent stages
    const rates: number[] = [];
    for (let i = 0; i < pipeline.stages.length - 1; i++) {
      const currentStage = pipeline.stages[i];
      const nextStage = pipeline.stages[i + 1];
      
      const dealsInCurrent = stageDeals.get(currentStage.id)?.size || 0;
      const dealsInNext = stageDeals.get(nextStage.id)?.size || 0;
      
      const rate = dealsInCurrent > 0 
        ? (dealsInNext / dealsInCurrent) * 100 
        : 0;
      
      rates.push(Math.round(rate));
    }

    return rates;
  }, [pipeline, deals]);

  // Calculate average days in each stage
  const calculateDealVelocity = useMemo(() => {
    if (!pipeline) return [];

    const stageDurations = pipeline.stages.map(stage => {
      const stageDeals = deals.filter(deal => 
        deal.pipelineId === pipeline.id && 
        (deal.stageId === stage.id || deal.history.some(h => h.stageId === stage.id))
      );

      if (stageDeals.length === 0) return 0;

      const durations = stageDeals.map(deal => {
        let totalDays = 0;
        let entries = deal.history.filter(h => h.stageId === stage.id);
        
        // If deal is currently in this stage, add time since last entry
        if (deal.stageId === stage.id) {
          const lastEntry = deal.history[deal.history.length - 1];
          if (lastEntry) {
            totalDays += getDaysBetween(new Date(lastEntry.date), new Date());
          }
        }
        
        // Add up time between stage entries
        for (let i = 0; i < entries.length - 1; i++) {
          const start = new Date(entries[i].date);
          const end = new Date(entries[i + 1].date);
          totalDays += getDaysBetween(start, end);
        }
        
        return totalDays;
      });

      // Calculate average
      return Math.round(durations.reduce((sum, days) => sum + days, 0) / stageDeals.length);
    });

    return stageDurations;
  }, [pipeline, deals]);

  // Render different widgets based on type
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'pipeline_value':
        return renderPipelineValueWidget();
      case 'conversion_rate':
        return renderConversionRateWidget();
      case 'deal_velocity':
        return renderDealVelocityWidget();
      case 'leaderboard':
        return renderLeaderboardWidget();
      case 'activity_summary':
        return renderActivitySummaryWidget();
      default:
        return <div className="text-gray-300">Unknown widget type</div>;
    }
  };

  // Render pipeline value widget
  const renderPipelineValueWidget = () => {
    if (!pipeline) return <div className="text-gray-300">No pipeline data available</div>;

    const stageNames = pipeline.stages.map(stage => stage.name);
    const stageValues = pipeline.stages.map(stage => {
      return stage.deals.reduce((sum, deal) => sum + deal.value, 0);
    });

    const data = {
      labels: stageNames,
      datasets: [
        {
          label: 'Deal Value',
          data: stageValues,
          backgroundColor: [
            'rgba(139, 92, 246, 0.6)',
            'rgba(99, 102, 241, 0.6)',
            'rgba(217, 70, 239, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(234, 179, 8, 0.6)',
            'rgba(239, 68, 68, 0.6)',
          ],
          borderWidth: 0,
        },
      ],
    };

    const options = {
      responsive: true,
      color: chartTheme.color,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            color: chartTheme.color,
            font: chartTheme.font,
          },
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            color: chartTheme.grid.color,
          },
          ticks: {
            color: chartTheme.color,
            font: chartTheme.font,
          },
        },
        y: {
          grid: {
            color: chartTheme.grid.color,
          },
          ticks: {
            color: chartTheme.color,
            font: chartTheme.font,
            callback: (value: number) => `$${value.toLocaleString()}`,
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  // Render conversion rate widget
  const renderConversionRateWidget = () => {
    if (!pipeline) return <div className="text-gray-300">No pipeline data available</div>;

    const stageNames = pipeline.stages.map(stage => stage.name);
    const conversionRates = calculateConversionRates;

    const data = {
      labels: stageNames.slice(0, -1).map((name, i) => `${name} → ${stageNames[i + 1]}`),
      datasets: [
        {
          label: 'Conversion Rate %',
          data: conversionRates,
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      color: chartTheme.color,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            color: chartTheme.color,
            font: chartTheme.font,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.raw}% conversion rate`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: chartTheme.grid.color,
          },
          ticks: {
            color: chartTheme.color,
            font: chartTheme.font,
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: chartTheme.grid.color,
          },
          ticks: {
            color: chartTheme.color,
            font: chartTheme.font,
            callback: (value: number) => `${value}%`,
          },
          title: {
            display: true,
            text: 'Conversion Rate %',
            color: chartTheme.color,
            font: chartTheme.font,
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  // Render deal velocity widget
  const renderDealVelocityWidget = () => {
    if (!pipeline) return <div className="text-gray-300">No pipeline data available</div>;

    const stageNames = pipeline.stages.map(stage => stage.name);
    const velocityData = calculateDealVelocity;

    const data = {
      labels: stageNames,
      datasets: [
        {
          label: 'Avg. Days in Stage',
          data: velocityData,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      color: chartTheme.color,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            color: chartTheme.color,
            font: chartTheme.font,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.raw} days average`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: chartTheme.grid.color,
          },
          ticks: {
            color: chartTheme.color,
            font: chartTheme.font,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: chartTheme.grid.color,
          },
          ticks: {
            color: chartTheme.color,
            font: chartTheme.font,
            stepSize: 1,
            callback: (value: number) => `${value} days`,
          },
          title: {
            display: true,
            text: 'Average Days in Stage',
            color: chartTheme.color,
            font: chartTheme.font,
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  // Render leaderboard widget
  const renderLeaderboardWidget = () => {
    const salesData = users.map(user => {
      const userDeals = deals.filter(deal => deal.ownerId === user.id);
      const totalValue = userDeals.reduce((sum, deal) => sum + deal.value, 0);
      return {
        name: user.name,
        value: totalValue,
        deals: userDeals.length,
      };
    }).sort((a, b) => b.value - a.value);

    return (
      <div className="overflow-hidden">
        <div className="flow-root">
          <ul className="-my-2">
            {salesData.map((item, index) => (
              <li key={index} className="py-2">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-900/50 text-primary-100 ring-1 ring-primary-500/30">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.deals} deals</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-medium text-gray-100">${item.value.toLocaleString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Render activity summary widget
  const renderActivitySummaryWidget = () => {
    const upcomingActivities = activities
      .filter(activity => !activity.isDone && new Date(activity.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);

    if (upcomingActivities.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">No upcoming activities</p>
        </div>
      );
    }

    const activityTypeColors = {
      call: 'bg-blue-900/50 text-blue-100 ring-1 ring-blue-500/30',
      meeting: 'bg-purple-900/50 text-purple-100 ring-1 ring-purple-500/30',
      task: 'bg-green-900/50 text-green-100 ring-1 ring-green-500/30',
      deadline: 'bg-red-900/50 text-red-100 ring-1 ring-red-500/30',
      email: 'bg-yellow-900/50 text-yellow-100 ring-1 ring-yellow-500/30',
      custom: 'bg-gray-900/50 text-gray-100 ring-1 ring-gray-500/30',
    };

    return (
      <div className="overflow-hidden">
        <div className="flow-root">
          <ul className="-my-2">
            {upcomingActivities.map((activity) => (
              <li key={activity.id} className="py-2">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activityTypeColors[activity.type]}`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {new Date(activity.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-gray-900/50 transition-all duration-200 ${className}`}>
      <div className="px-4 py-5 sm:px-6 border-b border-white/10">
        <h3 className="text-lg font-medium text-white">{widget.title}</h3>
      </div>
      <div className="p-4">{renderWidgetContent()}</div>
    </div>
  );
};

export default DashboardWidget;