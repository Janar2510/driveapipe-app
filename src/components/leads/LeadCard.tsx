import React from 'react';
import { Lead } from '../../types';
import { Mail, Phone, Tag, Archive } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onConvert: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onConvert }) => {
  // Get status color
  const getStatusColor = () => {
    switch (lead.status) {
      case 'new':
        return 'bg-blue-900/50 text-blue-100 ring-1 ring-blue-500/30';
      case 'contacted':
        return 'bg-yellow-900/50 text-yellow-100 ring-1 ring-yellow-500/30';
      case 'qualified':
        return 'bg-green-900/50 text-green-100 ring-1 ring-green-500/30';
      case 'unqualified':
        return 'bg-gray-900/50 text-gray-100 ring-1 ring-gray-500/30';
      default:
        return 'bg-gray-900/50 text-gray-100 ring-1 ring-gray-500/30';
    }
  };
  
  return (
    <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-gray-900/50 transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-100 font-medium text-lg ring-2 ring-primary-500/30">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-medium text-white">{lead.name}</h3>
              {lead.customFields?.company && (
                <p className="text-sm text-gray-300">{lead.customFields.company}</p>
              )}
            </div>
          </div>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          {lead.email && (
            <div className="flex items-center text-sm text-gray-300">
              <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          
          {lead.phone && (
            <div className="flex items-center text-sm text-gray-300">
              <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{lead.phone}</span>
            </div>
          )}
          
          {lead.source && (
            <div className="flex items-center text-sm text-gray-300">
              <Tag className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>Source: {lead.source}</span>
            </div>
          )}
        </div>
        
        {lead.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {lead.tags.slice(0, 3).map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                {tag}
              </span>
            ))}
            {lead.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                +{lead.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={() => onConvert(lead)}
            className="inline-flex items-center px-2.5 py-1.5 border border-white/10 text-xs font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
          >
            <Archive className="mr-1 h-4 w-4" />
            Convert to Contact & Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;