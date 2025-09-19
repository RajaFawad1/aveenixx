import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, MessageCircle, X, Send, Heart, Users } from 'lucide-react';

// Quality assessment function to filter valuable Q&A pairs
const isQualityQA = (question: string, answer: string): boolean => {
  // Filter out low-quality questions
  const lowQualityPatterns = [
    /^(hi|hello|hey|thanks|thank you|ok|okay)$/i,
    /^.{1,5}$/,  // Very short questions
    /^(test|testing|1|2|3|a|yes|no)$/i,
    /^\?+$/,  // Just question marks
  ];
  
  // Filter out low-quality answers
  const lowQualityAnswerPatterns = [
    /I'm here to help/i,
    /Could you provide more details/i,
    /I understand you're asking/i,
    /^.{1,20}$/,  // Very short answers
  ];
  
  // Check for product-specific content
  const productSpecificKeywords = [
    'product', 'price', 'shipping', 'return', 'warranty', 'specification', 
    'feature', 'material', 'size', 'color', 'delivery', 'installation',
    'compatibility', 'quality', 'durability', 'brand', 'model', 'version'
  ];
  
  // Question quality checks
  if (lowQualityPatterns.some(pattern => pattern.test(question.trim()))) {
    return false;
  }
  
  // Answer quality checks
  if (lowQualityAnswerPatterns.some(pattern => pattern.test(answer.trim()))) {
    return false;
  }
  
  // Must contain product-specific content
  const hasProductContent = productSpecificKeywords.some(keyword => 
    question.toLowerCase().includes(keyword) || answer.toLowerCase().includes(keyword)
  );
  
  // Must be substantial enough
  const isSubstantial = question.length >= 10 && answer.length >= 50;
  
  return hasProductContent && isSubstantial;
};

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'jarvis';
  time: string;
}

interface ProductContext {
  productName?: string;
  productId?: string;
  productPrice?: string;
}

export default function JarvisFloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [productContext, setProductContext] = useState<ProductContext | null>(null);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [lastQAPair, setLastQAPair] = useState<{question: string, answer: string} | null>(null);

  const initializeChat = () => {
    if (!isInitialized) {
      setChatMessages([{
        id: 'welcome',
        text: "Hello! I'm Jarvis, your private AI assistant. I'm available on every page to help with business strategy, technical questions, or any sensitive matters you prefer to keep confidential. How can I assist you today?",
        sender: 'jarvis',
        time: new Date().toLocaleTimeString()
      }]);
      setIsInitialized(true);
    }
  };

  const handleToggleChat = () => {
    if (!isOpen) {
      initializeChat();
    }
    setIsOpen(!isOpen);
  };

  // Listen for global events to open chat
  useEffect(() => {
    console.log('JarvisFloatingChat: Setting up event listener for openJarvisChat');
    
    const handleOpenJarvis = (event: CustomEvent) => {
      console.log('Jarvis received openJarvisChat event:', event.detail);
      
      // Always open chat
      setIsOpen(true);
      
      // Handle product context if provided
      if (event.detail && event.detail.productContext) {
        const { productContext, productName, productId } = event.detail;
        
        // Store product context for sharing Q&A later
        setProductContext({ productName, productId });
        
        // Initialize with product-specific welcome message
        setChatMessages([{
          id: 'product-welcome',
          text: `Hi! I'm Jarvis, your AI assistant. I see you have questions about the ${productName}. I have access to all the product details, pricing, shipping info, and customer reviews. What would you like to know about this product?`,
          sender: 'jarvis',
          time: new Date().toLocaleTimeString()
        }]);
        
        setIsInitialized(true);
      } else {
        // Regular chat initialization
        if (!isInitialized) {
          initializeChat();
        }
      }
    };

    window.addEventListener('openJarvisChat', handleOpenJarvis as EventListener);
    return () => window.removeEventListener('openJarvisChat', handleOpenJarvis as EventListener);
  }, [isOpen, isInitialized]);

  const handleSendMessage = async () => {
    if (!currentQuestion.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentQuestion,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const questionText = currentQuestion;
    setCurrentQuestion('');

    try {
      // Call Jarvis API for intelligent response
      const response = await fetch('/api/jarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const jarvisResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: result.answer || "I'm here to help! Could you provide more details about what you'd like to know?",
          sender: 'jarvis',
          time: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, jarvisResponse]);
        
        // Store Q&A pair for potential sharing (only for product-related questions that meet quality criteria)
        if (productContext && productContext.productId && isQualityQA(questionText, result.answer)) {
          setLastQAPair({ question: questionText, answer: result.answer });
          // Show share prompt after a brief delay
          setTimeout(() => setShowSharePrompt(true), 2000);
        }
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      // Fallback response
      const jarvisResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `I understand you're asking about: "${questionText}". I'm here to help with any questions about products, business strategy, technical support, or platform navigation. Could you provide more specific details so I can give you the most accurate assistance?`,
        sender: 'jarvis',
        time: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, jarvisResponse]);
    }
  };

  const handleShareQA = async (shouldShare: boolean) => {
    if (shouldShare && lastQAPair && productContext) {
      try {
        // Save Q&A to knowledge base
        const response = await fetch('/api/products/qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: productContext.productId,
            question: lastQAPair.question,
            answer: lastQAPair.answer,
            isPublic: true,
            timestamp: new Date().toISOString()
          })
        });
        
        const result = await response.json();
        
        // Add a system message to chat
        setChatMessages(prev => [...prev, {
          id: 'shared-notification',
          text: result.success 
            ? "✅ Thank you! Your valuable Q&A has been added to our knowledge base." 
            : "ℹ️ Thanks for offering to share! This conversation will remain private.",
          sender: 'jarvis',
          time: new Date().toLocaleTimeString()
        }]);
      } catch (error) {
        console.error('Error sharing Q&A:', error);
        setChatMessages(prev => [...prev, {
          id: 'error-notification',
          text: "ℹ️ Your conversation will remain private.",
          sender: 'jarvis',
          time: new Date().toLocaleTimeString()
        }]);
      }
    } else if (!shouldShare) {
      // User chose to keep it private
      setChatMessages(prev => [...prev, {
        id: 'private-notification',
        text: "✅ Your conversation will remain private and secure.",
        sender: 'jarvis',
        time: new Date().toLocaleTimeString()
      }]);
    }
    
    // Reset sharing states
    setShowSharePrompt(false);
    setLastQAPair(null);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
        <Button
          onClick={handleToggleChat}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-36 md:bottom-22 right-4 z-50 w-80 sm:w-96">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Jarvis AI Assistant</h3>
                  <p className="text-xs text-purple-100">Private & Encrypted</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 w-6 h-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t dark:border-gray-700">
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Ask Jarvis anything..."
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                  disabled={!currentQuestion.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Private conversation - encrypted in your profile
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Share Q&A Prompt */}
      {showSharePrompt && lastQAPair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Help Other Customers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share this Q&A to build knowledge base</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Q: {lastQAPair.question}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">A: {lastQAPair.answer.substring(0, 100)}...</p>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              This Q&A looks valuable! Would you like to share it with future customers? Only high-quality, product-specific conversations get saved to help others.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => handleShareQA(false)}
                variant="outline"
                className="flex-1"
              >
                Keep Private
              </Button>
              <Button
                onClick={() => handleShareQA(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
              >
                <Users className="w-4 h-4 mr-2" />
                Share to Help Others
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}