import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Search, MapPin, Calendar, User, Phone, Mail, AlertCircle, ExternalLink, Download } from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TrackingEvent {
  id: string;
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
  completed: boolean;
}

interface TrackingInfo {
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  estimatedDelivery: string;
  actualDelivery?: string;
  recipientName: string;
  shippingAddress: string;
  events: TrackingEvent[];
  packageInfo: {
    weight: string;
    dimensions: string;
    service: string;
  };
  contact: {
    phone: string;
    email: string;
  };
}

export default function TrackOrder() {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock tracking data - in real app, this would come from API
  const mockTrackingData: { [key: string]: TrackingInfo } = {
    'TRK123456789': {
      orderNumber: 'AVX-2024-001',
      trackingNumber: 'TRK123456789',
      carrier: 'CourierPost',
      status: 'out_for_delivery',
      estimatedDelivery: '2024-07-20',
      recipientName: 'Michael Prasad',
      shippingAddress: '123 Main Street, Auckland 1010, New Zealand',
      events: [
        {
          id: '1',
          date: '2024-07-18',
          time: '08:30',
          status: 'Order Processed',
          location: 'Auckland Distribution Center',
          description: 'Your order has been processed and is ready for shipment',
          completed: true
        },
        {
          id: '2',
          date: '2024-07-18',
          time: '14:20',
          status: 'Package Picked Up',
          location: 'Auckland Fulfillment Center',
          description: 'Package has been picked up by the carrier',
          completed: true
        },
        {
          id: '3',
          date: '2024-07-19',
          time: '06:15',
          status: 'In Transit',
          location: 'Auckland Sorting Facility',
          description: 'Package is in transit to destination facility',
          completed: true
        },
        {
          id: '4',
          date: '2024-07-19',
          time: '18:45',
          status: 'Arrived at Destination Facility',
          location: 'Local Delivery Hub',
          description: 'Package has arrived at the local delivery hub',
          completed: true
        },
        {
          id: '5',
          date: '2024-07-20',
          time: '07:00',
          status: 'Out for Delivery',
          location: 'Local Delivery Hub',
          description: 'Package is out for delivery and will arrive today',
          completed: true
        },
        {
          id: '6',
          date: '2024-07-20',
          time: 'Expected',
          status: 'Delivered',
          location: 'Delivery Address',
          description: 'Package will be delivered to recipient',
          completed: false
        }
      ],
      packageInfo: {
        weight: '2.5 kg',
        dimensions: '30 x 25 x 15 cm',
        service: 'Standard Delivery'
      },
      contact: {
        phone: '+64 800 AVEENIX',
        email: 'support@aveenix.com'
      }
    },
    'TRK987654321': {
      orderNumber: 'AVX-2024-002',
      trackingNumber: 'TRK987654321',
      carrier: 'NZ Post',
      status: 'delivered',
      estimatedDelivery: '2024-07-19',
      actualDelivery: '2024-07-19',
      recipientName: 'Sarah Johnson',
      shippingAddress: '456 Queen Street, Wellington 6011, New Zealand',
      events: [
        {
          id: '1',
          date: '2024-07-16',
          time: '10:15',
          status: 'Order Processed',
          location: 'Wellington Distribution Center',
          description: 'Your order has been processed and is ready for shipment',
          completed: true
        },
        {
          id: '2',
          date: '2024-07-17',
          time: '09:30',
          status: 'Package Picked Up',
          location: 'Wellington Fulfillment Center',
          description: 'Package has been picked up by the carrier',
          completed: true
        },
        {
          id: '3',
          date: '2024-07-18',
          time: '12:45',
          status: 'In Transit',
          location: 'Wellington Sorting Facility',
          description: 'Package is in transit to destination facility',
          completed: true
        },
        {
          id: '4',
          date: '2024-07-19',
          time: '08:20',
          status: 'Out for Delivery',
          location: 'Local Delivery Hub',
          description: 'Package is out for delivery',
          completed: true
        },
        {
          id: '5',
          date: '2024-07-19',
          time: '14:30',
          status: 'Delivered',
          location: '456 Queen Street, Wellington',
          description: 'Package delivered successfully to recipient',
          completed: true
        }
      ],
      packageInfo: {
        weight: '1.2 kg',
        dimensions: '25 x 20 x 10 cm',
        service: 'Express Delivery'
      },
      contact: {
        phone: '+64 800 AVEENIX',
        email: 'support@aveenix.com'
      }
    }
  };

  const handleTrackOrder = async () => {
    setIsLoading(true);
    setError('');
    setTrackingInfo(null);

    // Simulate API call
    setTimeout(() => {
      const tracking = mockTrackingData[trackingInput.toUpperCase()];
      if (tracking) {
        setTrackingInfo(tracking);
      } else {
        setError('Tracking number not found. Please check your tracking number and try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="w-5 h-5" />;
      case 'shipped':
      case 'in_transit': return <Truck className="w-5 h-5" />;
      case 'out_for_delivery': return <MapPin className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'exception': return <AlertCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'exception': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'in_transit': return 'In Transit';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'exception': return 'Exception';
      default: return 'Unknown';
    }
  };

  return (
    <MainEcommerceLayout subtitle="Track Order">
      {/* Hero Section */}
      <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 15%, transparent) 0%, color-mix(in srgb, var(--primary-color) 8%, transparent) 50%, color-mix(in srgb, var(--primary-color) 12%, transparent) 100%)'
          }}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-full backdrop-blur-sm border" style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, white)',
                  borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                }}>
                  <Package className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">Track Your Order</h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Enter your tracking number to get real-time updates on your package delivery status.
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-bounce delay-500" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full animate-ping delay-700" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
        </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tracking Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
              <span>Enter Tracking Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter tracking number (e.g., TRK123456789)"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
              </div>
              <Button 
                onClick={handleTrackOrder}
                disabled={!trackingInput.trim() || isLoading}
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {isLoading ? 'Tracking...' : 'Track Package'}
              </Button>
            </div>
            
            {/* Sample Tracking Numbers */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Try these sample tracking numbers:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setTrackingInput('TRK123456789')}
                  className="text-sm px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  TRK123456789 (Out for Delivery)
                </button>
                <button 
                  onClick={() => setTrackingInput('TRK987654321')}
                  className="text-sm px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  TRK987654321 (Delivered)
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert className="mb-8" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tracking Results */}
        {trackingInfo && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-xl">Order #{trackingInfo.orderNumber}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">
                      Tracking: {trackingInfo.trackingNumber} • Carrier: {trackingInfo.carrier}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(trackingInfo.status)} flex items-center space-x-1 w-fit`}>
                    {getStatusIcon(trackingInfo.status)}
                    <span className="ml-1">{getStatusText(trackingInfo.status)}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{trackingInfo.recipientName}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">{trackingInfo.shippingAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Delivery Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Est. Delivery: {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </div>
                      {trackingInfo.actualDelivery && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">
                            Delivered: {new Date(trackingInfo.actualDelivery).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Package Details</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div>Weight: {trackingInfo.packageInfo.weight}</div>
                      <div>Dimensions: {trackingInfo.packageInfo.dimensions}</div>
                      <div>Service: {trackingInfo.packageInfo.service}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Label
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Carrier Website
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                  <span>Tracking Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  
                  <div className="space-y-6">
                    {trackingInfo.events.map((event, index) => (
                      <div key={event.id} className="relative flex items-start space-x-4">
                        {/* Timeline Dot */}
                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          event.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                        }`}>
                          {event.completed ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h4 className={`font-semibold ${
                                event.completed 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {event.status}
                              </h4>
                              <p className={`text-sm ${
                                event.completed 
                                  ? 'text-gray-600 dark:text-gray-300' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}>
                                {event.description}
                              </p>
                              <p className={`text-sm flex items-center space-x-1 mt-1 ${
                                event.completed 
                                  ? 'text-gray-500 dark:text-gray-400' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}>
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </p>
                            </div>
                            <div className={`text-sm mt-2 md:mt-0 ${
                              event.completed 
                                ? 'text-gray-600 dark:text-gray-300' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              <div>{new Date(event.date).toLocaleDateString()}</div>
                              <div>{event.time}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                  <span>Need Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Support</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{trackingInfo.contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{trackingInfo.contact.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Common Issues</h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <div>• Package not delivered as expected</div>
                      <div>• Damaged or missing items</div>
                      <div>• Change delivery address</div>
                      <div>• Schedule redelivery</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainEcommerceLayout>
  );
}