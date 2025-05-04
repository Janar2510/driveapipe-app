import React from 'react';
import { Link } from 'react-router-dom';
import { Contact, Organization } from '../../types';
import { Phone, Mail, Building2 } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const { organizations } = useCRM();
  
  // Get organization
  const organization: Organization | undefined = 
    contact.organizationId 
      ? organizations.find(org => org.id === contact.organizationId)
      : undefined;
  
  return (
    <Link 
      to={`/contacts/${contact.id}`}
      className="block bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-gray-900/50 transition-all duration-200"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-100 font-medium text-lg ring-2 ring-primary-500/30">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-medium text-white">{contact.name}</h3>
              {organization && (
                <p className="text-sm text-gray-300">{organization.name}</p>
              )}
            </div>
          </div>
          
          {contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {contact.tags.slice(0, 2).map(tag => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900/50 text-primary-100 ring-1 ring-primary-500/30">
                  {tag}
                </span>
              ))}
              {contact.tags.length > 2 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                  +{contact.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          {contact.email && (
            <div className="flex items-center text-sm text-gray-300">
              <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          
          {contact.phone && (
            <div className="flex items-center text-sm text-gray-300">
              <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{contact.phone}</span>
            </div>
          )}
          
          {organization && (
            <div className="flex items-center text-sm text-gray-300">
              <Building2 className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span className="truncate">{organization.name}</span>
            </div>
          )}
        </div>
        
        {contact.lastActivityDate && (
          <div className="mt-4 text-xs text-gray-400">
            Last activity: {new Date(contact.lastActivityDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ContactCard;