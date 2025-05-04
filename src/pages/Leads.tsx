import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import LeadCard from '../components/leads/LeadCard';
import LeadForm from '../components/leads/LeadForm';
import ConvertLeadForm from '../components/leads/ConvertLeadForm';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { Plus, Inbox, Search, X, Filter } from 'lucide-react';
import { Lead } from '../types';

const Leads: React.FC = () => {
  const { leads } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  
  // Get all unique sources from leads
  const sources = Array.from(new Set(leads.map(lead => lead.source).filter(Boolean)));
  
  // Filter leads based on search, status, and source
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.customFields?.company && lead.customFields.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });
  
  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowConvertModal(true);
  };
  
  const handleConvertSuccess = () => {
    setShowConvertModal(false);
    setSelectedLead(null);
    // In a real app, we would probably refresh the leads list here
  };
  
  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Manage and convert your leads into opportunities"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Lead
          </button>
        }
      />
      
      {leads.length > 0 ? (
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
                placeholder="Search leads..."
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
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="unqualified">Unqualified</option>
              </select>
            </div>
            
            {sources.length > 0 && (
              <div>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Sources</option>
                  {sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map(lead => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead}
                  onConvert={handleConvertClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No leads match your search</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or create a new lead.
              </p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No leads yet"
          description="Start by adding your first lead"
          icon={<Inbox className="h-6 w-6" />}
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Lead
            </button>
          }
        />
      )}
      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Lead"
        size="lg"
      >
        <LeadForm onClose={() => setShowCreateModal(false)} />
      </Modal>
      
      <Modal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        title="Convert Lead to Contact & Deal"
        size="lg"
      >
        {selectedLead && (
          <ConvertLeadForm 
            lead={selectedLead}
            onClose={() => setShowConvertModal(false)}
            onSuccess={handleConvertSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default Leads;