import React from 'react';
import { Task, Area, ExternalPlatformLink, TeamMember } from '../../types';
import TaskItem from './TaskItem';
import { AREAS } from '../../constants';

interface TaskMatrixProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: any, evidence?: string, tangibleResult?: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  teamMembers: TeamMember[];
  activeFilter: Area | 'All';
  onFilterChange: (filter: Area | 'All') => void;
  onRequestSharing: (taskId: string) => void;
  onAddExternalLink: (taskId: string, link: ExternalPlatformLink) => void;
  onAddClientSignature: (taskId: string, signatureDataUrl: string) => void;
}

const TaskMatrix: React.FC<TaskMatrixProps> = ({ 
  tasks, 
  onStatusChange, 
  onUpdateTask,
  teamMembers,
  activeFilter, 
  onFilterChange, 
  onRequestSharing, 
  onAddExternalLink,
  onAddClientSignature
}) => {
  const filterOptions: (Area | 'All')[] = ['All', ...AREAS];

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Matriz de Tareas</h2>
      <p className="text-slate-400 mb-6">Tus puntos de control y cierre. La evidencia es clave para el progreso.</p>
      
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {filterOptions.map(option => {
          const isActive = activeFilter === option;
          const label = option === 'All' ? 'Todas las Áreas' : option;
          return (
            <button
              key={option}
              onClick={() => onFilterChange(option)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onStatusChange={onStatusChange} 
              onUpdateTask={onUpdateTask}
              teamMembers={teamMembers}
              onRequestSharing={onRequestSharing}
              onAddExternalLink={onAddExternalLink}
              onAddClientSignature={onAddClientSignature}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-slate-800/30 rounded-lg border border-slate-700/50">
             <p className="text-slate-400">No hay tareas que coincidan con el filtro seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskMatrix;