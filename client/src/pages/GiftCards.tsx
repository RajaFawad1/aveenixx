import { useState } from 'react';
import { Gift, CreditCard, Mail, Download, ShoppingBag, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function GiftCards() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [giftCardType, setGiftCardType] = useState<'digital' | 'physical'>('digital');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');

  const predefinedAmounts = [25, 50, 100, 150, 200, 500];

  const giftCardDesigns = [
    {
      id: 'birthday',
      name: 'Birthday Celebration',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=200&fit=crop',
      category: 'Birthday'
    },
    {
      id: 'holiday',
      name: 'Holiday Season',
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=300&h=200&fit=crop',
      category: 'Holiday'
    },
    {
      id: 'congratulations',
      name: 'Congratulations',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=200&fit=crop',
      category: 'Celebration'
    },
    {
      id: 'thank-you',
      name: 'Thank You',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
      category: 'Appreciation'
    },
    {
      id: 'general',
      name: 'Classic Design',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop',
      category: 'General'
    },
    {
      id: 'wedding',
      name: 'Wedding Gift',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop',
      category: 'Wedding'
    }
  ];

  const [selectedDesign, setSelectedDesign] = useState(giftCardDesigns[0]);

  const benefits = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Shop Anything",
      description: "Use on millions of products across all categories"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Never Expires",
      description: "Gift cards maintain their value indefinitely"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Perfect Gift",
      description: "Let them choose exactly what they want"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Instant Delivery",
      description: "Digital cards delivered via email immediately"
    }
  ];

  const getCurrentAmount = () => {
    return customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  };

  const handlePurchase = () => {
    const amount = getCurrentAmount();
    if (amount < 5) {
      alert('Minimum gift card amount is $5');
      return;
    }
    if (amount > 2000) {
      alert('Maximum gift card amount is $2000');
      return;
    }
    
    console.log('Processing gift card purchase:', {
      amount,
      type: giftCardType,
      design: selectedDesign.id,
      recipient: recipientEmail,
      message,
      sender: senderName
    });
    
    // Here you would integrate with payment processing
    alert(`Gift card for $${amount} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Gift className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">
              Give the Gift of Choice
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Perfect for any occasion. Let your loved ones choose exactly what they want from millions of products.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <div className="text-white">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm opacity-90">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gift Card Configuration */}
          <div className="space-y-8">
            {/* Gift Card Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Choose Gift Card Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      giftCardType === 'digital'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setGiftCardType('digital')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Mail className="w-6 h-6 text-blue-600" />
                      <Badge>Instant</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">Digital Gift Card</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Delivered instantly via email with custom message
                    </p>
                  </div>
                  
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      giftCardType === 'physical'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setGiftCardType('physical')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Gift className="w-6 h-6 text-purple-600" />
                      <Badge>5-7 Days</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">Physical Gift Card</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Beautiful card mailed to recipient's address
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amount Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      className={`p-3 border-2 rounded-lg font-semibold transition-colors ${
                        selectedAmount === amount && !customAmount
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Or enter custom amount ($5 - $2000)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      className="pl-8"
                      min="5"
                      max="2000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Design</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {giftCardDesigns.map((design) => (
                    <div
                      key={design.id}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedDesign.id === design.id
                          ? 'border-blue-500'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setSelectedDesign(design)}
                    >
                      <img
                        src={design.image}
                        alt={design.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2 text-center">
                        <p className="text-xs font-medium">{design.name}</p>
                        <p className="text-xs text-gray-500">{design.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Recipient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input
                    id="recipient-name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient's name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="recipient-email">
                    {giftCardType === 'digital' ? 'Recipient Email (Required)' : 'Recipient Email (Optional)'}
                  </Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient's email"
                    required={giftCardType === 'digital'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sender-name">Your Name</Label>
                  <Input
                    id="sender-name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a personal message for the recipient..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={3}
                    maxLength={250}
                  />
                  <p className="text-xs text-gray-500 mt-1">{message.length}/250 characters</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gift Card Preview & Purchase */}
          <div className="space-y-8">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Gift Card Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg p-6 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Gift className="w-8 h-8" />
                      <span className="text-sm font-medium">AVEENIX</span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-3xl font-bold mb-2">${getCurrentAmount().toFixed(2)}</div>
                      <div className="text-sm opacity-90">Gift Card</div>
                    </div>
                    
                    {recipientName && (
                      <div className="mb-2">
                        <div className="text-sm opacity-90">To:</div>
                        <div className="font-semibold">{recipientName}</div>
                      </div>
                    )}
                    
                    {senderName && (
                      <div className="mb-4">
                        <div className="text-sm opacity-90">From:</div>
                        <div className="font-semibold">{senderName}</div>
                      </div>
                    )}
                    
                    {message && (
                      <div className="bg-white bg-opacity-20 rounded p-3 text-sm">
                        "{message}"
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Badge className="bg-green-100 text-green-800">
                    {selectedDesign.category} Design
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Gift Card Value</span>
                    <span className="font-semibold">${getCurrentAmount().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Processing Fee</span>
                    <span>Free</span>
                  </div>
                  
                  {giftCardType === 'physical' && (
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${getCurrentAmount().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full py-3 text-lg"
                    onClick={handlePurchase}
                    disabled={getCurrentAmount() < 5}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Star className="w-4 h-4 mr-1" />
                      <span>Secure checkout with 256-bit SSL encryption</span>
                    </div>
                    {giftCardType === 'digital' && (
                      <p className="text-xs text-gray-500">
                        Digital gift cards are delivered within 5 minutes
                      </p>
                    )}
                    {giftCardType === 'physical' && (
                      <p className="text-xs text-gray-500">
                        Physical cards shipped within 1-2 business days
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <p>• Gift cards never expire and have no fees</p>
                <p>• Can be used for purchases on Aveenix platform only</p>
                <p>• Not redeemable for cash except where required by law</p>
                <p>• Lost or stolen gift cards cannot be replaced</p>
                <p>• Gift cards are non-transferable</p>
                <p>• For full terms, visit our Terms of Service</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Popular Gift Cards */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Perfect for Every Occasion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Birthdays</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Make their special day even more memorable with the gift of choice.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Holidays</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Perfect for Christmas, Mother's Day, Father's Day, and all celebrations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank You</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Show appreciation to employees, teachers, friends, and family.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}