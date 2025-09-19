import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Store, 
  Bell, 
  CreditCard, 
  Shield, 
  User,
  Save,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VendorLayout from "@/components/vendor/VendorLayout";

export default function VendorSettings() {
  const [storeInfo, setStoreInfo] = useState({
    storeName: "Tech Paradise",
    storeDescription: "Premium electronics and gadgets for tech enthusiasts",
    storeEmail: "contact@techparadise.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Tech Street, Silicon Valley, CA 94301",
    businessLicense: "BL-2024-001234"
  });

  const [notifications, setNotifications] = useState({
    orderNotifications: true,
    emailMarketing: false,
    smsAlerts: true,
    weeklyReports: true,
    lowStockAlerts: true,
    paymentNotifications: true
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paypalEmail: "payments@techparadise.com",
    stripeConnected: true,
    bankAccount: "****-****-****-5678",
    taxId: "12-3456789"
  });

  return (
    <VendorLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Store Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your store preferences and account settings
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span>Store Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeInfo.storeName}
                    onChange={(e) => setStoreInfo({...storeInfo, storeName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeInfo.storeEmail}
                    onChange={(e) => setStoreInfo({...storeInfo, storeEmail: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="storeDescription">Store Description</Label>
                <textarea
                  id="storeDescription"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={storeInfo.storeDescription}
                  onChange={(e) => setStoreInfo({...storeInfo, storeDescription: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={storeInfo.storePhone}
                    onChange={(e) => setStoreInfo({...storeInfo, storePhone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="businessLicense">Business License</Label>
                  <Input
                    id="businessLicense"
                    value={storeInfo.businessLicense}
                    onChange={(e) => setStoreInfo({...storeInfo, businessLicense: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="storeAddress">Store Address</Label>
                <Input
                  id="storeAddress"
                  value={storeInfo.storeAddress}
                  onChange={(e) => setStoreInfo({...storeInfo, storeAddress: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Store Logo</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Store className="w-8 h-8 text-gray-400" />
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    value={paymentInfo.paypalEmail}
                    onChange={(e) => setPaymentInfo({...paymentInfo, paypalEmail: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={paymentInfo.taxId}
                    onChange={(e) => setPaymentInfo({...paymentInfo, taxId: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bankAccount">Bank Account</Label>
                <Input
                  id="bankAccount"
                  value={paymentInfo.bankAccount}
                  onChange={(e) => setPaymentInfo({...paymentInfo, bankAccount: e.target.value})}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Stripe Connected
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Ready to accept payments
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="orderNotifications">Order Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified about new orders
                  </p>
                </div>
                <Switch
                  id="orderNotifications"
                  checked={notifications.orderNotifications}
                  onCheckedChange={(checked) => setNotifications({...notifications, orderNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailMarketing">Email Marketing</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive marketing emails
                  </p>
                </div>
                <Switch
                  id="emailMarketing"
                  checked={notifications.emailMarketing}
                  onCheckedChange={(checked) => setNotifications({...notifications, emailMarketing: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsAlerts">SMS Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get SMS for urgent updates
                  </p>
                </div>
                <Switch
                  id="smsAlerts"
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, smsAlerts: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Weekly performance reports
                  </p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Alert when inventory is low
                  </p>
                </div>
                <Switch
                  id="lowStockAlerts"
                  checked={notifications.lowStockAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, lowStockAlerts: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="paymentNotifications">Payment Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified about payments
                  </p>
                </div>
                <Switch
                  id="paymentNotifications"
                  checked={notifications.paymentNotifications}
                  onCheckedChange={(checked) => setNotifications({...notifications, paymentNotifications: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Two-Factor Authentication
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-red-600">
                <Shield className="w-4 h-4 mr-2" />
                Deactivate Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </VendorLayout>
  );
}