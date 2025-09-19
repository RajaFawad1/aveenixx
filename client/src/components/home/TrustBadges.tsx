import { Shield, Lock, Truck, Package, Gift, HelpCircle } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Secure Payment",
      subtitle: "SSL Protected",
      color: "theme-color"
    },
    {
      icon: Lock,
      title: "SSL Encrypted",
      subtitle: "Data Protected",
      color: "theme-color"
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      subtitle: "1-2 Days",
      color: "theme-color"
    },
    {
      icon: Package,
      title: "Free Delivery",
      subtitle: "from $50",
      color: "theme-color"
    },
    {
      icon: Gift,
      title: "Earn Rewards",
      subtitle: "Points & Cashback",
      color: "theme-color"
    },
    {
      icon: HelpCircle,
      title: "Help Centre",
      subtitle: "24/7 Support",
      color: "theme-color"
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((badge, index) => {
          const IconComponent = badge.icon;
          return (
            <div key={index} className="flex flex-col items-center text-center">
              <IconComponent className={`w-8 h-8 ${badge.color} mb-2`} />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {badge.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {badge.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}