import React from 'react';
import { Automation } from '../../types';
import { Zap, ToggleLeft, ToggleRight } from 'lucide-react';

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string, isActive: boolean) => void;
  onClick?: (automation: Automation) => void;
}

const AutomationCard: React.FC<AutomationCardProps> = ({ 
  automation,
  onToggle,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(automation);
    }
  };
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(automation.id, !automation.isActive);
  };
  
  // Format trigger type for display
  const formatTriggerType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get action descriptions
  const getActionDescriptions = () => {
    return automation.actions.map(action => {
      switch (action.type) {
        case 'send_email':
          return 'Send email';
        case 'create_activity':
          return 'Create activity';
        case 'update_field':
          return 'Update field';
        case 'create_deal':
          return 'Create deal';
        default:
          return 'Unknown action';
      }
    });
  };
  
  return (
    <div 
      className={`bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-gray-900/50 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary-900/50 flex items-center justify-center text-secondary-100 ring-2 ring-secondary-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-medium text-white">{automation.name}</h3>
          </div>
          
          <button 
            onClick={handleToggle}
            className="text-gray-400 hover:text-gray-300"
          >
            {automation.isActive ? (
              <ToggleRight className="h-6 w-6 text-success-400" />
            ) : (
              <ToggleLeft className="h-6 w-6" />
            )}
          </button>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-300">
            Trigger: {formatTriggerType(automation.trigger.type)}
          </div>
          
          {automation.trigger.conditions.length > 0 && (
            <div className="mt-1 text-sm text-gray-400">
              {automation.trigger.conditions.length} condition{automation.trigger.conditions.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <div className="text-sm font-medium text-gray-300">
            Actions:
          </div>
          <ul className="mt-1 text-sm text-gray-400 list-disc list-inside">
            {getActionDescriptions().map((description, index) => (
              <li key={index}>{description}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          Created: {new Date(automation.createdAt).toLocaleDateString()}
          {automation.updatedAt !== automation.createdAt && 
            ` • Updated: ${new Date(automation.updatedAt).toLocaleDateString()}`
          }
        </div>
      </div>
    </div>
  );
};

export default AutomationCard;