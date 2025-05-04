import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import ContactForm from '../components/contacts/ContactForm';
import ActivityForm from '../components/activities/ActivityForm';
import EmailForm from '../components/emails/EmailForm';
import ActivityCard from '../components/activities/ActivityCard';
import EmailCard from '../components/emails/EmailCard';
import DealCard from '../components/deals/DealCard';
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
        <h2 className="text-xl font-medium text-gray-900">Contact not found</h2>
        <Link 
          to="/contacts" 
          className="mt-4 btn btn-primary"
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
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
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
        {/* Contact Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Email:</span>
                </div>
                <div className="mt-1 pl-6">
                  {contact.email ? (
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-primary-600 hover:text-primary-800"
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
                  <span className="font-medium text-gray-500">Phone:</span>
                </div>
                <div className="mt-1 pl-6">
                  {contact.phone ? (
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-primary-600 hover:text-primary-800"
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
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Created:</span>
                </div>
                <div className="mt-1 pl-6">
                  <span className="text-gray-900">{createdDate}</span>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-center text-sm">
                  <Tag className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-500">Tags:</span>
                </div>
                <div className="mt-1 pl-6">
                  {contact.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map(tag => (
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
            </div>
            
            {/* Custom Fields */}
            {Object.keys(contact.customFields).length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Custom Fields</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(contact.customFields).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </div>
                      <div className="mt-1 text-sm text-gray-900">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Deals */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Deals</h3>
              <Link 
                to="/deals"
                className="btn btn-sm btn-primary"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No deals</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new deal with this contact.
                </p>
                <div className="mt-6">
                  <Link 
                    to="/deals"
                    className="btn btn-primary"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No emails</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Send your first email to this contact.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="btn btn-primary"
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
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this contact? This action cannot be undone.
          </p>
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="btn btn-error w-full sm:w-auto sm:ml-3"
              onClick={handleDeleteContact}
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

export default ContactDetail;