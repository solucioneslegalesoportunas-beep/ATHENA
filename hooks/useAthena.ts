import { useState, useCallback, useMemo, useEffect } from 'react';
import { addDays, isPast, isWithinInterval } from 'date-fns';
import { Task, Stats, Area, Status, ExternalPlatformLink, Notification, NotificationType, Testimonial } from '../types';
import { INITIAL_TASKS, STATUSES, INITIAL_TESTIMONIALS } from '../constants';
import { getTrainingSuggestions as fetchTrainingSuggestions, generateTaskDetails as fetchTaskDetails, analyzeRisks as fetchRiskAnalysis } from '../services/geminiService';

export const useAthena = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [trainingSuggestions, setTrainingSuggestions] = useState<string>('');
  const [isTrainingLoading, setIsTrainingLoading] = useState<boolean>(false);
  const [riskAnalysis, setRiskAnalysis] = useState<string>('');
  const [isRiskAnalysisLoading, setIsRiskAnalysisLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  useEffect(() => {
    setNotifications(prevNotifications => {
        const newNotifications: Notification[] = [];
        const now = new Date();
        const twoDaysFromNow = addDays(now, 2);

        tasks.forEach(task => {
            const dueDate = new Date(task.dueDate);
            const localDueDate = new Date(dueDate.valueOf() + dueDate.getTimezoneOffset() * 60 * 1000);
            const isCompleted = task.status === 'COMPLETED' || task.status === 'EXCEPTIONAL';

            if (isCompleted) return;

            const isOverdue = isPast(localDueDate);
            if (isOverdue) {
                const alreadyNotified = prevNotifications.some(n => n.taskId === task.id && n.type === NotificationType.Overdue);
                if (!alreadyNotified) {
                    newNotifications.push({
                        id: `notif-${task.id}-overdue`,
                        taskId: task.id,
                        message: `La tarea "${task.title}" está vencida.`,
                        type: NotificationType.Overdue,
                        isRead: false,
                        createdAt: new Date().toISOString(),
                    });
                }
            } else {
                const isDueSoon = isWithinInterval(localDueDate, { start: now, end: twoDaysFromNow });
                if (isDueSoon) {
                    const alreadyNotified = prevNotifications.some(n => n.taskId === task.id && n.type === NotificationType.DueSoon);
                    if (!alreadyNotified) {
                        newNotifications.push({
                            id: `notif-${task.id}-duesoon`,
                            taskId: task.id,
                            message: `La tarea "${task.title}" vence pronto.`,
                            type: NotificationType.DueSoon,
                            isRead: false,
                            createdAt: new Date().toISOString(),
                        });
                    }
                }
            }
        });

        if (newNotifications.length > 0) {
            return [...prevNotifications, ...newNotifications]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
        return prevNotifications;
    });
  }, [tasks]);


  const markNotificationAsRead = useCallback((notificationId: string) => {
      setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const addTestimonial = useCallback((testimonial: Omit<Testimonial, 'id'>) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: `testimonial-${Date.now()}`,
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
  }, []);


  const updateTaskStatus = useCallback((taskId: string, statusId: Status['id'], evidence?: string, tangibleResult?: string) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          // Validation for evidence
          if ((statusId === 'COMPLETED' || statusId === 'EXCEPTIONAL') && !evidence) {
            alert('Se requiere un link de evidencia para marcar la tarea como completada o excepcional.');
            return task; // Don't update
          }
          const updatedTask = { ...task, status: statusId };
          if (evidence !== undefined) updatedTask.evidenceLink = evidence;
          if (tangibleResult !== undefined) updatedTask.tangibleResult = tangibleResult;
          if (!updatedTask.statusHistory.includes(statusId)) {
            updatedTask.statusHistory = [...updatedTask.statusHistory, statusId];
          }
          return updatedTask;
        }
        return task;
      });

      // Simulate AI Auditor: check for overdue tasks without evidence
      return newTasks.map(task => {
        const isOverdue = new Date(task.dueDate) < new Date();
        if (isOverdue && !task.evidenceLink && task.status !== 'COMPLETED' && task.status !== 'EXCEPTIONAL' && task.status !== 'BLOCKED') {
          return { ...task, status: 'BLOCKED' as Status['id'], statusHistory: [...task.statusHistory, 'BLOCKED' as Status['id']] };
        }
        return task;
      });
    });
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'status' | 'statusHistory' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: (tasks.length + 1).toString(),
      status: 'IN_PROGRESS',
      statusHistory: ['IN_PROGRESS'],
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  }, [tasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  const requestClientSharing = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, sharingApprovalStatus: 'PENDING' } : t));
  }, []);

  const approveClientSharing = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, sharingApprovalStatus: 'APPROVED', isClientShared: true } : t));
  }, []);

  const addExternalLink = useCallback((taskId: string, link: ExternalPlatformLink) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedLinks = [...(t.externalPlatformLinks || []), link];
        return { ...t, externalPlatformLinks: updatedLinks };
      }
      return t;
    }));
  }, []);

  const addClientSignature = useCallback((taskId: string, signatureDataUrl: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          clientSignature: signatureDataUrl,
          signatureTimestamp: new Date().toISOString(),
        };
      }
      return t;
    }));
  }, []);
  
  const getTrainingSuggestions = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setIsTrainingLoading(true);
    setTrainingSuggestions('');
    try {
      const suggestions = await fetchTrainingSuggestions(task);
      setTrainingSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching training suggestions:", error);
      setTrainingSuggestions("No se pudieron generar sugerencias. Por favor, inténtelo de nuevo.");
    } finally {
      setIsTrainingLoading(false);
    }
  }, [tasks]);

  const clearTrainingSuggestions = useCallback(() => {
    setTrainingSuggestions('');
  }, []);

  const generateTaskDetails = useCallback(async (prompt: string) => {
    return await fetchTaskDetails(prompt);
  }, []);

  const analyzeRisks = useCallback(async (riskTasks: Task[]) => {
    if (riskTasks.length === 0) {
      setRiskAnalysis("No hay tareas de alto riesgo para analizar en este momento.");
      return;
    }
    setIsRiskAnalysisLoading(true);
    setRiskAnalysis('');
    try {
      const analysis = await fetchRiskAnalysis(riskTasks);
      setRiskAnalysis(analysis);
    } catch (error) {
      console.error("Error fetching risk analysis:", error);
      setRiskAnalysis("No se pudo generar el análisis de riesgos. Por favor, inténtelo de nuevo.");
    } finally {
      setIsRiskAnalysisLoading(false);
    }
  }, []);

  const clearRiskAnalysis = useCallback(() => {
    setRiskAnalysis('');
  }, []);


  const stats = useMemo<Stats>(() => {
    const totalClosedTasks = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'EXCEPTIONAL').length;
    const autonomousTasks = tasks.filter(t => (t.status === 'COMPLETED' || t.status === 'EXCEPTIONAL') && !t.statusHistory.includes('BLOCKED')).length;
    
    const autonomousClosureRate = totalClosedTasks > 0 ? Math.round((autonomousTasks / totalClosedTasks) * 100) : 0;
    
    const blockageIndex = tasks.reduce((acc, task) => {
        return acc + (task.statusHistory.filter(s => s === 'BLOCKED').length);
    }, 0);
    
    const resultsByArea = Object.values(Area).map(area => {
        const areaTasks = tasks.filter(t => t.area === area && t.tangibleResult);
        // Simple aggregation: count of tasks with results
        const total = areaTasks.length; 
        return { area, total };
    });

    return { autonomousClosureRate, blockageIndex, resultsByArea };
  }, [tasks]);

  return { 
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
    addClientSignature,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    testimonials,
    addTestimonial,
  };
};