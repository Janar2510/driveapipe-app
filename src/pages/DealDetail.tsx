import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import DealForm from '../components/deals/DealForm';
import ActivityForm from '../components/activities/ActivityForm';
import EmailForm from '../components/emails/EmailForm';
import ActivityCard from '../components/activities/ActivityCard';
import EmailCard from '../components/emails/EmailCard';
import { 
  Calendar, 
  Mail, 
  User, 
  Building2, 
  Clock, 
  DollarSign, 
  Tag, 
  ChevronLeft, 
  Trash2, 
  Edit, 
  Plus 
} from 'lucide-react';
import { format } from 'date-fns';

const DealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getDeal, 
    updateDeal, 
    deleteDeal, 
    getContact, 
    getOrganization, 
    createActivity, 
    createEmail, 
    getPipeline 
  } = useCRM();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const deal = getDeal(id || '');
  
  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-medium text-gray-900">Deal not found</h2>
        <Link 
          to="/deals" 
          className="mt-4 btn btn-primary"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Deals
        </Link>
      </div>
    );
  }
  
  // Get pipeline and stage
  const pipeline = getPipeline(deal.pipelineId);
  const stage = pipeline?.stages.find(s => s.id === deal.stageId);
  
  // Get organization and contacts
  const organization = deal.organizationId ? getOrganization(deal.organizationId) : undefined;
  const contacts = deal.contactIds.map(id => getContact(id)).filter(Boolean);
  
  // Format dates
  const createdDate = format(new Date(deal.createdAt), 'MMMM d, yyyy');
  const expectedCloseDate = deal.expectedCloseDate 
    ? format(new Date(deal.expectedCloseDate), 'MMMM d, yyyy')
    : 'Not set';
  
  // Calculate probability
  const probability = stage?.probability || 0;
  const weightedValue = (deal.value * probability) / 100;
  
  const handleDeleteDeal = () => {
    deleteDeal(deal.id);
    navigate('/deals');
  };

  return (
    <div>
      <div className="mb-6">
        <Link 
          to="/deals" 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Pipeline
        </Link>
      </div>
      
      <PageHeader
        title={deal.title}
        subtitle={`${deal.currency} ${deal.value.toLocaleString()}`}
        actions={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-secondary"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="btn btn-primary"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deal Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Contacts:</span>
                </div>
                <div className="mt-1 pl-6">
                  {contacts.length > 0 ? (
                    <ul className="space-y-1">
                      {contacts.map(contact => (
                        <li key={contact?.id}>
                          <Link 
                            to={`/contacts/${contact?.id}`}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            {contact?.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">No contacts linked</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm">
                  <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Organization:</span>
                </div>
                <div className="mt-1 pl-6">
                  {organization ? (
                    <Link 
                      to={`/organizations/${organization.id}`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      {organization.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">No organization linked</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Value:</span>
                </div>
                <div className="mt-1 pl-6">
                  <span className="text-gray-900">{deal.currency} {deal.value.toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Expected close:</span>
                </div>
                <div className="mt-1 pl-6">
                  <span className="text-gray-900">{expectedCloseDate}</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm">
                  <Tag className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Tags:</span>
                </div>
                <div className="mt-1 pl-6">
                  {deal.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {deal.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No tags</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Created:</span>
                </div>
                <div className="mt-1 pl-6">
                  <span className="text-gray-900">{createdDate}</span>
                </div>
              </div>
            </div>
            
            {pipeline && stage && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Pipeline Status</h4>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{pipeline.name}:</span>
                  <span className="ml-2 text-sm text-gray-700">{stage.name}</span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {stage.probability}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5 w-full">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${stage.probability}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Weighted Value: <span className="font-medium text-gray-900">{deal.currency} {weightedValue.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Deal History */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deal History</h3>
            {deal.history.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {deal.history.map((historyItem, index) => (
                    <li key={historyItem.id}>
                      <div className="relative pb-8">
                        {index !== deal.history.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary-600" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">Moved to <span className="font-medium">{historyItem.stageName}</span></p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {format(new Date(historyItem.date), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No history available</p>
            )}
          </div>
        </div>
        
        {/* Activities and Emails */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Activities</h3>
              <button
                onClick={() => setShowActivityModal(true)}
                className="btn btn-sm btn-primary"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </button>
            </div>
            
            {deal.activities.length > 0 ? (
              <div className="space-y-4">
                {deal.activities.map(activityId => {
                  // This would be implemented in a real app
                  const activity = { id: activityId }; // Placeholder
                  return (
                    <ActivityCard 
                      key={activityId}
                      activity={activity as any}
                      onComplete={() => {}} // Placeholder
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No activities yet</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Emails</h3>
              <button
                onClick={() => setShowEmailModal(true)}
                className="btn btn-sm btn-primary"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Compose
              </button>
            </div>
            
            {deal.emails.length > 0 ? (
              <div className="space-y-4">
                {deal.emails.map(emailId => {
                  // This would be implemented in a real app
                  const email = { id: emailId }; // Placeholder
                  return (
                    <EmailCard 
                      key={emailId}
                      email={email as any}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No emails yet</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Deal Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Deal"
        size="lg"
      >
        <DealForm
          deal={deal}
          pipelineId={deal.pipelineId}
          stageId={deal.stageId}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>
      
      {/* Add Activity Modal */}
      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Add Activity"
        size="lg"
      >
        <ActivityForm
          dealId={deal.id}
          contactId={deal.contactIds[0]}
          organizationId={deal.organizationId}
          onClose={() => setShowActivityModal(false)}
        />
      </Modal>
      
      {/* Compose Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Compose Email"
        size="lg"
      >
        <EmailForm
          dealId={deal.id}
          contactId={deal.contactIds[0]}
          organizationId={deal.organizationId}
          onClose={() => setShowEmailModal(false)}
        />
      </Modal>
      
      {/* Delete Deal Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Deal"
        size="md"
      >
        <div className="p-6">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this deal? This action cannot be undone.
          </p>
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="btn btn-error w-full sm:w-auto sm:ml-3"
              onClick={handleDeleteDeal}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DealDetail;