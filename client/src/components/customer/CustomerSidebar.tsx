import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShoppingBag, MapPin, Heart, Bell, CreditCard, LogOut, Truck, Award } from "lucide-react";

export default function CustomerSidebar() {
  const [location, setLocation] = useLocation();
  const path = location || "/account";

  const NavItem = ({ active, label, icon: Icon, href }: { active: boolean; label: string; icon: any; href: string }) => (
    <button
      onClick={() => setLocation(href)}
      className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">My Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <NavItem active={path === "/account"} label="Overview" icon={User} href="/account" />
        <NavItem active={path.startsWith("/account/orders")} label="My Orders" icon={ShoppingBag} href="/account/orders" />
        <NavItem active={path.startsWith("/account/track-orders")} label="Track Orders" icon={Truck} href="/account/track-orders" />
        <NavItem active={path.startsWith("/account/addresses")} label="Address Book" icon={MapPin} href="/account/addresses" />
        <NavItem active={path.startsWith("/account/wishlist")} label="Wishlist" icon={Heart} href="/account/wishlist" />
        <NavItem active={path.startsWith("/account/rewards")} label="Rewards & Tasks" icon={Award} href="/account/rewards" />
        <NavItem active={path.startsWith("/account/notifications")} label="Notifications" icon={Bell} href="/account/notifications" />
        <NavItem active={path.startsWith("/account/payments")} label="Payment Methods" icon={CreditCard} href="/account/payments" />
        <div className="pt-2">
          <button className="flex items-center w-full px-3 py-2 rounded-md text-sm bg-red-500 hover:bg-red-600 text-white" onClick={() => setLocation("/logout")}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </CardContent>
    </Card>
  );
}


