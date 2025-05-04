import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { User, Automation, CustomField, EmailTemplate } from '../types';
import PageHeader from '../components/common/PageHeader';
import AutomationCard from '../components/automations/AutomationCard';
import Modal from '../components/common/Modal';
import { 
  Users, 
  Database, 
  Zap,
  Settings as SettingsIcon,
  Mail,
  Calendar,
  ExternalLink,
  Plus,
  FileText
} from 'lucide-react';
import EmailTemplateForm from '../components/settings/EmailTemplateForm';

const Settings: React.FC = () => {
  const { 
    currentUser, 
    users, 
    setCurrentUser, 
    pipelines,
    automations, 
    customFields,
    emailTemplates,
    updateAutomation,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate
  } = useCRM();
  
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'fields' | 'automations' | 'templates' | 'integrations'>('general');
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  
  const handleToggleAutomation = (id: string, isActive: boolean) => {
    updateAutomation(id, { isActive });
  };
  
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure your CRM settings and preferences"
      />
      
      <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <SettingsIcon className="h-4 w-4 mr-2 inline-block" />
              General
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4 mr-2 inline-block" />
              Users & Permissions
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fields'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Database className="h-4 w-4 mr-2 inline-block" />
              Custom Fields
            </button>
            <button
              onClick={() => setActiveTab('automations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'automations'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Zap className="h-4 w-4 mr-2 inline-block" />
              Automations
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 mr-2 inline-block" />
              Email Templates
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'integrations'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <ExternalLink className="h-4 w-4 mr-2 inline-block" />
              Integrations
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-medium text-white mb-4">General Settings</h2>
              
              <div className="max-w-3xl">
                <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-white">Company Information</h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-300">
                          Company name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="companyName"
                            id="companyName"
                            defaultValue="Driveapipe"
                            className="block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="timezone" className="block text-sm font-medium leading-6 text-gray-300">
                          Timezone
                        </label>
                        <div className="mt-2">
                          <select
                            id="timezone"
                            name="timezone"
                            className="block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:max-w-xs sm:text-sm sm:leading-6"
                            defaultValue="America/New_York"
                          >
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="UTC">UTC</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="currency" className="block text-sm font-medium leading-6 text-gray-300">
                          Default Currency
                        </label>
                        <div className="mt-2">
                          <select
                            id="currency"
                            name="currency"
                            className="block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:max-w-xs sm:text-sm sm:leading-6"
                            defaultValue="USD"
                          >
                            <option value="USD">USD - $</option>
                            <option value="EUR">EUR - €</option>
                            <option value="GBP">GBP - £</option>
                            <option value="CAD">CAD - $</option>
                            <option value="AUD">AUD - $</option>
                            <option value="JPY">JPY - ¥</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="dateFormat" className="block text-sm font-medium leading-6 text-gray-300">
                          Date Format
                        </label>
                        <div className="mt-2">
                          <select
                            id="dateFormat"
                            name="dateFormat"
                            className="block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:max-w-xs sm:text-sm sm:leading-6"
                            defaultValue="MM/DD/YYYY"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Users & Permissions</h2>
              
              <div className="overflow-hidden bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Email</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Role</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <tr key={user.id} className={user.id === currentUser?.id ? 'bg-primary-900/20' : ''}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {user.avatar ? (
                                <img 
                                  className="h-10 w-10 rounded-full ring-2 ring-primary-500/30" 
                                  src={user.avatar} 
                                  alt={user.name} 
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-100 font-medium text-lg ring-2 ring-primary-500/30">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-white">{user.name}</div>
                              {user.id === currentUser?.id && (
                                <div className="text-xs text-primary-400">Current User</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 capitalize">{user.role}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          <span className="inline-flex items-center rounded-full bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-100 ring-1 ring-green-500/30">
                            Active
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {user.id !== currentUser?.id ? (
                            <button
                              type="button"
                              onClick={() => setCurrentUser(user)}
                              className="text-primary-400 hover:text-primary-300"
                            >
                              Switch to<span className="sr-only">, {user.name}</span>
                            </button>
                          ) : (
                            <span className="text-gray-500">Current User</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'fields' && (
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Custom Fields</h2>
              
              <div className="mb-6">
                <div className="sm:hidden">
                  <label htmlFor="fieldEntity" className="sr-only">Select entity</label>
                  <select
                    id="fieldEntity"
                    name="fieldEntity"
                    className="block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    defaultValue="deal"
                  >
                    <option value="deal">Deals</option>
                    <option value="contact">Contacts</option>
                    <option value="organization">Organizations</option>
                    <option value="lead">Leads</option>
                  </select>
                </div>
                <div className="hidden sm:block">
                  <div className="border-b border-white/10">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {['deal', 'contact', 'organization', 'lead'].map((entity) => (
                        <button
                          key={entity}
                          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            entity === 'deal'
                              ? 'border-primary-500 text-primary-400'
                              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          {entity.charAt(0).toUpperCase() + entity.slice(1)}s
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Field Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Type</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Required</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {customFields
                      .filter(field => field.entityType === 'deal')
                      .map((field) => (
                      <tr key={field.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                          {field.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 capitalize">
                          {field.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {field.isRequired ? 'Yes' : 'No'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button type="button" className="text-primary-400 hover:text-primary-300">
                            Edit<span className="sr-only">, {field.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <button type="button" className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Custom Field
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'automations' && (
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Workflow Automations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {automations.map(automation => (
                  <AutomationCard
                    key={automation.id}
                    automation={automation}
                    onToggle={handleToggleAutomation}
                    onClick={() => {
                      setShowAutomationModal(true);
                    }}
                  />
                ))}
              </div>
              
              <div className="mt-6">
                <button type="button" className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                  <Plus className="h-4 w-4 mr-1" />
                  Create Automation
                </button>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Email Templates</h2>
                <button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setShowTemplateModal(true);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Template
                </button>
              </div>

              <div className="overflow-hidden bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Subject</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {emailTemplates.map((template) => (
                      <tr key={template.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                          {template.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-300">
                          {template.subject}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowTemplateModal(true);
                            }}
                            className="text-primary-400 hover:text-primary-300 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowDeleteTemplateModal(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'integrations' && (
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Integrations</h2>
              
              <div className="max-w-3xl">
                <div className="rounded-md bg-blue-900/50 p-4 mb-6 border border-blue-500/30">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-300">
                        Integrations are simulated in this demo. Configuration changes won't be saved.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 divide-y divide-white/10">
                  {/* Email Integration */}
                  <div className="px-4 py-6 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold leading-6 text-white flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-gray-400" />
                          Email Integration
                        </h3>
                        <p className="mt-1 text-sm text-gray-300">
                          Connect your email to automatically track conversations with contacts
                        </p>
                      </div>
                      <div className="mt-5 sm:mt-0">
                        <button type="button" className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calendar Integration */}
                  <div className="px-4 py-6 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold leading-6 text-white flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                          Calendar Integration
                        </h3>
                        <p className="mt-1 text-sm text-gray-300">
                          Sync your calendar with Driveapipe to manage meetings and activities
                        </p>
                      </div>
                      <div className="mt-5 sm:mt-0">
                        <button type="button" className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Webhooks */}
                  <div className="px-4 py-6 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold leading-6 text-white flex items-center">
                          <ExternalLink className="h-5 w-5 mr-2 text-gray-400" />
                          Webhooks
                        </h3>
                        <p className="mt-1 text-sm text-gray-300">
                          Send data to external systems when events occur in Driveapipe
                        </p>
                      </div>
                      <div className="mt-5 sm:mt-0">
                        <button type="button" className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Modal
        isOpen={showAutomationModal}
        onClose={() => setShowAutomationModal(false)}
        title="Edit Automation"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-300">Automation editor would go here.</p>
          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              className="px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-gray-900/50 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
              onClick={() => setShowAutomationModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              onClick={() => setShowAutomationModal(false)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Email Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          setSelectedTemplate(null);
        }}
        title={selectedTemplate ? 'Edit Template' : 'Create Template'}
        size="lg"
      >
        <EmailTemplateForm
          template={selectedTemplate || undefined}
          onSubmit={async (data) => {
            if (selectedTemplate) {
              await updateEmailTemplate(selectedTemplate.id, data);
            } else {
              await createEmailTemplate({
                ...data,
                ownerId: currentUser?.id || '',
              });
            }
            setShowTemplateModal(false);
            setSelectedTemplate(null);
          }}
          onClose={() => {
            setShowTemplateModal(false);
            setSelectedTemplate(null);
          }}
        />
      </Modal>

      {/* Delete Template Modal */}
      <Modal
        isOpen={showDeleteTemplateModal}
        onClose={() => {
          setShowDeleteTemplateModal(false);
          setSelectedTemplate(null);
        }}
        title="Delete Template"
        size="md"
      >
        <div className="p-6">
          <p className="text-sm text-gray-300">
            
            Are you sure you want to delete the template '{selectedTemplate?.name}'? This action cannot be undone.
          </p>
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex justify-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-red-900/50 hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 w-full sm:w-auto sm:ml-3"
              onClick={() => {
                if (selectedTemplate) {
                  deleteEmailTemplate(selectedTemplate.id);
                }
                setShowDeleteTemplateModal(false);
                setSelectedTemplate(null);
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 sm:mt-0 inline-flex justify-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-gray-900/50 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 w-full sm:w-auto"
              onClick={() => {
                setShowDeleteTemplateModal(false);
                setSelectedTemplate(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;