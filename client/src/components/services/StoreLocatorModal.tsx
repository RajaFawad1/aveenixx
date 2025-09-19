import { useEffect, useRef, useState } from "react";
import { X, MapPin, Phone, Clock, Navigation, Star, ExternalLink, Search, Filter } from "lucide-react";

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const stores = [
  {
    id: 1,
    name: "Aveenix Express - Manhattan",
    address: "123 Fifth Avenue, New York, NY 10001",
    phone: "(212) 555-0123",
    hours: "Mon-Sat: 9AM-9PM, Sun: 11AM-7PM",
    distance: "0.5 miles",
    rating: 4.8,
    reviews: 342,
    services: ["Electronics", "Repairs", "Customer Service"],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Aveenix Express - Brooklyn",
    address: "456 Atlantic Avenue, Brooklyn, NY 11217",
    phone: "(718) 555-0456",
    hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
    distance: "2.3 miles",
    rating: 4.6,
    reviews: 198,
    services: ["Electronics", "Pickup Point", "Returns"],
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Aveenix Express - Queens",
    address: "789 Northern Boulevard, Queens, NY 11101",
    phone: "(718) 555-0789",
    hours: "Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-7PM",
    distance: "4.1 miles",
    rating: 4.7,
    reviews: 267,
    services: ["Electronics", "Repairs", "Training"],
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Aveenix Express - New Jersey",
    address: "321 Garden State Plaza, Paramus, NJ 07652",
    phone: "(201) 555-0321",
    hours: "Mon-Sat: 10AM-9PM, Sun: 11AM-8PM",
    distance: "8.7 miles",
    rating: 4.5,
    reviews: 412,
    services: ["Electronics", "Customer Service", "Pickup Point"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
  }
];

export default function StoreLocatorModal({ isOpen, onClose }: StoreLocatorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<typeof stores[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-[100]"
      onClick={handleBackdropClick}
    >
      {/* Modal content that fills exact space between header and footer */}
      <div className="fixed top-20 left-0 right-0 bottom-20 flex flex-col bg-white dark:bg-gray-800 border-t-2 border-b-2 border-white dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
        {/* Store Locator Header */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Store Locator</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by city, address, or store name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Store List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => setSelectedStore(store)}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {store.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {store.rating} ({store.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{store.address}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Navigation className="w-4 h-4" />
                        <span>{store.distance}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{store.hours}</span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {store.services.map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
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
                <MapPin className="w-4 h-4" />
                <span>Use Current Location</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <ExternalLink className="w-4 h-4" />
                <span>View on Map</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {filteredStores.length} stores found
            </p>
          </div>
        </div>
      </div>
      
      {/* Store Details Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-[110] bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Store Header */}
            <div className="relative">
              <img
                src={selectedStore.image}
                alt={selectedStore.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <button
                onClick={() => setSelectedStore(null)}
                className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Store Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedStore.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedStore.rating} ({selectedStore.reviews} reviews)
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{selectedStore.address}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{selectedStore.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{selectedStore.hours}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{selectedStore.distance} away</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Services Available</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStore.services.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}