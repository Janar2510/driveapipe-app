import React from 'react';
import { Email, Contact, Organization, Deal } from '../../types';
import { Mail, Eye, MousePointer, Clock, Calendar } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { format } from 'date-fns';

interface EmailCardProps {
  email: Email;
}

const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const { contacts, organizations, deals } = useCRM();
  
  // Initialize variables before conditional assignment
  let contact: Contact | undefined = undefined;
  let organization: Organization | undefined = undefined;
  let deal: Deal | undefined = undefined;
  
  // Get linked entities
  contact = email.contactId ? contacts.find(c => c.id === email.contactId) : undefined;
  organization = email.organizationId ? organizations.find(o => o.id === email.organizationId) : undefined;
  deal = email.dealId ? deals.find(d => d.id === email.dealId) : undefined;
  
  // Get status color
  const getStatusColor = () => {
    if (!email.status) return 'bg-gray-900/50 text-gray-100 ring-1 ring-gray-500/30';
    
    switch (email.status) {
      case 'sent':
        return 'bg-success-900/50 text-success-100 ring-1 ring-success-500/30';
      case 'draft':
        return 'bg-gray-900/50 text-gray-100 ring-1 ring-gray-500/30';
      case 'scheduled':
        return 'bg-blue-900/50 text-blue-100 ring-1 ring-blue-500/30';
      default:
        return 'bg-gray-900/50 text-gray-100 ring-1 ring-gray-500/30';
    }
  };
  
  // Format date
  const formattedDate = email.sentAt
    ? format(new Date(email.sentAt), 'MMM d, yyyy h:mm a')
    : email.scheduledFor
      ? `Scheduled for ${format(new Date(email.scheduledFor), 'MMM d, yyyy h:mm a')}`
      : 'Draft';
  
  return (
    <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-gray-900/50 transition-all duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-base font-medium text-white">{email.subject}</h3>
          </div>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {email.status ? `${email.status.charAt(0).toUpperCase()}${email.status.slice(1)}` : 'Unknown'}
          </span>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-300 line-clamp-2">
            {/* Strip HTML tags for preview and handle undefined body */}
            {(email.body || '').replace(/<[^>]*>?/gm, '').substring(0, 120)}
            {(email.body?.length || 0) > 120 ? '...' : ''}
          </p>
        </div>
        
        <div className="mt-4 flex items-center text-xs text-gray-400">
          {email.sentAt ? (
            <div className="flex items-center mr-3">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formattedDate}
            </div>
          ) : email.scheduledFor ? (
            <div className="flex items-center mr-3">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {formattedDate}
            </div>
          ) : (
            <div className="flex items-center mr-3">
              <span className="text-gray-400">Draft</span>
            </div>
          )}
          
          {email.status === 'sent' && (
            <>
              <div className="flex items-center mr-3">
                <Eye className="h-3.5 w-3.5 mr-1" />
                {email.opens} {email.opens === 1 ? 'open' : 'opens'}
              </div>
              
              <div className="flex items-center">
                <MousePointer className="h-3.5 w-3.5 mr-1" />
                {email.clicks} {email.clicks === 1 ? 'click' : 'clicks'}
              </div>
            </>
          )}
        </div>
        
        {(contact || organization || deal) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {contact && (
              <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                To: {contact.name}
              </div>
            )}
            
            {organization && (
              <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                Org: {organization.name}
              </div>
            )}
            
            {deal && (
              <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                Deal: {deal.title}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCard;