import { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    title: "Summer Electronics Sale",
    subtitle: "Up to 70% Off",
    description: "Get the latest gadgets at unbeatable prices",
    buttonText: "Shop Now",
    buttonLink: "#",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "Fashion Week Special",
    subtitle: "New Arrivals",
    description: "Discover the latest trends in fashion",
    buttonText: "Explore",
    buttonLink: "#",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 3,
    title: "Home & Garden",
    subtitle: "Transform Your Space",
    description: "Beautiful furniture and decor for every room",
    buttonText: "Browse",
    buttonLink: "#",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
    gradient: "from-green-500 to-teal-500"
  }
];

interface HeroBannerCarouselProps {
  isCategoriesOpen?: boolean;
}

export default function HeroBannerCarousel({ isCategoriesOpen = false }: HeroBannerCarouselProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return; // Pause auto-rotation on hover
    
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered]);

  // Preload next banner image for better performance
  useEffect(() => {
    const nextBannerIndex = (currentBanner + 1) % banners.length;
    const nextImage = new Image();
    nextImage.src = banners[nextBannerIndex].image;
  }, [currentBanner]);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div 
      className="relative mb-6 overflow-hidden shadow-lg group cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[16rem] sm:h-[18rem] md:h-[20rem] lg:h-[26rem]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full overflow-hidden">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-75`}></div>
              
              {/* Content */}
              <div className={`absolute inset-0 flex items-center justify-center md:justify-start transition-all duration-300 ${
                isCategoriesOpen ? 'md:pl-72' : 'md:pl-12'
              }`}>
                <div className="text-center md:text-left text-white max-w-lg">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">
                    {banner.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-yellow-300">
                    {banner.subtitle}
                  </h2>
                  <p className="text-lg mb-6 opacity-90">
                    {banner.description}
                  </p>
                  <button 
                    className="font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 text-gray-900 dark:text-white"
                    style={{ 
                      backgroundColor: 'var(--primary-color, #FACC15)', 
                      opacity: '0.95'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.95'}
                  >
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevBanner}
        className={`absolute top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 ${
          isCategoriesOpen ? 'left-64' : 'left-4'
        }`}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <button
        onClick={nextBanner}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Dots Indicator */}
      <div className={`absolute bottom-4 transform -translate-x-1/2 flex space-x-2 transition-all duration-300 ${
        isCategoriesOpen ? 'left-1/2 md:left-[calc(50%+8rem)]' : 'left-1/2'
      }`}>
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentBanner 
                ? 'bg-yellow-400 scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}