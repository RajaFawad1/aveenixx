import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, User, Send, Mic, MicOff } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
}

export default function JarvisChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'system', 
      text: "Hi! I'm Jarvis, your AI business assistant. I can help you with sales analysis, customer insights, order management, and business optimization. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response based on input
      const response = await generateJarvisResponse(input);
      const assistantMessage: Message = {
        role: 'assistant',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input functionality would be implemented here
    if (!isListening) {
      // Start voice recognition
      setTimeout(() => setIsListening(false), 3000); // Auto-stop after 3 seconds for demo
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-6 h-6 mr-2 text-blue-600" />
            Jarvis AI Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`flex-1 max-w-md ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 opacity-70 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-gray-700 border rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Container */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoiceInput}
              className={isListening ? 'bg-red-100 border-red-300 text-red-700' : ''}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Jarvis about your business metrics, sales trends, or any insights..."
              className="flex-1"
              disabled={isLoading}
            />
            
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Show me today\'s sales performance')}
              className="text-xs"
            >
              Sales Performance
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('What are my top performing products?')}
              className="text-xs"
            >
              Top Products
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Show me pending orders that need attention')}
              className="text-xs"
            >
              Pending Orders
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Analyze customer behavior trends')}
              className="text-xs"
            >
              Customer Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// AI Response Generator (Mock implementation - replace with actual AI service)
async function generateJarvisResponse(input: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lowercaseInput = input.toLowerCase();

  if (lowercaseInput.includes('sales') || lowercaseInput.includes('revenue')) {
    return `Based on your current sales data:

📈 **Today's Performance:**
- Revenue: $12,450.75 (+15.3% vs yesterday)
- Orders: 23 completed, 8 pending
- Average Order Value: $127.50

🎯 **Key Insights:**
- Electronics category is performing 28% above average
- Mobile accessories showing highest conversion rate (4.8%)
- Recommendation: Focus marketing efforts on wireless headphones - they have a 23% higher AOV

Would you like me to dive deeper into any specific metrics?`;
  }

  if (lowercaseInput.includes('product') || lowercaseInput.includes('inventory')) {
    return `Here's your product performance analysis:

🏆 **Top Performers:**
1. iPhone 15 Pro Cases - 124 units sold (18% of total revenue)
2. Wireless Headphones - 89 units sold (15% of total revenue)
3. Laptop Stands - 67 units sold (12% of total revenue)

⚠️ **Inventory Alerts:**
- iPhone cases: Low stock (23 units remaining)
- Wireless chargers: Restock recommended (15% increase in demand)

💡 **Optimization Suggestions:**
- Bundle laptop stands with laptop sales for 15% higher AOV
- Cross-sell screen protectors with phone cases (76% success rate)

Need specific product details or restock recommendations?`;
  }

  if (lowercaseInput.includes('customer') || lowercaseInput.includes('behavior')) {
    return `Customer Behavior Analysis:

👥 **Customer Insights:**
- Total Active Customers: 15,847
- New Customers (this week): 234 (+28% vs last week)
- Customer Retention Rate: 73.2%
- Top Customer: TechCorp Solutions ($45,230 lifetime value)

🛒 **Shopping Patterns:**
- Peak shopping hours: 2-4 PM and 7-9 PM
- Average session duration: 4.5 minutes
- Cart abandonment rate: 23% (industry avg: 31%)

🎯 **Segmentation:**
- Premium buyers (>$500/order): 12% of customers, 34% of revenue
- Repeat customers: 45% more likely to purchase accessories
- Mobile shoppers: 67% of traffic, 52% of conversions

Want recommendations for improving customer engagement?`;
  }

  if (lowercaseInput.includes('order') || lowercaseInput.includes('pending')) {
    return `Order Management Overview:

📦 **Current Status:**
- Pending Orders: 23 orders ($2,847 total value)
- Urgent Orders: 3 require immediate attention
- Processing Time: Average 1.8 hours (target: <2 hours)

🚨 **Orders Needing Attention:**
1. Order #1234 - Customer inquiry 2 days ago (follow-up needed)
2. Order #1235 - Payment verification required
3. Order #1236 - Shipping address incomplete

✅ **Recommendations:**
- Contact customer for Order #1234 (high-value customer)
- Set up automated payment reminders
- Implement address validation at checkout

Would you like me to help draft customer communication templates?`;
  }

  if (lowercaseInput.includes('help') || lowercaseInput.includes('can you')) {
    return `I'm here to help you optimize your business! Here's what I can assist with:

📊 **Analytics & Reporting:**
- Sales performance analysis
- Customer behavior insights
- Product performance metrics
- Revenue forecasting

🎯 **Business Optimization:**
- Inventory management recommendations
- Marketing strategy suggestions
- Customer retention strategies
- Pricing optimization

📋 **Operations:**
- Order management assistance
- Customer inquiry handling
- Process automation suggestions
- Performance monitoring

💡 **Strategic Insights:**
- Market trend analysis
- Competitive positioning
- Growth opportunities
- Risk assessment

Just ask me about any specific area, and I'll provide detailed insights and actionable recommendations!`;
  }

  // Default response for unrecognized queries
  return `I understand you're asking about "${input}". Let me help you with that.

Based on your business data, I can provide insights on:
- Sales and revenue trends
- Customer behavior patterns  
- Product performance metrics
- Order management optimization
- Inventory recommendations

Could you be more specific about what aspect you'd like me to analyze? For example:
- "Show me this week's sales trends"
- "Which products need restocking?"
- "How are my customers behaving?"
- "What orders need attention?"

I'm here to help make your business more efficient and profitable!`;
}