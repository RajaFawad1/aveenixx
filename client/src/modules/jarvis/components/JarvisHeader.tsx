import { Bot, Bell, User, Search } from 'lucide-react';

export default function JarvisHeader() {
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search or ask Jarvis..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Bot className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Bell className="w-5 h-5" />
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