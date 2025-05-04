import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import EmailCard from '../components/emails/EmailCard';
import EmailForm from '../components/emails/EmailForm';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { Plus, Mail, Search, X, Filter } from 'lucide-react';

const Emails: React.FC = () => {
  const { emails } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter emails based on search and status
  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchTerm === '' || 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Show scheduled emails first, then drafts, then sent (by date)
    if (a.status !== b.status) {
      if (a.status === 'scheduled') return -1;
      if (b.status === 'scheduled') return 1;
      if (a.status === 'draft') return -1;
      if (b.status === 'draft') return 1;
    }
    
    // For sent emails, sort by sent date (newest first)
    if (a.sentAt && b.sentAt) {
      return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
    }
    
    // For scheduled emails, sort by scheduled date (soonest first)
    if (a.scheduledFor && b.scheduledFor) {
      return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
    }
    
    // Fallback to creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  return (
    <div>
      <PageHeader
        title="Emails"
        subtitle="Compose, send, and track your email communications"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Compose Email
          </button>
        }
      />
      
      {emails.length > 0 ? (
        <>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search emails..."
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All Emails</option>
                <option value="sent">Sent</option>
                <option value="draft">Drafts</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
          
          {filteredEmails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEmails.map(email => (
                <EmailCard key={email.id} email={email} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No emails match your search</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or compose a new email.
              </p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No emails yet"
          description="Start by composing your first email"
          icon={<Mail className="h-6 w-6" />}
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Compose Email
            </button>
          }
        />
      )}
      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Compose Email"
        size="lg"
      >
        <EmailForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

export default Emails;