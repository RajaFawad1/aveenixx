import { useEffect, useRef, useState } from "react";
import { X, MessageCircle, Phone, Mail, FileText, Clock, User, Send, Paperclip, Search, Star, ThumbsUp, ChevronRight } from "lucide-react";
import { supportCategories, faqItems } from '@/lib/customerSupport';
import { contactMethods, businessHours } from '@/lib/contactData';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}



const quickActions = [
  {
    id: 'chat',
    name: 'Live Chat',
    description: 'Chat with our support team',
    icon: <MessageCircle className="w-5 h-5" />,
    status: 'Available now',
    color: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
  },
  {
    id: 'call',
    name: 'Phone Support',
    description: `Call us at ${contactMethods.find(m => m.title === 'Phone Support')?.contact}`,
    icon: <Phone className="w-5 h-5" />,
    status: contactMethods.find(m => m.title === 'Phone Support')?.response || '24/7 Available',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  },
  {
    id: 'email',
    name: 'Email Support',
    description: 'Send us an email',
    icon: <Mail className="w-5 h-5" />,
    status: contactMethods.find(m => m.title === 'Email Support')?.response || 'Response in 24h',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
  }
];



export default function CustomerSupportModal({ isOpen, onClose }: CustomerSupportModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'main' | 'chat' | 'categories'>('main');
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Handle click outside to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredFAQs = faqItems.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-[100]"
      onClick={handleBackdropClick}
    >
      {/* Modal content that fills exact space between header and footer */}
      <div className="fixed top-20 left-0 right-0 bottom-20 flex flex-col bg-white dark:bg-gray-800 border-t-2 border-b-2 border-white dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
        {/* Customer Support Header */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Support</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeView === 'main' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Get Help Now</h3>
                <div className="grid grid-cols-1 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => action.id === 'chat' && setActiveView('chat')}
                      className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                    >
                      <div className="flex-shrink-0">
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{action.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${action.color}`}>
                          {action.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Support Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Browse by Category</h3>
                <div className="grid grid-cols-1 gap-3">
                  {supportCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                      >
                        <div className="flex-shrink-0 theme-color">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{category.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{category.articles} articles</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  );
                  })}
                </div>
              </div>

              {/* Popular FAQs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Popular Questions</h3>
                <div className="space-y-3">
                  {filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{faq.answer}</p>
                      <div className="flex items-center justify-between">
                        <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({faq.helpful})</span>
                        </button>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          Read more
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'chat' && (
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Sarah - Support Agent</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">Online now</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveView('main')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[70%]">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Hi! Welcome to Aveenix support. How can I help you today?
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</p>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!chatMessage.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{businessHours.onlineSupport}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{contactMethods.find(m => m.title === 'Phone Support')?.contact}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Average response time: 2 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}