
import React from 'react';
import { Task, Status, Area, Testimonial, TeamMember, Role } from './types';

export const STATUSES: Record<Status['id'], Status> = {
  EXCEPTIONAL: { id: 'EXCEPTIONAL', label: 'Logro Excepcional', emoji: '💖', color: 'bg-pink-500', textColor: 'text-white' },
  COMPLETED: { id: 'COMPLETED', label: 'Completado', emoji: '✅', color: 'bg-green-500', textColor: 'text-white' },
  IN_PROGRESS: { id: 'IN_PROGRESS', label: 'En Curso', emoji: '⏳', color: 'bg-yellow-500', textColor: 'text-slate-900' },
  BLOCKED: { id: 'BLOCKED', label: 'Bloqueo/Riesgo', emoji: '🛑', color: 'bg-red-600', textColor: 'text-white' },
  TRAINING: { id: 'TRAINING', label: 'Capacitación', emoji: '🧠', color: 'bg-blue-500', textColor: 'text-white' },
};

export const AREAS = Object.values(Area);

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'user-1', name: 'Director General', role: Role.Director },
  { id: 'user-2', name: 'Laura Morales', role: Role.Executor },
  { id: 'user-3', name: 'David Costa', role: Role.Executor },
];


export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Diseñar 3 carruseles para Instagram',
    description: 'Crear contenido visual para la campaña de primavera. Usar la paleta de colores nueva.',
    area: Area.Content,
    assigner: 'Director General',
    executor: 'Laura Morales',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'IN_PROGRESS',
    statusHistory: ['IN_PROGRESS'],
    tangibleResult: '',
  },
  {
    id: '2',
    title: 'Revisar contrato de proveedor XYZ',
    description: 'Asegurarse de que las cláusulas de confidencialidad y pago estén correctas.',
    area: Area.Legal,
    assigner: 'Director General',
    executor: 'David Costa',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'IN_PROGRESS',
    statusHistory: ['IN_PROGRESS'],
    sharingApprovalStatus: 'PENDING',
    externalPlatformLinks: [
      { platform: 'Bolegal Ejemplo', url: 'https://example.com/bolegal-123' }
    ]
  },
  {
    id: '3',
    title: 'Cobrar factura #12345',
    description: 'Factura vencida hace 5 días. Contactar al cliente para coordinar el pago.',
    area: Area.Collections,
    assigner: 'Director General',
    executor: 'Laura Morales',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'IN_PROGRESS',
    statusHistory: ['IN_PROGRESS'],
    tangibleResult: '',
  },
   {
    id: '4',
    title: 'Cerrar venta con cliente potencial ACME',
    description: 'Han mostrado interés en el plan premium. Preparar propuesta final y llamada de cierre.',
    area: Area.Sales,
    assigner: 'Director General',
    executor: 'David Costa',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'COMPLETED',
    statusHistory: ['IN_PROGRESS', 'COMPLETED'],
    evidenceLink: 'https://example.com/deal-closed',
    tangibleResult: '1 Contrato Premium',
  },
  {
    id: '5',
    title: 'Investigar nueva ley de protección de datos',
    description: 'La nueva regulación entra en vigor el próximo mes. Necesitamos un resumen de los impactos.',
    area: Area.Legal,
    assigner: 'Director General',
    executor: 'David Costa',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'BLOCKED',
    statusHistory: ['IN_PROGRESS', 'BLOCKED'],
    evidenceLink: '',
    tangibleResult: 'Acceso a base de datos legal denegado',
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Ana Fuentes',
    company: 'Innovate Corp',
    quote: 'ATHENA ha transformado nuestra forma de trabajar. La transparencia y la autonomía han aumentado nuestra eficiencia en un 40%.',
  },
  {
    id: 'test-2',
    clientName: 'Carlos Mendoza',
    company: 'Soluciones Tech',
    quote: 'El seguimiento de tareas y la auditoría automática nos dan una visibilidad que nunca antes habíamos tenido. Es una herramienta indispensable para cualquier líder.',
  },
  {
    id: 'test-3',
    clientName: 'Sofía Reyes',
    quote: 'Finalmente puedo enfocarme en la estrategia en lugar de la microgestión. Mis equipos están más empoderados y son más responsables.',
  },
];