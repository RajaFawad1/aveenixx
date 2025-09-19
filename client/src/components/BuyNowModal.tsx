import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Truck,
  CreditCard,
  MapPin,
  Clock,
  Shield,
  ChevronRight
} from 'lucide-react';

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    brand?: string;
    inStock?: boolean;
    estimatedDelivery?: string;
  };
  quantity?: number;
}

const shippingOptions = [
  { id: "standard", name: "Standard Shipping", price: 9.99, time: "5-7 business days", free: true },
  { id: "express", name: "Express Shipping", price: 19.99, time: "2-3 business days", free: false },
  { id: "overnight", name: "Overnight Shipping", price: 29.99, time: "1 business day", free: false }
];

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "paypal", name: "PayPal", icon: "💳" },
  { id: "apple", name: "Apple Pay", icon: "🍎" },
];

export default function BuyNowModal({ isOpen, onClose, product, quantity = 1 }: BuyNowModalProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Product, 2: Shipping, 3: Payment, 4: Review
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: ""
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      onClose();
      navigate(`/order/confirmation/${data.orderId}`);
    },
    onError: (error) => {
      toast({
        title: "Order Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  });

  const subtotal = product.price * quantity;
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);
  const shippingCost = selectedShippingOption && !selectedShippingOption.free ? selectedShippingOption.price : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = () => {
    if (!email || !shippingAddress.fullName || !shippingAddress.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: [{
        productId: product.id,
        quantity: quantity,
        price: product.price
      }],
      customer: { email },
      shipping: {
        address: shippingAddress,
        method: selectedShipping,
        cost: shippingCost
      },
      payment: {
        method: selectedPayment
      },
      totals: {
        subtotal,
        shipping: shippingCost,
        tax,
        total
      }
    };

    createOrderMutation.mutate(orderData);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{product.brand}</p>
                <p className="font-bold text-xl">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-[var(--primary-color)] bg-opacity-20 text-[var(--primary-color)]">
                    {product.inStock ? 'In Stock' : 'Limited Stock'}
                  </Badge>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {product.estimatedDelivery || '2-3 days'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label>Quantity:</Label>
              <Input 
                type="number" 
                value={quantity} 
                readOnly
                className="w-20"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                placeholder="123 Main Street"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                  placeholder="10001"
                  required
                />
              </div>
            </div>
            <div>
              <Label>Shipping Method</Label>
              <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                {shippingOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <Label htmlFor={option.id}>{option.name}</Label>
                        <p className="text-sm text-gray-500">{option.time}</p>
                      </div>
                      <div className="text-right">
                        {option.free && subtotal > 50 ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          <span className="font-medium">${option.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center gap-3">
                      {typeof method.icon === 'string' ? (
                        <span className="text-2xl">{method.icon}</span>
                      ) : (
                        <method.icon className="w-6 h-6" />
                      )}
                      <Label htmlFor={method.id}>{method.name}</Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            {selectedPayment === 'card' && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Order Summary</h4>
              <div className="flex justify-between">
                <span>{product.name} × {quantity}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({selectedShippingOption?.name})</span>
                <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure checkout protected by SSL encryption</span>
              </div>
            </div>
          </div>
        );
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Product Details";
      case 2: return "Shipping Information";
      case 3: return "Payment Method";
      case 4: return "Review Order";
      default: return "Quick Checkout";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Quick Checkout - {getStepTitle()}</span>
            <Badge variant="outline">Step {step} of 4</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <ChevronRight className={`w-4 h-4 mx-2 ${
                    stepNum < step ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          {renderStepContent()}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handlePlaceOrder}
                disabled={createOrderMutation.isPending}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                {createOrderMutation.isPending ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}