import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import PageHeader from '../components/common/PageHeader';
import Pipeline from '../components/deals/Pipeline';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { Plus, GitBranch } from 'lucide-react';
import { Pipeline as PipelineType } from '../types';

const Deals: React.FC = () => {
  const { pipelines, createPipeline } = useCRM();
  const [selectedPipeline, setSelectedPipeline] = useState<string>(
    pipelines.length > 0 ? pipelines[0].id : ''
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');

  const handleCreatePipeline = () => {
    if (!newPipelineName.trim()) return;

    // Create default stages with proper structure
    const defaultStages = [
      { name: 'Qualification', position: 0, probability: 10 },
      { name: 'Meeting', position: 1, probability: 25 },
      { name: 'Proposal', position: 2, probability: 50 },
      { name: 'Negotiation', position: 3, probability: 80 },
      { name: 'Closed Won', position: 4, probability: 100 },
      { name: 'Closed Lost', position: 5, probability: 0 },
    ];

    // Create the pipeline with initialized stages
    const newPipeline = createPipeline({
      name: newPipelineName,
      stages: defaultStages.map(stage => ({
        ...stage,
        id: crypto.randomUUID(), // Generate unique ID for each stage
        pipelineId: '', // Will be set by createPipeline
        deals: [], // Initialize empty deals array
      })),
    });

    setSelectedPipeline(newPipeline.id);
    setNewPipelineName('');
    setShowCreateModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Deals"
        subtitle="Manage your sales pipeline and deals"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Pipeline
          </button>
        }
      />

      {pipelines.length > 0 ? (
        <>
          <div className="mb-6">
            <label htmlFor="pipeline-select" className="sr-only">Select Pipeline</label>
            <select
              id="pipeline-select"
              value={selectedPipeline}
              onChange={(e) => setSelectedPipeline(e.target.value)}
              className="block w-full md:w-64 rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
            >
              {pipelines.map((pipeline) => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </option>
              ))}
            </select>
          </div>

          {selectedPipeline && (
            <div className="mt-4">
              <Pipeline
                pipeline={pipelines.find(p => p.id === selectedPipeline) as PipelineType}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No pipelines yet"
          description="Create your first pipeline to start managing your deals"
          icon={<GitBranch className="h-6 w-6" />}
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Pipeline
            </button>
          }
        />
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Pipeline"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreatePipeline(); }}>
          <div className="mb-4">
            <label htmlFor="pipeline-name" className="block text-sm font-medium text-white">
              Pipeline Name
            </label>
            <input
              type="text"
              id="pipeline-name"
              value={newPipelineName}
              onChange={(e) => setNewPipelineName(e.target.value)}
              className="mt-1 block w-full rounded-md border-0 bg-gray-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
              placeholder="e.g., Main Sales Pipeline"
              required
            />
            <p className="mt-1 text-sm text-gray-400">
              Your pipeline will be created with default stages that you can customize later.
            </p>
          </div>
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-white/10 bg-primary-900/50 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 sm:ml-3 sm:w-auto"
            >
              Create Pipeline
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-white/10 bg-gray-900/50 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 sm:mt-0 sm:w-auto"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Deals;