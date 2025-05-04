import React from 'react';
import { Link } from 'react-router-dom';
import { Organization } from '../../types';
import { Globe, MapPin, User } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface OrganizationCardProps {
  organization: Organization;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const { contacts } = useCRM();
  
  // Get contacts that belong to this organization
  const organizationContacts = contacts.filter(contact => contact.organizationId === organization.id);
  
  return (
    <Link 
      to={`/organizations/${organization.id}`}
      className="block bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-gray-900/50 transition-all duration-200 hover:border-white/20"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary-900/50 flex items-center justify-center text-secondary-100 font-medium text-lg ring-2 ring-secondary-500/50">
              {organization.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-base font-medium text-white">{organization.name}</h3>
          </div>
          
          {organization.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {organization.tags.slice(0, 2).map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-900/50 text-secondary-100 ring-1 ring-secondary-500/30">
                  {tag}
                </span>
              ))}
              {organization.tags.length > 2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                  +{organization.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          {organization.website && (
            <div className="flex items-center text-sm text-gray-300">
              <Globe className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span className="truncate">{organization.website}</span>
            </div>
          )}
          
          {organization.address && (
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span className="truncate">{organization.address}</span>
            </div>
          )}
          
          {organizationContacts.length > 0 && (
            <div className="flex items-center text-sm text-gray-300">
              <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{organizationContacts.length} contacts</span>
            </div>
          )}
        </div>
        
        {organization.lastActivityDate && (
          <div className="mt-4 text-xs text-gray-400">
            Last activity: {new Date(organization.lastActivityDate).toLocaleDateString()}
          </div>
        )}
        
        {organization.customFields && organization.customFields.industry && (
          <div className="mt-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-900/50 text-secondary-100 ring-1 ring-secondary-500/30">
              {organization.customFields.industry}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default OrganizationCard;