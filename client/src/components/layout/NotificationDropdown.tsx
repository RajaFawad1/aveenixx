import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

export default function NotificationDropdown() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications']
  });

  const { data: countData } = useQuery({
    queryKey: ['/api/notifications/count']
  });

  const unreadCount = countData?.count || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      order: '📦', message: '💬', payment: '💰', security: '🔐', promotion: '🎉', system: '⚙️'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-2xl hover:text-yellow-500 transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-2 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 h-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {notifications.map((notification: any) => (
              <div 
                key={notification.id}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                onClick={() => {
                  if (notification.actionUrl) {
                    setOpen(false);
                    navigate(notification.actionUrl);
                  }
                }}
              >
                <div className="flex gap-3">
                  <span className="text-lg">{getIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{notification.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
              className="w-full py-2 text-sm font-medium rounded border"
              style={{ 
                color: 'var(--primary-color)',
                borderColor: 'var(--primary-color)'
              }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}