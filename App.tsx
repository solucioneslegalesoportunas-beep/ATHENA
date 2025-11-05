import React, { useState } from 'react';
import { useAthena } from './hooks/useAthena';
import { Role, Area, TeamMember, Task } from './types';
import { TEAM_MEMBERS } from './constants';
import Header from './components/layout/Header';
import DirectorDashboard from './components/dashboard/DirectorDashboard';
import TaskMatrix from './components/tasks/TaskMatrix';
import NewTaskModal from './components/tasks/NewTaskModal';
import TrainingModal from './components/modals/TrainingModal';
import RiskAnalysisModal from './components/modals/RiskAnalysisModal';
import { PlusCircleIcon } from './components/shared/Icons';

export default function App() {
  const { 
    tasks, 
    stats, 
    addTask, 
    updateTaskStatus, 
    updateTask,
    getTrainingSuggestions,
    trainingSuggestions,
    isTrainingLoading,
    clearTrainingSuggestions,
    generateTaskDetails,
    analyzeRisks,
    riskAnalysis,
    isRiskAnalysisLoading,
    clearRiskAnalysis,
    requestClientSharing,
    approveClientSharing,
    addExternalLink,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    testimonials,
    addTestimonial,
    addClientSignature,
  } = useAthena();
  
  const [currentUser, setCurrentUser] = useState<TeamMember>(TEAM_MEMBERS.find(m => m.role === Role.Director)!);
  const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [isRiskModalOpen, setRiskModalOpen] = useState(false);
  const [trainingTask, setTrainingTask] = useState<string | null>(null);
  const [activeAreaFilter, setActiveAreaFilter] = useState<Area | 'All'>('All');

  const handleStatusChange = (taskId: string, status: any, evidence?: string, tangibleResult?: string) => {
    if (status.id === 'TRAINING') {
      setTrainingTask(taskId);
      getTrainingSuggestions(taskId);
    }
    updateTaskStatus(taskId, status.id, evidence, tangibleResult);
  };
  
  const closeTrainingModal = () => {
    setTrainingTask(null);
    clearTrainingSuggestions();
  };

  const handleAnalyzeRisks = () => {
    const highRiskTasks = tasks.filter(task => task.status === 'BLOCKED' || (new Date(task.dueDate) < new Date() && task.status === 'IN_PROGRESS'));
    analyzeRisks(highRiskTasks);
    setRiskModalOpen(true);
  };

  const closeRiskModal = () => {
    setRiskModalOpen(false);
    clearRiskAnalysis();
  };
  
  const selectedTrainingTask = tasks.find(t => t.id === trainingTask);

  const executorTasks = tasks.filter(t => t.executor === currentUser.name);
  const filteredExecutorTasks = activeAreaFilter === 'All'
    ? executorTasks
    : executorTasks.filter(task => task.area === activeAreaFilter);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser}
        teamMembers={TEAM_MEMBERS}
        notifications={notifications}
        onMarkNotificationAsRead={markNotificationAsRead}
        onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentUser.role === Role.Director ? (
          <DirectorDashboard 
            tasks={tasks} 
            stats={stats}
            onAnalyzeRisks={handleAnalyzeRisks}
            onApproveSharing={approveClientSharing}
            testimonials={testimonials}
            onAddTestimonial={addTestimonial}
          />
        ) : (
          <TaskMatrix 
            tasks={filteredExecutorTasks} 
            onStatusChange={handleStatusChange}
            onUpdateTask={updateTask}
            teamMembers={TEAM_MEMBERS.filter(m => m.role === Role.Executor)}
            activeFilter={activeAreaFilter}
            onFilterChange={setActiveAreaFilter}
            onRequestSharing={requestClientSharing}
            onAddExternalLink={addExternalLink}
            onAddClientSignature={addClientSignature}
          />
        )}
      </main>

      {currentUser.role === Role.Director && (
         <button
          onClick={() => setNewTaskModalOpen(true)}
          className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-3 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center"
          aria-label="Add New Task"
        >
          <PlusCircleIcon className="h-8 w-8" />
        </button>
      )}

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        onAddTask={addTask}
        onGenerateDetails={generateTaskDetails}
        teamMembers={TEAM_MEMBERS}
        directorName={currentUser.role === Role.Director ? currentUser.name : TEAM_MEMBERS.find(m => m.role === Role.Director)!.name}
      />
      
      {selectedTrainingTask && (
        <TrainingModal 
          isOpen={!!trainingTask}
          onClose={closeTrainingModal}
          task={selectedTrainingTask}
          suggestions={trainingSuggestions}
          isLoading={isTrainingLoading}
        />
      )}

      <RiskAnalysisModal
        isOpen={isRiskModalOpen}
        onClose={closeRiskModal}
        analysis={riskAnalysis}
        isLoading={isRiskAnalysisLoading}
      />
    </div>
  );
}