// Contact Page Data
import { Mail, Phone, MessageCircle, Headphones, MapPin, Clock, Globe } from 'lucide-react';

export const contactMethods = [
  {
    title: 'Email Support',
    description: 'Get detailed help via email',
    contact: 'Send Message',
    response: 'Response within 24 hours',
    icon: Mail
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with our team',
    contact: '+64 21 494 881',
    response: 'Mon-Fri: 8AM-6PM NZST',
    icon: Phone
  },
  {
    title: 'Live Chat',
    description: 'Instant messaging support',
    contact: 'Chat with us now',
    response: 'Average response: 2 minutes',
    icon: MessageCircle
  },
  {
    title: 'Help Center',
    description: 'Browse our knowledge base',
    contact: 'Visit Help Center',
    response: 'Self-service 24/7',
    icon: Headphones
  }
];

export const offices = [
  {
    city: 'New Zealand',
    address: '401 Ellerslie Panmure Highway, Mount Wellington, Auckland 1060',
    phone: '+64 21 494 881',
    email: 'nz@aveenix.com',
    manager: 'John Smith',
    timezone: 'NZST',
    hours: 'Mon-Fri: 8AM-6PM'
  }
];

export const businessHours = {
  weekdays: '8:00 AM - 6:00 PM',
  saturday: '10:00 AM - 4:00 PM',
  sunday: 'Closed',
  onlineSupport: '24/7 Online Support Available'
};