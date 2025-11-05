
import React from 'react';
import Modal from '../shared/Modal';
import Spinner from '../shared/Spinner';

const MarkdownRenderer = ({ content }: { content: string }) => {
    // This is a simplified renderer. For complex markdown, a library like 'marked' or 'react-markdown' would be better.
    const htmlContent = content
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2 text-indigo-300">$1</h2>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .split('\n')
        .map(line => {
            if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.')) {
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


interface RiskAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysis: string;
    isLoading: boolean;
}

const RiskAnalysisModal: React.FC<RiskAnalysisModalProps> = ({ isOpen, onClose, analysis, isLoading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Análisis de Riesgos Estratégicos (IA)">
            <div className="p-4">
                <p className="text-sm text-slate-400 mb-4">Análisis de ATHENA AI sobre tareas bloqueadas o vencidas.</p>
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-48">
                        <Spinner />
                        <p className="mt-4 text-slate-400">Analizando patrones y generando plan de acción...</p>
                    </div>
                )}

                {!isLoading && analysis && (
                    <div className="max-h-[60vh] overflow-y-auto bg-slate-800/50 p-4 rounded-lg">
                       <MarkdownRenderer content={analysis} />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default RiskAnalysisModal;
