import { FileText, Shield, Lock, Store, Map, ScrollText, RotateCcw, Truck, ShieldCheck, Gift, Cookie } from "lucide-react";

export interface PolicyItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description?: string;
}

export const legalPolicies: PolicyItem[] = [
  {
    id: 'legal-policy',
    name: 'Legal Policy',
    icon: FileText,
    href: '/legal',
    description: 'Legal information and terms for using our platform'
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    icon: Shield,
    href: '/privacy',
    description: 'Understand how we protect and use your personal information'
  },
  {
    id: 'returns-policy',
    name: 'Returns Policy',
    icon: RotateCcw,
    href: '/returns',
    description: 'Learn about our return and refund policies'
  },
  {
    id: 'security-policy',
    name: 'Security Policy',
    icon: Lock,
    href: '/security',
    description: 'Our commitment to keeping your data safe and secure'
  },
  {
    id: 'seller-policy',
    name: 'Seller Policy',
    icon: Store,
    href: '/seller',
    description: 'Guidelines and policies for sellers on our platform'
  },
  {
    id: 'shipping-policy',
    name: 'Shipping Policy',
    icon: Truck,
    href: '/shipping',
    description: 'Information about shipping options and delivery'
  }
];

export const getPolicy = (id: string): PolicyItem | undefined => {
  return legalPolicies.find(policy => policy.id === id);
};

export const getPolicyByName = (name: string): PolicyItem | undefined => {
  return legalPolicies.find(policy => policy.name.toLowerCase() === name.toLowerCase());
};