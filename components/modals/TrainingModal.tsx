
import React from 'react';
import Modal from '../shared/Modal';
import { Task } from '../../types';
import Spinner from '../shared/Spinner';

const MarkdownRenderer = ({ content }: { content: string }) => {
    // This is a simplified renderer. For complex markdown, a library like 'marked' or 'react-markdown' would be better.
    const htmlContent = content
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2 text-indigo-300">$1</h2>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/`([^`]+)`/gim, '<code class="bg-slate-700 text-pink-400 rounded px-1 py-0.5 text-sm">$1</code>')
        .split('\n')
        .map(line => {
            if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') || line.trim().startsWith('4.') || line.trim().startsWith('5.')) {
                return `<li class="ml-5 list-decimal">${line.replace(/^\d+\.\s*/, '')}</li>`;
            }
            if (line.trim().startsWith('-')) {
                return `<li class="ml-5 list-disc">${line.substring(1)}</li>`;
            }
            return line;
        })
        .join('<br>')
        .replace(/<br><li/g, '<li') // Clean up extra breaks before list items
        .replace(/<\/li><br>/g, '</li>');

    return <div className="prose-invert text-slate-300 space-y-2" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


interface TrainingModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    suggestions: string;
    isLoading: boolean;
}

const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose, task, suggestions, isLoading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sugerencias de Capacitación (IA)">
            <div className="p-4">
                <p className="text-sm text-slate-400 mb-4">Generado por ATHENA AI para la tarea: <span className="font-semibold text-slate-200">"{task.title}"</span></p>
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-48">
                        <Spinner />
                        <p className="mt-4 text-slate-400">Generando plan de acción...</p>
                    </div>
                )}

                {!isLoading && suggestions && (
                    <div className="max-h-96 overflow-y-auto bg-slate-800/50 p-4 rounded-lg">
                       <MarkdownRenderer content={suggestions} />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default TrainingModal;
