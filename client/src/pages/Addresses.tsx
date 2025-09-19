import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Home, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddressBook } from '@/components/AddressBook';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export default function Addresses() {
  const { user } = useAuth();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // Fetch user addresses from API
  const { data: addresses = [], isLoading: addressesLoading, refetch } = useQuery({
    queryKey: [`/api/user/${user?.id}/addresses`],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/user/${user?.id}/addresses`);
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      return response.json();
    },
  });

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'work': return <Building className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getAddressLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Home';
      case 'work': return 'Work';
      default: return 'Other';
    }
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  return (
    <MainEcommerceLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Addresses
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your shipping and billing addresses
            </p>
          </div>

          {/* Add New Address Button */}
          <div className="mb-6">
            <Button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          </div>

          {/* Loading State */}
          {addressesLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Address List */}
          {!addressesLoading && addresses.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address: any) => (
                <Card key={address.id} className="relative hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getAddressIcon(address.type || 'other')}
                        <CardTitle className="text-lg">
                          {getAddressLabel(address.type || 'other')} Address
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        {address.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {address.fullName || `${address.firstName || ''} ${address.lastName || ''}`.trim()}
                      </p>
                      {address.company && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.company}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.addressLine1 || address.street}
                      </p>
                      {address.addressLine2 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.addressLine2}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.country || 'United States'}
                      </p>
                      {address.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.phone}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!addressesLoading && addresses.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No addresses yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Add your first address to get started
                </p>
                <Button onClick={() => setShowAddressModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Address Management Modal */}
          <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Manage Your Addresses</DialogTitle>
              </DialogHeader>
              <AddressBook
                userId={parseInt(user?.id || '1')}
                onAddressSelect={handleAddressSelect}
                selectedAddressId={selectedAddress?.id}
                onAddressAdded={() => {
                  refetch();
                  setShowAddressModal(false);
                }}
                onAddressUpdated={() => {
                  refetch();
                  setShowAddressModal(false);
                }}
                onAddressDeleted={() => {
                  refetch();
                  setShowAddressModal(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}