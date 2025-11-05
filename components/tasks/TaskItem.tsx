import React, { useState, useEffect, useRef } from 'react';
import { format, isPast } from 'date-fns';
import { Task, Status, Area, ExternalPlatformLink, TeamMember } from '../../types';
import { STATUSES, AREAS } from '../../constants';
import StatusSelector from './StatusSelector';
import { ClockIcon, CalendarIcon, AreaIcon, WarningIcon, ShareIcon, CheckIcon, LinkIcon, UsersIcon, UserCircleIcon, PencilSwooshIcon, PencilIcon } from '../shared/Icons';
import SignatureModal from '../modals/SignatureModal';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, status: Status, evidence?: string, tangibleResult?: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  teamMembers: TeamMember[];
  onRequestSharing: (taskId:string) => void;
  onAddExternalLink: (taskId: string, link: ExternalPlatformLink) => void;
  onAddClientSignature: (taskId: string, signatureDataUrl: string) => void;
}

const ApprovalStatusBadge: React.FC<{ status: Task['sharingApprovalStatus'] }> = ({ status }) => {
  if (!status) return null;

  const config = {
    PENDING: { text: 'Pendiente de Aprobación', color: 'text-amber-400 bg-amber-500/10' },
    APPROVED: { text: 'Aprobado para compartir', color: 'text-green-400 bg-green-500/10' },
    REJECTED: { text: 'Rechazado', color: 'text-red-400 bg-red-500/10' },
  }[status];

  return <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.color}`}>{config.text}</span>;
};

const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
};


const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onUpdateTask, teamMembers, onRequestSharing, onAddExternalLink, onAddClientSignature }) => {
  const [evidenceLink, setEvidenceLink] = useState(task.evidenceLink || '');
  const [tangibleResult, setTangibleResult] = useState(task.tangibleResult || '');
  const [isCopied, setIsCopied] = useState(false);
  const [platformName, setPlatformName] = useState('');
  const [platformUrl, setPlatformUrl] = useState('');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>(task);
  const [comments, setComments] = useState(task.comments || '');
  const evidenceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEvidenceLink(task.evidenceLink || '');
    setTangibleResult(task.tangibleResult || '');
    setComments(task.comments || '');
    setEditedTask(task);
  }, [task]);

  const handleStatusSelect = (status: Status) => {
    const isCompletion = status.id === 'COMPLETED' || status.id === 'EXCEPTIONAL';

    if ((status.id === 'IN_PROGRESS' || status.id === 'BLOCKED') && evidenceLink.trim() !== '') {
        alert("Por favor, borre el link de evidencia antes de cambiar el estado a 'En Curso' o 'Bloqueado'. Este campo es solo para la entrega final.");
        return;
    }

    if (isCompletion) {
      if (evidenceLink.trim() && !isValidUrl(evidenceLink)) {
        alert('El formato del Link de Evidencia no es válido. Por favor, introduce una URL completa (ej: https://example.com).');
        return;
      }
      onStatusChange(task.id, status, evidenceLink, tangibleResult);
      setTimeout(() => evidenceInputRef.current?.focus(), 0);
    } else {
      onStatusChange(task.id, status, '', '');
      setEvidenceLink('');
      setTangibleResult('');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/tasks?id=${task.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy task link: ', err);
      alert('No se pudo copiar el enlace.');
    }
  };

  const handleAddExternalLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (platformName.trim() && platformUrl.trim()) {
      if (!isValidUrl(platformUrl)) {
        alert('El formato de la URL de la plataforma externa no es válido. Por favor, introduce una URL completa (ej: https://example.com).');
        return;
      }
      onAddExternalLink(task.id, { platform: platformName, url: platformUrl });
      setPlatformName('');
      setPlatformUrl('');
    }
  };
  
  const handleSaveSignature = (signatureDataUrl: string) => {
    onAddClientSignature(task.id, signatureDataUrl);
    setIsSignatureModalOpen(false);
  };

  const handleSaveEdit = () => {
    onUpdateTask(task.id, editedTask);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditedTask(task);
    setIsEditing(false);
  };
  
  const handleCommentsBlur = () => {
    if (comments !== (task.comments || '')) {
      onUpdateTask(task.id, { comments });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    const isSaveDisabled = !editedTask.title?.trim() || !editedTask.executor || !editedTask.dueDate;
    return (
      <div className="bg-slate-800 border-l-4 border-indigo-500 rounded-r-lg p-4 shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Título</label>
          <input type="text" name="title" value={editedTask.title || ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Descripción</label>
          <textarea name="description" value={editedTask.description || ''} onChange={handleInputChange} rows={3} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Ejecutor</label>
              <select name="executor" value={editedTask.executor} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500">
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Fecha de Vencimiento</label>
              <input type="date" name="dueDate" value={editedTask.dueDate?.split('T')[0] || ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500" />
            </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md">Cancelar</button>
          <button 
            onClick={handleSaveEdit}
            disabled={isSaveDisabled}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    )
  }

  const currentStatus = STATUSES[task.status];
  const isCompletionState = task.status === 'COMPLETED' || task.status === 'EXCEPTIONAL';
  
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !isCompletionState;
  const formattedDate = format(dueDate, 'dd MMM yyyy');

  const createdAtDate = new Date(task.createdAt);
  const formattedCreatedDate = format(createdAtDate, 'dd MMM yyyy');

  const isRequestSharingDisabled = task.sharingApprovalStatus === 'PENDING' || task.sharingApprovalStatus === 'APPROVED';

  return (
    <>
      <div className={`bg-slate-800/50 border-l-4 ${currentStatus.color.replace('bg-', 'border-')} rounded-r-lg p-4 shadow-md transition-all`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h3 className="flex items-center font-bold text-lg text-slate-100">
              <span className="text-2xl mr-3 select-none">{currentStatus.emoji}</span>
              <span>{task.title}</span>
            </h3>
            <p className="text-sm text-slate-400 mt-1 whitespace-pre-wrap">{task.description}</p>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400 mt-3">
              <div className="flex items-center space-x-1.5">
                <ClockIcon className="h-4 w-4" />
                <span>Creado: {formattedCreatedDate}</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${isOverdue ? 'text-red-400 font-semibold' : ''}`}>
                {isOverdue && <WarningIcon className="h-4 w-4" />}
                <CalendarIcon className="h-4 w-4" />
                <span>Vence: {formattedDate}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <AreaIcon className="h-4 w-4" />
                <span>{task.area}</span>
              </div>
               <div className="flex items-center space-x-1.5">
                <UserCircleIcon className="h-4 w-4" />
                <span>{task.executor}</span>
              </div>
              <button
                onClick={handleShare}
                className={`flex items-center space-x-1.5 transition-colors duration-300 ${isCopied ? 'text-green-400' : 'hover:text-indigo-400'}`}
                title="Copiar enlace de la tarea"
              >
                {isCopied ? <><CheckIcon className="h-4 w-4" /><span>¡Copiado!</span></> : <><ShareIcon className="h-4 w-4" /><span>Compartir</span></>}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 hover:text-indigo-400"
                title="Editar tarea"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Editar</span>
              </button>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <StatusSelector currentStatus={currentStatus} onSelect={handleStatusSelect} />
          </div>
        </div>
        {(task.status === 'IN_PROGRESS' || task.status === 'BLOCKED') && (
          <div className="mt-4 border-t border-slate-700 pt-4 space-y-3">
            <div>
              <label htmlFor={`evidence-${task.id}`} className="block text-sm font-medium text-slate-300 mb-1">Link de Evidencia (Obligatorio para ✅ o 💖)</label>
              <input ref={evidenceInputRef} type="text" id={`evidence-${task.id}`} value={evidenceLink} onChange={(e) => setEvidenceLink(e.target.value)} placeholder="https://docs.google.com/..." className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor={`result-${task.id}`} className="block text-sm font-medium text-slate-300 mb-1">Resultado Tangible</label>
              <input type="text" id={`result-${task.id}`} value={tangibleResult} onChange={(e) => setTangibleResult(e.target.value)} placeholder="Ej: 3 diseños creados, $20,000 MXN cobrados" className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor={`comments-${task.id}`} className="block text-sm font-medium text-slate-300 mb-1">Comentarios</label>
              <textarea id={`comments-${task.id}`} value={comments} onChange={(e) => setComments(e.target.value)} onBlur={handleCommentsBlur} rows={2} placeholder="Añade una nota sobre el progreso o algún bloqueo..." className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        )}
        {isCompletionState && (
          <div className="mt-4 border-t border-slate-700 pt-4 text-sm space-y-2">
              <p><span className="font-semibold text-slate-400">Evidencia: </span> <a href={task.evidenceLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all">{task.evidenceLink}</a></p>
              <p><span className="font-semibold text-slate-400">Resultado: </span> <span className="text-slate-200">{task.tangibleResult}</span></p>
              {task.comments && <p><span className="font-semibold text-slate-400">Comentarios Finales: </span> <span className="text-slate-200 whitespace-pre-wrap">{task.comments}</span></p>}
          </div>
        )}

        {task.area === Area.Legal && (
          <div className="mt-4 border-t border-slate-700 pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-indigo-300">Acciones Legales</h4>
            {/* Client Sharing */}
            <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <UsersIcon className="h-5 w-5 text-slate-400"/>
                        <div>
                            <p className="text-sm font-medium text-slate-200">Compartir con Cliente</p>
                            <ApprovalStatusBadge status={task.sharingApprovalStatus} />
                        </div>
                    </div>
                    <button onClick={() => onRequestSharing(task.id)} disabled={isRequestSharingDisabled} className="text-sm font-medium px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed">
                        Solicitar
                    </button>
                </div>

                {task.sharingApprovalStatus === 'APPROVED' && (
                    <div className="mt-3 pt-3 border-t border-slate-600/70">
                        {task.clientSignature ? (
                            <div>
                                <h5 className="text-xs font-semibold text-slate-400 mb-2">Firma del Cliente</h5>
                                <div className="bg-white p-2 rounded-md border border-slate-300 inline-block">
                                    <img src={task.clientSignature} alt="Firma del cliente" className="h-16 object-contain" />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Firmado el: {format(new Date(task.signatureTimestamp!), 'dd MMM yyyy, HH:mm')}
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-300">Pendiente de firma del cliente.</p>
                                <button onClick={() => setIsSignatureModalOpen(true)} className="flex items-center space-x-2 text-sm font-medium px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-500">
                                    <PencilSwooshIcon className="h-4 w-4" />
                                    <span>Firmar Aprobación</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* External Links */}
            <div>
              <h5 className="text-xs font-semibold text-slate-400 mb-2">Plataformas Externas</h5>
              <div className="space-y-2">
                {task.externalPlatformLinks?.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-slate-500"/>
                    <span className="font-medium text-slate-300">{link.platform}:</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline truncate flex-1">{link.url}</a>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddExternalLink} className="flex items-center gap-2 mt-3">
                <input type="text" value={platformName} onChange={e => setPlatformName(e.target.value)} placeholder="Nombre Plataforma" className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500" />
                <input type="url" value={platformUrl} onChange={e => setPlatformUrl(e.target.value)} placeholder="URL" className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500" />
                <button type="submit" className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-600 hover:bg-slate-500">Añadir</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSaveSignature}
        taskTitle={task.title}
      />
    </>
  );
};

export default TaskItem;