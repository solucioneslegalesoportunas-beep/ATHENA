
import React, { useState } from 'react';
import { Task, Stats, Testimonial } from '../../types';
import KpiCard from './KpiCard';
import ResultsChart from './ResultsChart';
import TestimonialsSection from './TestimonialsSection';
import NewTestimonialModal from '../modals/NewTestimonialModal';
import { LightbulbIcon, CheckCircleIcon, PlusCircleIcon } from '../shared/Icons';

interface DirectorDashboardProps {
  tasks: Task[];
  stats: Stats;
  onAnalyzeRisks: () => void;
  onApproveSharing: (taskId: string) => void;
  testimonials: Testimonial[];
  onAddTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
}

const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ 
  tasks, 
  stats, 
  onAnalyzeRisks, 
  onApproveSharing,
  testimonials,
  onAddTestimonial
}) => {
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const highRiskTasks = tasks.filter(task => task.status === 'BLOCKED' || (new Date(task.dueDate) < new Date() && task.status === 'IN_PROGRESS'));
  const approvalRequests = tasks.filter(task => task.sharingApprovalStatus === 'PENDING');

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Panel de Dirección</h2>
          <p className="text-slate-400">Métricas de alto nivel sobre la autonomía y el rendimiento del equipo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Tasa de Cierre Autónomo" value={`${stats.autonomousClosureRate}%`} description="Tareas cerradas sin bloqueos" />
          <KpiCard title="Índice de Bloqueo" value={stats.blockageIndex.toString()} description="Total de bloqueos registrados" />
          <KpiCard title="Tareas Activas" value={tasks.filter(t => t.status === 'IN_PROGRESS').length.toString()} description="Actualmente en ejecución" />
          <KpiCard title="Tareas Totales" value={tasks.length.toString()} description="Asignadas en el sistema" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Resumen de Resultados por Área</h3>
              <div className="h-80">
                <ResultsChart data={stats.resultsByArea} />
              </div>
            </div>
            <TestimonialsSection testimonials={testimonials} />
          </div>
          <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-xl shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                  <h3 className="text-xl font-semibold text-white">Foco de Atención</h3>
                  <p className="text-slate-400 text-sm">Tareas críticas y solicitudes.</p>
              </div>
              <button 
                  onClick={onAnalyzeRisks}
                  disabled={highRiskTasks.length === 0}
                  className="flex items-center space-x-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Analyze risks with AI"
                >
                <LightbulbIcon className="h-5 w-5" />
                <span>Analizar</span>
              </button>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              <div>
                <h4 className="font-semibold text-slate-300 text-sm mb-2">Tareas de Alto Riesgo</h4>
                {highRiskTasks.length > 0 ? (
                  highRiskTasks.map(task => (
                    <div key={task.id} className="bg-slate-700/50 p-3 rounded-lg mb-2">
                      <p className="font-semibold text-sm truncate">{task.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-slate-400">{task.executor}</p>
                        <p className={`text-xs font-bold ${new Date(task.dueDate) < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
                            Vence: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    <p>No hay tareas de alto riesgo.</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 text-sm mb-2">Solicitudes de Aprobación</h4>
                {approvalRequests.length > 0 ? (
                  approvalRequests.map(task => (
                    <div key={task.id} className="bg-slate-700/50 p-3 rounded-lg mb-2">
                      <p className="font-semibold text-sm truncate">{task.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-slate-400">{task.executor}</p>
                        <button onClick={() => onApproveSharing(task.id)} className="flex items-center space-x-1.5 text-xs text-green-400 bg-green-500/10 hover:bg-green-500/20 font-semibold px-2 py-1 rounded-md">
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Aprobar</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    <p>No hay solicitudes pendientes.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 border-t border-slate-700/50 pt-4">
                <button 
                  onClick={() => setIsTestimonialModalOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>Añadir Testimonio</span>
                </button>
            </div>
          </div>
        </div>
      </div>
      <NewTestimonialModal 
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        onAddTestimonial={onAddTestimonial}
      />
    </>
  );
};

export default DirectorDashboard;