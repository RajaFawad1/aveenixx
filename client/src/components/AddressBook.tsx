import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, MapPin, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserAddress {
  id: number;
  userId: number;
  type: string;
  label: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressBookProps {
  userId: number;
  onAddressSelect: (address: UserAddress) => void;
  selectedAddressId?: number;
}

export function AddressBook({ userId, onAddressSelect, selectedAddressId }: AddressBookProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for address creation/editing
  const [formData, setFormData] = useState({
    label: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    type: "shipping",
    isDefault: false
  });

  // Fetch user addresses
  const { data: addresses = [], isLoading } = useQuery<UserAddress[]>({
    queryKey: [`/api/user/${userId}/addresses`],
    enabled: !!userId
  });

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: async (addressData: any) => {
      return await apiRequest("POST", `/api/user/${userId}/addresses`, addressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/addresses`] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Address added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add address", variant: "destructive" });
    }
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: async ({ addressId, addressData }: { addressId: number; addressData: any }) => {
      return await apiRequest("PUT", `/api/user/${userId}/addresses/${addressId}`, addressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/addresses`] });
      setIsDialogOpen(false);
      setEditingAddress(null);
      resetForm();
      toast({ title: "Address updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update address", variant: "destructive" });
    }
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: number) => {
      return await apiRequest("DELETE", `/api/user/${userId}/addresses/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/addresses`] });
      toast({ title: "Address deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete address", variant: "destructive" });
    }
  });

  // Set default address mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (addressId: number) => {
      return await apiRequest("PUT", `/api/user/${userId}/addresses/${addressId}/set-default`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/addresses`] });
      toast({ title: "Default address updated" });
    },
    onError: () => {
      toast({ title: "Failed to update default address", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      label: "",
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      phone: "",
      type: "shipping",
      isDefault: false
    });
  };

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || "",
      type: address.type,
      isDefault: address.isDefault
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingAddress) {
      updateAddressMutation.mutate({
        addressId: editingAddress.id,
        addressData: formData
      });
    } else {
      createAddressMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div>Loading addresses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEditingAddress(null);
                resetForm();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] max-w-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="label">Address Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Home, Work, etc."
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingAddress ? "Update" : "Add"} Address
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No saved addresses yet.</p>
            <p className="text-sm text-gray-400">Add an address to make checkout faster next time.</p>
            <div className="mt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingAddress(null);
                      resetForm();
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add your first address
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] max-w-none max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="label">Address Label</Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="Home, Work, etc."
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData({ ...formData, country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      />
                      <Label htmlFor="isDefault">Set as default address</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingAddress ? "Update" : "Add"} Address
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {addresses.map((address: UserAddress) => (
            <Card 
              key={address.id}
              className={`cursor-pointer transition-all ${
                selectedAddressId === address.id 
                  ? 'ring-2 ring-green-500 bg-green-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{address.label}</h4>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      {selectedAddressId === address.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm font-medium">{address.fullName}</p>
                    <p className="text-sm text-gray-600">{address.addressLine1}</p>
                    {address.addressLine2 && (
                      <p className="text-sm text-gray-600">{address.addressLine2}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    {address.phone && (
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(address);
                      }}
                    >
                      Edit
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDefaultMutation.mutate(address.id);
                        }}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddressMutation.mutate(address.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}