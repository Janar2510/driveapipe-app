import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Pipeline as PipelineType, Stage } from '../../types';
import { useCRM } from '../../context/CRMContext';
import DealCard from './DealCard';
import DealForm from './DealForm';
import StageForm from '../settings/StageForm';
import Modal from '../common/Modal';
import { getDaysBetween } from '../../utils/dateUtils';

interface PipelineProps {
  pipeline: PipelineType;
  onPipelineChange?: (pipeline: PipelineType) => void;
}

const Pipeline: React.FC<PipelineProps> = ({ pipeline, onPipelineChange }) => {
  const { updatePipeline, updateDeal } = useCRM();
  const [showDealForm, setShowDealForm] = useState(false);
  const [showStageForm, setShowStageForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  // Calculate total and weighted values
  const pipelineStats = pipeline.stages.reduce((acc, stage) => {
    const stageValue = stage.deals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = (stageValue * stage.probability) / 100;
    
    return {
      totalValue: acc.totalValue + stageValue,
      weightedValue: acc.weightedValue + weightedValue,
    };
  }, { totalValue: 0, weightedValue: 0 });

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Drop outside the list or no change
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Get source and destination stages
    const sourceStage = pipeline.stages.find(s => s.id === source.droppableId);
    const destStage = pipeline.stages.find(s => s.id === destination.droppableId);

    if (!sourceStage || !destStage) return;

    // Get the deal being moved
    const deal = sourceStage.deals.find(d => d.id === draggableId);
    if (!deal) return;

    // Create history entry for stage change
    const now = new Date().toISOString();
    const historyEntry = {
      id: crypto.randomUUID(),
      dealId: deal.id,
      stageId: destination.droppableId,
      stageName: destStage.name,
      date: now,
      userId: deal.ownerId,
      userName: 'Current User', // This would normally come from a user lookup
    };

    // Update the deal with new stage and history
    updateDeal(draggableId, {
      stageId: destination.droppableId,
      history: [...deal.history, historyEntry],
      updatedAt: now,
    });
  };

  const handleStageUpdate = (stageId: string, data: Partial<Stage>) => {
    const updatedStages = pipeline.stages.map(stage =>
      stage.id === stageId ? { ...stage, ...data } : stage
    );

    const updatedPipeline = {
      ...pipeline,
      stages: updatedStages,
    };

    updatePipeline(pipeline.id, updatedPipeline);
    onPipelineChange?.(updatedPipeline);
  };

  const handleAddStage = (data: Pick<Stage, 'name' | 'probability'>) => {
    const newStage: Stage = {
      id: crypto.randomUUID(),
      name: data.name,
      probability: data.probability,
      position: pipeline.stages.length,
      pipelineId: pipeline.id,
      deals: [],
    };

    const updatedPipeline = {
      ...pipeline,
      stages: [...pipeline.stages, newStage],
    };

    updatePipeline(pipeline.id, updatedPipeline);
    onPipelineChange?.(updatedPipeline);
    setShowStageForm(false);
  };

  const startEditingStage = (stage: Stage) => {
    setSelectedStage(stage);
    setShowStageForm(true);
  };

  const handleStageFormSubmit = (data: Pick<Stage, 'name' | 'probability'>) => {
    if (selectedStage) {
      handleStageUpdate(selectedStage.id, data);
    } else {
      handleAddStage(data);
    }
    setShowStageForm(false);
    setSelectedStage(null);
  };

  const handleDeleteStage = () => {
    if (!selectedStage || pipeline.stages.length <= 1) return;

    // Remove the stage and its deals
    const updatedStages = pipeline.stages.filter(stage => stage.id !== selectedStage.id);

    // Re-index positions
    const reindexedStages = updatedStages.map((stage, index) => ({
      ...stage,
      position: index,
    }));

    const updatedPipeline = {
      ...pipeline,
      stages: reindexedStages,
    };

    updatePipeline(pipeline.id, updatedPipeline);
    onPipelineChange?.(updatedPipeline);
    setShowDeleteModal(false);
    setSelectedStage(null);
  };

  const openDealForm = (stage: Stage) => {
    setSelectedStage(stage);
    setShowDealForm(true);
  };

  const closeDealForm = () => {
    setShowDealForm(false);
    setSelectedStage(null);
  };

  // Check for stale deals
  const checkDealRot = (deal: Deal): boolean => {
    if (deal.history.length === 0) return false;
    
    const lastStageChange = new Date(deal.history[deal.history.length - 1].date);
    const daysSinceChange = getDaysBetween(lastStageChange, new Date());
    
    // Default rot threshold is 14 days
    return daysSinceChange > 14;
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-white">{pipeline.name}</h2>
          <p className="text-sm text-gray-400">
            Total Value: {pipelineStats.totalValue.toLocaleString()} • 
            Weighted Value: {pipelineStats.weightedValue.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedStage(null);
            setShowStageForm(true);
          }}
          className="inline-flex items-center px-3 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-primary-900/50 hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Stage
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {pipeline.stages.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 flex flex-col"
            >
              <div className="bg-gray-900/40 backdrop-blur-md rounded-t-md p-3 border border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-white">
                      {stage.name}
                    </h3>
                    <div className="flex items-center ml-2">
                      <button
                        onClick={() => startEditingStage(stage)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      {pipeline.stages.length > 1 && (
                        <button
                          onClick={() => {
                            setSelectedStage(stage);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">
                      {stage.probability}%
                    </span>
                    <span className="text-xs bg-gray-800/50 rounded-full px-2 py-1 text-gray-300">
                      {stage.deals.length}
                    </span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {stage.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()} in value
                </div>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[200px] p-2 border-l border-r border-b border-white/10 overflow-y-auto ${
                      snapshot.isDraggingOver ? 'bg-gray-800/30' : 'bg-gray-900/20'
                    } backdrop-blur-md rounded-b-md transition-colors duration-200`}
                  >
                    {stage.deals.map((deal, index) => (
                      <DealCard 
                        key={deal.id} 
                        deal={deal} 
                        index={index}
                        isStale={checkDealRot(deal)}
                      />
                    ))}
                    {provided.placeholder}

                    <button
                      onClick={() => openDealForm(stage)}
                      className="w-full mt-2 py-2 flex items-center justify-center text-sm text-gray-400 hover:text-white hover:bg-gray-800/30 rounded border border-white/10 border-dashed transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Deal
                    </button>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Modal
        isOpen={showDealForm}
        onClose={closeDealForm}
        title="Add New Deal"
        size="lg"
      >
        {selectedStage && (
          <DealForm
            pipelineId={pipeline.id}
            stageId={selectedStage.id}
            onClose={closeDealForm}
          />
        )}
      </Modal>

      <Modal
        isOpen={showStageForm}
        onClose={() => setShowStageForm(false)}
        title={selectedStage ? 'Edit Stage' : 'Add Stage'}
        size="md"
      >
        <StageForm
          stage={selectedStage || undefined}
          onSubmit={handleStageFormSubmit}
          onClose={() => setShowStageForm(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Stage"
        size="md"
      >
        <div className="p-6">
          <div className="text-sm text-gray-300">
            Are you sure you want to delete the stage '{selectedStage?.name}'?
            {selectedStage?.deals.length ? (
              <p className="mt-2 text-red-400">
                Warning: This will also remove {selectedStage.deals.length} deal{selectedStage.deals.length !== 1 ? 's' : ''} in this stage.
              </p>
            ) : null}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-white bg-gray-900/50 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteStage}
              className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-white bg-red-900/50 hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              Delete Stage
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Pipeline;