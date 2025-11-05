
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Notification, NotificationType } from '../../types';
import { WarningIcon } from '../shared/Icons';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationItem: React.FC<{ notification: Notification; onMarkAsRead: (id: string) => void; }> = ({ notification, onMarkAsRead }) => {
  const isOverdue = notification.type === NotificationType.Overdue;
  return (
    <div className={`p-3 border-l-4 ${isOverdue ? 'border-red-500' : 'border-amber-400'} ${notification.isRead ? 'opacity-60' : ''} hover:bg-slate-600/50 transition-colors`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-slate-200">{notification.message}</p>
          <span className="text-xs text-slate-400 mt-1 flex items-center">
            {isOverdue && <WarningIcon className="h-4 w-4 mr-1.5 text-red-400" />}
            {!isOverdue && <WarningIcon className="h-4 w-4 mr-1.5 text-amber-400" />}
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
          </span>
        </div>
        {!notification.isRead && (
          <button onClick={() => onMarkAsRead(notification.id)} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold ml-2 flex-shrink-0" title="Marcar como leída">
            Leída
          </button>
        )}
      </div>
    </div>
  );
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute top-16 right-0 w-80 md:w-96 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden z-30">
      <div className="p-3 flex justify-between items-center border-b border-slate-700">
        <h4 className="font-bold text-white">Notificaciones</h4>
        {unreadCount > 0 && (
          <button onClick={onMarkAllAsRead} className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">
            Marcar todas como leídas
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} />
          ))
        ) : (
          <div className="text-center p-8 text-slate-500">
            <p>No tienes notificaciones.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;