export enum Role {
  Director = 'Director',
  Executor = 'Executor',
}

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
}

export enum Area {
  Content = 'Contenidos',
  Legal = 'Legal',
  Collections = 'Cobranza',
  Sales = 'Ventas',
}

export interface Status {
  id: 'EXCEPTIONAL' | 'COMPLETED' | 'IN_PROGRESS' | 'BLOCKED' | 'TRAINING';
  label: string;
  emoji: string;
  color: string;
  textColor: string;
}

export interface ExternalPlatformLink {
  platform: string;
  url: string;
}

export enum NotificationType {
  DueSoon = 'DUE_SOON',
  Overdue = 'OVERDUE',
}

export interface Notification {
  id: string;
  taskId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  quote: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  area: Area;
  assigner: string;
  executor: string;
  dueDate: string;
  status: Status['id'];
  statusHistory: Status['id'][];
  evidenceLink?: string;
  tangibleResult?: string;
  // Legal-specific fields
  sharingApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isClientShared?: boolean;
  externalPlatformLinks?: ExternalPlatformLink[];
  clientSignature?: string; // base64 data URL of the signature
  signatureTimestamp?: string; // ISO string of when it was signed
}

export interface Stats {
  autonomousClosureRate: number;
  blockageIndex: number;
  resultsByArea: { area: Area; total: number }[];
}