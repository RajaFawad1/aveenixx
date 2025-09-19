// FAQ Data for Contact Page
export const faqCategories = [
  { id: 'all', name: 'All Topics', count: 12 },
  { id: 'general', name: 'General', count: 5 },
  { id: 'billing', name: 'Billing', count: 3 },
  { id: 'technical', name: 'Technical', count: 4 }
];

export const faqData = [
  {
    id: '1',
    question: 'How do I create an account?',
    answer: 'To create an account, click the "Sign Up" button in the top right corner of the page. Fill in your email address, create a password, and verify your email address. You can also sign up using your Google or Facebook account.',
    category: 'general',
    helpful: 45,
    tags: ['account', 'signup', 'registration']
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our encrypted payment gateway.',
    category: 'billing',
    helpful: 38,
    tags: ['payment', 'billing', 'credit card']
  },
  {
    id: '3',
    question: 'How do I reset my password?',
    answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
    category: 'general',
    helpful: 52,
    tags: ['password', 'reset', 'login']
  },
  {
    id: '4',
    question: 'Why is my website loading slowly?',
    answer: 'Slow loading times can be caused by several factors: large image files, too many plugins, poor hosting, or network issues. Try clearing your browser cache, optimizing images, and checking your internet connection. Contact our technical support if the issue persists.',
    category: 'technical',
    helpful: 29,
    tags: ['performance', 'speed', 'loading']
  },
  {
    id: '5',
    question: 'How do I cancel my subscription?',
    answer: 'To cancel your subscription, go to your account settings and select "Billing". Click on "Cancel Subscription" and follow the prompts. Your subscription will remain active until the end of your current billing period.',
    category: 'billing',
    helpful: 33,
    tags: ['subscription', 'cancel', 'billing']
  },
  {
    id: '6',
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Go to your account settings, select "Plans & Billing", and choose your new plan. Changes take effect immediately, and you\'ll be charged or credited the prorated amount.',
    category: 'billing',
    helpful: 41,
    tags: ['upgrade', 'downgrade', 'plan']
  },
  {
    id: '7',
    question: 'How do I contact customer support?',
    answer: 'You can contact our support team through multiple channels: email (support@aveenix.com), live chat (available 24/7), phone (+1-555-123-4567), or by submitting a support ticket through your account dashboard.',
    category: 'general',
    helpful: 67,
    tags: ['support', 'contact', 'help']
  },
  {
    id: '8',
    question: 'Is my data secure?',
    answer: 'Yes, we take data security very seriously. All data is encrypted both in transit and at rest using industry-standard AES-256 encryption. We are SOC 2 Type II certified and compliant with GDPR, CCPA, and other privacy regulations.',
    category: 'technical',
    helpful: 44,
    tags: ['security', 'data', 'privacy']
  },
  {
    id: '9',
    question: 'How do I export my data?',
    answer: 'You can export your data at any time from your account settings. Go to "Data & Privacy" and select "Export Data". Choose the data types you want to export, and we\'ll send you a download link via email within 24 hours.',
    category: 'general',
    helpful: 36,
    tags: ['export', 'data', 'backup']
  },
  {
    id: '10',
    question: 'What browsers are supported?',
    answer: 'Our platform is compatible with all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest version of your browser for the best experience.',
    category: 'technical',
    helpful: 28,
    tags: ['browser', 'compatibility', 'support']
  },
  {
    id: '11',
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied with our service, contact our support team within 30 days of your purchase for a full refund.',
    category: 'general',
    helpful: 55,
    tags: ['refund', 'guarantee', 'money-back']
  },
  {
    id: '12',
    question: 'How do I set up SSL certificates?',
    answer: 'SSL certificates are automatically provided for all domains. For custom domains, go to your domain settings and click "Enable SSL". The certificate will be generated and installed automatically within a few minutes.',
    category: 'technical',
    helpful: 31,
    tags: ['ssl', 'security', 'domain']
  }
];

export function getFAQsByCategory(categoryId: string) {
  if (categoryId === 'all') {
    return faqData;
  }
  return faqData.filter(faq => faq.category === categoryId);
}

export function searchFAQs(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return faqData.filter(faq => 
    faq.question.toLowerCase().includes(lowercaseQuery) ||
    faq.answer.toLowerCase().includes(lowercaseQuery) ||
    faq.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}