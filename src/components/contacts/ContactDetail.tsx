import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import PageHeader from '../common/PageHeader';
import Modal from '../common/Modal';
import ContactForm from './ContactForm';
import ActivityForm from '../activities/ActivityForm';
import EmailForm from '../emails/EmailForm';
import ActivityCard from '../activities/ActivityCard';
import EmailCard from '../emails/EmailCard';
import DealCard from '../deals/DealCard';
import { 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  Tag, 
  ChevronLeft, 
  Trash2, 
  Edit, 
  Plus,
  GitBranch,
  FileText 
} from 'lucide-react';
import { format } from 'date-fns';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getContact, 
    getOrganization, 
    updateContact, 
    deleteContact, 
    deals, 
    activities, 
    emails 
  } = useCRM();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const contact = getContact(id || '');
  
  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-medium text-white">Contact not found</h2>
        <Link 
          to="/contacts" 
          className="mt-4 inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Contacts
        </Link>
      </div>
    );
  }
  
  // Get organization
  const organization = contact.organizationId ? getOrganization(contact.organizationId) : undefined;
  
  // Get related deals
  const contactDeals = deals.filter(deal => deal.contactIds.includes(contact.id));
  
  // Get related activities
  const contactActivities = activities.filter(activity => activity.contactId === contact.id);
  
  // Get related emails
  const contactEmails = emails.filter(email => email.contactId === contact.id);
  
  // Format dates
  const createdDate = format(new Date(contact.createdAt), 'MMMM d, yyyy');
  
  const handleDeleteContact = () => {
    deleteContact(contact.id);
    navigate('/contacts');
  };

  return (
    <div>
      <div className="mb-6">
        <Link 
          to="/contacts" 
          className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Contacts
        </Link>
      </div>
      
      <PageHeader
        title={contact.name}
        subtitle={contact.email || ''}
        actions={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-red-900/50 hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="md:col-span-2">
          <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 p-6 mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-300">Email:</span>
                </div>
                <div className="mt-1 pl-6">
                  {contact.email ? (
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-primary-400 hover:text-primary-300"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-gray-500">No email provided</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-300">Phone:</span>
                </div>
                <div className="mt-1 pl-6">
                  {contact.phone ? (
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-primary-400 hover:text-primary-300"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-gray-500">No phone provided</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm">
                  <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-300">Organization:</span>
                </div>
                <div className="mt-1 pl-6">
                  {organization ? (
                    <Link 
                      to={`/organizations/${organization.id}`}
                      className="text-primary-400 hover:text-primary-300"
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
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-300">Created:</span>
                </div>
                <div className="mt-1 pl-6">
                  <span className="text-gray-300">{createdDate}</span>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-center text-sm">
                  <Tag className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-300">Tags:</span>
                </div>
                <div className="mt-1 pl-6">
                  {contact.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900/50 text-primary-100 ring-1 ring-primary-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No tags</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Custom Fields */}
            {Object.keys(contact.customFields).length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Custom Fields</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(contact.customFields).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-sm font-medium text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </div>
                      <div className="mt-1 text-sm text-gray-400">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Deals */}
          <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Deals</h3>
              <Link 
                to="/deals"
                className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Deal
              </Link>
            </div>
            
            {contactDeals.length > 0 ? (
              <div className="space-y-4">
                {contactDeals.map((deal, index) => (
                  <DealCard key={deal.id} deal={deal} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <GitBranch className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No deals</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Get started by creating a new deal with this contact.
                </p>
                <div className="mt-6">
                  <Link 
                    to="/deals"
                    className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Deal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Activities and Emails */}
        <div className="md:col-span-1">
          <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Activities</h3>
              <button
                onClick={() => setShowActivityModal(true)}
                className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </button>
            </div>
            
            {contactActivities.length > 0 ? (
              <div className="space-y-4">
                {contactActivities.map(activity => (
                  <ActivityCard 
                    key={activity.id}
                    activity={activity}
                    onComplete={() => {}}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No activities yet</p>
            )}
          </div>
          
          <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Emails</h3>
              <button
                onClick={() => setShowEmailModal(true)}
                className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Compose
              </button>
            </div>
            
            {contactEmails.length > 0 ? (
              <div className="space-y-4">
                {contactEmails.map(email => (
                  <EmailCard 
                    key={email.id}
                    email={email}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No emails</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Send your first email to this contact.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Compose
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Contact Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          contact={contact}
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
          contactId={contact.id}
          organizationId={contact.organizationId}
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
          contactId={contact.id}
          organizationId={contact.organizationId}
          onClose={() => setShowEmailModal(false)}
        />
      </Modal>
      
      {/* Delete Contact Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
        size="md"
      >
        <div className="p-6">
          <p className="text-sm text-gray-300">
            Are you sure you want to delete this contact? This action cannot be undone.
          </p>
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex justify-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-red-900/50 hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 w-full sm:w-auto sm:ml-3"
              onClick={handleDeleteContact}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 sm:mt-0 inline-flex justify-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-gray-900/50 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 w-full sm:w-auto"
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

export default ContactDetail;