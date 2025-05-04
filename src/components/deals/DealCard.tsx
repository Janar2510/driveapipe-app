import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import { getDaysFromNow } from '../../utils/dateUtils';
import { Deal, Contact, Organization } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { AlertTriangle } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  index: number;
  isStale?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({ deal, index, isStale }) => {
  const { contacts, organizations, pipelines } = useCRM();
  
  // Get primary contact
  const primaryContact: Contact | undefined = 
    deal.contactIds.length > 0 
      ? contacts.find(contact => contact.id === deal.contactIds[0])
      : undefined;
  
  // Get organization
  const organization: Organization | undefined = 
    deal.organizationId 
      ? organizations.find(org => org.id === deal.organizationId)
      : undefined;
  
  // Get pipeline and stage for probability
  const pipeline = pipelines.find(p => p.id === deal.pipelineId);
  const stage = pipeline?.stages.find(s => s.id === deal.stageId);
  
  // Calculate weighted value
  const weightedValue = stage 
    ? (deal.value * stage.probability) / 100
    : 0;

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`bg-gray-900/40 backdrop-blur-md rounded-lg border ${
              isStale ? 'border-red-500/30' : 'border-white/10'
            } hover:bg-gray-900/50 transition-all duration-200 mb-2`}
          >
            <Link to={`/deals/${deal.id}`} className="block p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-white truncate pr-8">{deal.title}</h3>
                  <div className="mt-1 text-sm">
                    <span className="text-gray-300">{deal.currency} {deal.value.toLocaleString()}</span>
                    {stage && (
                      <span className="text-gray-400 ml-2">
                        • {stage.probability}% = {deal.currency} {weightedValue.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                {isStale && (
                  <div className="flex-shrink-0 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-sm text-gray-300">
                {primaryContact && (
                  <div className="flex items-center">
                    <span className="truncate">{primaryContact.name}</span>
                    {organization && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="truncate">{organization.name}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {deal.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {deal.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900/50 text-primary-100 ring-1 ring-primary-500/30">
                      {tag}
                    </span>
                  ))}
                  {deal.tags.length > 2 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900/50 text-gray-100 ring-1 ring-white/20">
                      +{deal.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
              
              <div className="mt-2 flex justify-between items-center">
                {deal.expectedCloseDate && (
                  <div className="text-xs text-gray-400">
                    Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </div>
                )}
                
                {isStale && deal.history.length > 0 && (
                  <div className="text-xs font-medium text-red-400">
                    {getDaysFromNow(new Date(deal.history[deal.history.length - 1].date))} days in stage
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};

export default DealCard;