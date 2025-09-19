import { useEffect, useRef, useState } from "react";
import { X, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, RotateCcw, Calendar, Eye, Star, Copy, ExternalLink, Navigation, Plane, AlertCircle, XCircle } from "lucide-react";

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1299.99,
    items: 3,
    trackingNumber: "TRK123456789",
    deliveryDate: "2024-01-18",
    image: "https://images.unsplash.com/photo-1592899677977-9c10c23f31e3?w=60&h=60&fit=crop",
    primaryItem: "iPhone 15 Pro Max",
    carrier: "FedEx",
    deliveryAddress: "123 Main St, New York, NY 10001",
    trackingEvents: [
      { status: "Delivered", date: "2024-01-18", time: "2:30 PM", location: "New York, NY" },
      { status: "Out for delivery", date: "2024-01-18", time: "8:00 AM", location: "New York, NY" },
      { status: "In transit", date: "2024-01-17", time: "11:45 PM", location: "Newark, NJ" },
      { status: "Shipped", date: "2024-01-16", time: "3:20 PM", location: "Memphis, TN" }
    ]
  },
  {
    id: "ORD-2024-002", 
    date: "2024-01-10",
    status: "shipped",
    total: 899.99,
    items: 2,
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-20",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=60&h=60&fit=crop",
    primaryItem: "Samsung Galaxy S24",
    carrier: "UPS",
    deliveryAddress: "456 Oak Ave, Los Angeles, CA 90210",
    trackingEvents: [
      { status: "In transit", date: "2024-01-19", time: "6:15 AM", location: "Los Angeles, CA" },
      { status: "Departed facility", date: "2024-01-18", time: "9:30 PM", location: "Phoenix, AZ" },
      { status: "Arrived at facility", date: "2024-01-18", time: "2:15 PM", location: "Phoenix, AZ" },
      { status: "Shipped", date: "2024-01-17", time: "1:00 PM", location: "Atlanta, GA" }
    ]
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-08",
    status: "processing",
    total: 2499.99,
    items: 1,
    trackingNumber: "TRK555666777",
    estimatedDelivery: "2024-01-25",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=60&h=60&fit=crop",
    primaryItem: "MacBook Pro 16\"",
    carrier: "DHL",
    deliveryAddress: "789 Pine St, Chicago, IL 60601",
    trackingEvents: [
      { status: "Processing", date: "2024-01-19", time: "10:00 AM", location: "Chicago Warehouse" },
      { status: "Payment confirmed", date: "2024-01-08", time: "3:45 PM", location: "Online" },
      { status: "Order placed", date: "2024-01-08", time: "3:30 PM", location: "Online" }
    ]
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-05",
    status: "cancelled",
    total: 599.99,
    items: 2,
    trackingNumber: null,
    estimatedDelivery: null,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=60&h=60&fit=crop",
    primaryItem: "iPad Air 5th Gen",
    carrier: null,
    deliveryAddress: "321 Elm St, Miami, FL 33101",
    trackingEvents: [
      { status: "Cancelled", date: "2024-01-06", time: "11:30 AM", location: "Customer Request" },
      { status: "Order placed", date: "2024-01-05", time: "2:15 PM", location: "Online" }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'shipped':
      return <Truck className="w-5 h-5 text-blue-500" />;
    case 'processing':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'cancelled':
      return <X className="w-5 h-5 text-red-500" />;
    default:
      return <Package className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
};

export default function OrdersModal({ isOpen, onClose }: OrdersModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [showTracking, setShowTracking] = useState(false);

  // Handle click outside to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100]"
      onClick={handleBackdropClick}
    >
      {/* Modal content that fills exact space between header and footer */}
      <div className="fixed top-16 left-0 right-0 bottom-16 flex flex-col bg-white dark:bg-gray-800 border-t-2 border-b-2 border-white dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
        {/* Orders Header */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Orders</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={order.image}
                    alt={order.primaryItem}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-200 dark:bg-gray-600"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {order.primaryItem}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Order #{order.id}</span>
                      <span>•</span>
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{order.items} item{order.items > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {order.status === 'delivered' && `Delivered ${new Date(order.deliveryDate!).toLocaleDateString()}`}
                          {order.status === 'shipped' && `Est. delivery ${new Date(order.estimatedDelivery!).toLocaleDateString()}`}
                          {order.status === 'processing' && `Processing - Est. ${new Date(order.estimatedDelivery!).toLocaleDateString()}`}
                          {order.status === 'cancelled' && 'Order cancelled'}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Tracking: {order.trackingNumber}
                            </span>
                            <button 
                              onClick={() => navigator.clipboard.writeText(order.trackingNumber)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="Copy tracking number"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowTracking(true);
                              }}
                              className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Track Details</span>
                            </button>
                            {order.status === 'delivered' && (
                              <button className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400 hover:underline">
                                <Star className="w-3 h-3" />
                                <span>Rate & Review</span>
                              </button>
                            )}
                          </div>
                        </div>
                        {order.carrier && (
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <Truck className="w-3 h-3" />
                            <span>Carrier: {order.carrier}</span>
                            <span>•</span>
                            <button 
                              onClick={() => window.open(`https://${order.carrier.toLowerCase()}.com/tracking`, '_blank')}
                              className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <span>Track on {order.carrier}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Phone className="w-4 h-4" />
                <span>Contact Support</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <RotateCcw className="w-4 h-4" />
                <span>Return Item</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {orders.length} orders found
            </p>
          </div>
        </div>
      </div>
      
      {/* Advanced Tracking Details Modal */}
      {showTracking && selectedOrder && (
        <div className="fixed inset-0 z-[110] bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Tracking Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order Tracking
                </h3>
                <button
                  onClick={() => setShowTracking(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedOrder.image}
                  alt={selectedOrder.primaryItem}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {selectedOrder.primaryItem}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order #{selectedOrder.id}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tracking Number</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.trackingNumber}
                    </p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(selectedOrder.trackingNumber)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Carrier</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedOrder.carrier}
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Delivery Address</p>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tracking Timeline */}
            <div className="p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Tracking Timeline
              </h4>
              <div className="space-y-4">
                {selectedOrder.trackingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                      index === 0 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.status}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.time}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.date} • {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.open(`https://${selectedOrder.carrier?.toLowerCase()}.com/tracking`, '_blank')}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Track on {selectedOrder.carrier}</span>
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedOrder.trackingNumber);
                    alert('Tracking number copied to clipboard!');
                  }}
                  className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}