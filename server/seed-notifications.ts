import { db } from "./db";
import { notifications } from "../shared/schema";

export async function seedNotifications() {
  console.log('🔔 Seeding notifications...');

  const sampleNotifications = [
    {
      type: "order" as const,
      priority: "high" as const,
      title: "Order Shipped",
      message: "Your order #ORD-12345 has been shipped and is on its way!",
      icon: "Package",
      actionUrl: "/account/orders",
      isGlobal: true,
    },
    {
      type: "promotion" as const,
      priority: "medium" as const,
      title: "Flash Sale Alert",
      message: "🔥 Up to 70% off electronics! Limited time offer ending soon.",
      icon: "Zap",
      actionUrl: "/deals",
      isGlobal: true,
    },
    {
      type: "system" as const,
      priority: "low" as const,
      title: "Welcome to AVEENIX",
      message: "Thanks for joining! Explore our amazing products and deals.",
      icon: "Heart",
      actionUrl: "/",
      isGlobal: true,
    },
    {
      type: "message" as const,
      priority: "medium" as const,
      title: "New Message",
      message: "You have a new message from customer support regarding your recent inquiry.",
      icon: "MessageCircle",
      actionUrl: "/messages",
      isGlobal: true,
    },
    {
      type: "security" as const,
      priority: "urgent" as const,
      title: "Account Security",
      message: "New login detected from a different device. Please verify if this was you.",
      icon: "Shield",
      actionUrl: "/account/security",
      isGlobal: true,
    },
    {
      type: "order" as const,
      priority: "medium" as const,
      title: "Order Confirmation",
      message: "Your order #ORD-67890 has been confirmed and is being prepared.",
      icon: "CheckCircle",
      actionUrl: "/account/orders",
      isGlobal: true,
    },
    {
      type: "promotion" as const,
      priority: "low" as const,
      title: "Weekend Special",
      message: "Don't miss our weekend deals on fashion and accessories!",
      icon: "Star",
      actionUrl: "/categories/fashion",
      isGlobal: true,
    },
    {
      type: "system" as const,
      priority: "medium" as const,
      title: "Platform Update",
      message: "We've added new features to improve your shopping experience.",
      icon: "Sparkles",
      actionUrl: "/updates",
      isGlobal: true,
    }
  ];

  for (const notification of sampleNotifications) {
    await db.insert(notifications).values(notification);
  }

  console.log('✅ Sample notifications seeded successfully');
}