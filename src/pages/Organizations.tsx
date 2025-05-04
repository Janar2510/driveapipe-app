import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import OrganizationCard from '../components/organizations/OrganizationCard';
import OrganizationForm from '../components/organizations/OrganizationForm';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { Plus, Building2, Search, X } from 'lucide-react';

const Organizations: React.FC = () => {
  const { organizations } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  
  // Get all unique tags from organizations
  const allTags = Array.from(new Set(organizations.flatMap(org => org.tags)));
  
  // Filter organizations based on search and tags
  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = searchTerm === '' || 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.website && org.website.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = tagFilter.length === 0 || 
      tagFilter.some(tag => org.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  const toggleTagFilter = (tag: string) => {
    setTagFilter(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <div>
      <PageHeader
        title="Organizations"
        subtitle="Manage your organizations and their information"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Organization
          </button>
        }
      />
      
      {organizations.length > 0 ? (
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
                placeholder="Search organizations..."
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
          </div>
          
          {allTags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tagFilter.includes(tag)
                      ? 'bg-secondary-100 text-secondary-800 border border-secondary-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {tagFilter.length > 0 && (
                <button
                  onClick={() => setTagFilter([])}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
          
          {filteredOrganizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizations.map(organization => (
                <OrganizationCard key={organization.id} organization={organization} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No matching organizations</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No organizations yet"
          description="Add your first organization to start building your network"
          icon={<Building2 className="h-6 w-6" />}
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Organization
            </button>
          }
        />
      )}
      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Organization"
        size="lg"
      >
        <OrganizationForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

export default Organizations;