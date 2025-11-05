
import React from 'react';
import { TeamMember, Notification } from '../../types';
import { AthenaLogo } from '../shared/Icons';
import NotificationBell from '../notifications/NotificationBell';

interface HeaderProps {
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
  teamMembers: TeamMember[];
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  setCurrentUser,
  teamMembers,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead 
}) => {

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = teamMembers.find(m => m.id === event.target.value);
    if (selectedUser) {
      setCurrentUser(selectedUser);
    }
  };

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-20 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <AthenaLogo className="h-8 w-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">ATHENA</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell
              notifications={notifications}
              onMarkAsRead={onMarkNotificationAsRead}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
            />
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-400 hidden sm:inline">Usuario:</span>
                <select 
                    value={currentUser.id} 
                    onChange={handleUserChange}
                    className="bg-slate-700 border border-slate-600 rounded-md py-1 pl-2 pr-8 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em' }}
                >
                    {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;