
import React, { useState } from 'react';
import { Task, Area, TeamMember, Role } from '../../types';
import { AREAS, TEAM_MEMBERS } from '../../constants';
import Modal from '../shared/Modal';
import { SparklesIcon } from '../shared/Icons';
import Spinner from '../shared/Spinner';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'statusHistory' | 'createdAt'>) => void;
  onGenerateDetails: (prompt: string) => Promise<{ title: string; description: string }>;
  teamMembers: TeamMember[];
  directorName: string;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onAddTask, onGenerateDetails, teamMembers, directorName }) => {
  const executors = teamMembers.filter(m => m.role === Role.Executor);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState<Area>(Area.Content);
  const [executor, setExecutor] = useState(executors[0]?.name || '');
  const [dueDate, setDueDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDetails = async () => {
    if (!title.trim()) {
      alert('Por favor, introduce una idea inicial en el título para generar detalles.');
      return;
    }
    setIsGenerating(true);
    try {
      const { title: newTitle, description: newDescription } = await onGenerateDetails(title);
      setTitle(newTitle);
      setDescription(newDescription);
    } catch (error) {
      console.error("Failed to generate task details with AI", error);
      // Optionally, show an error to the user
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate || !executor) {
      alert('Título, ejecutor y fecha de vencimiento son obligatorios.');
      return;
    }
    onAddTask({
      title,
      description,
      area,
      executor,
      dueDate,
      assigner: directorName,
    });
    // Reset form
    setTitle('');
    setDescription('');
    setArea(Area.Content);
    setExecutor(executors[0]?.name || '');
    setDueDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Nueva Tarea">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">Título de la Tarea</label>
          <div className="relative mt-1">
            <input 
              type="text" 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 pr-10 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ej: Posts para la campaña de verano"
            />
            <button
              type="button"
              onClick={handleGenerateDetails}
              disabled={isGenerating || !title.trim()}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-slate-400 hover:text-indigo-400 disabled:text-slate-600 disabled:cursor-not-allowed"
              aria-label="Generate with AI"
            >
              {isGenerating ? <Spinner /> : <SparklesIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">Descripción</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="ATHENA AI puede generar esto por ti..."></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="area" className="block text-sm font-medium text-slate-300">Área / Proceso</label>
                <select id="area" value={area} onChange={(e) => setArea(e.target.value as Area)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="executor" className="block text-sm font-medium text-slate-300">Ejecutor</label>
                <select id="executor" value={executor} onChange={(e) => setExecutor(e.target.value)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {executors.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
            </div>
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300">Fecha de Vencimiento</label>
          <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        </div>
        <div className="pt-4 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Asignar Tarea</button>
        </div>
      </form>
    </Modal>
  );
};

export default NewTaskModal;