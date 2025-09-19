import { Bell, Settings, User } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  AVEENIX
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 leading-tight ml-12">
                  Hub
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}