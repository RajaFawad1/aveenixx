import { Monitor, Headphones, Smartphone, Tablet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

export default function AdvertisingTiles() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState({
    hours: 2,
    minutes: 15,
    seconds: 30
  });
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch real products to power tiles
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products/recently-added?limit=20');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch {}
    };
    fetchProducts();
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const tiles = [
    {
      title: "SUPER DEALS!",
      subtitle: "PREMIUM TABLETS",
      discount: "UP TO 60% OFF!",
      buttonText: "SHOP NOW →",
      icon: <Tablet className="w-6 h-6 text-white/80 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />,
      stockLeft: Math.floor(Math.random() * 10) + 1,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      keyword: "tablet"
    },
    {
      title: "HOT SALE!",
      subtitle: "4K GAMING MONITORS",
      discount: "UP TO 55% OFF!",
      buttonText: "SHOP NOW →",
      icon: <Monitor className="w-6 h-6 text-white/80 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />,
      stockLeft: Math.floor(Math.random() * 10) + 1,
      bgColor: "bg-gradient-to-br from-gray-600 to-gray-700",
      keyword: "monitor"
    },
    {
      title: "FLASH SALE!",
      subtitle: "WIRELESS HEADPHONES",
      discount: "UP TO 75% OFF!",
      buttonText: "SHOP NOW →",
      icon: <Headphones className="w-6 h-6 text-white/80 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />,
      stockLeft: Math.floor(Math.random() * 10) + 1,
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      keyword: "headphone"
    },
    {
      title: "MEGA SALE!",
      subtitle: "PREMIUM SMARTPHONES",
      discount: "UP TO 70% OFF!",
      buttonText: "SHOP NOW →",
      icon: <Smartphone className="w-6 h-6 text-white/80 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />,
      stockLeft: Math.floor(Math.random() * 10) + 1,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      keyword: "phone"
    }
  ];

  // Map each tile to a real product by keyword; fallback to first available
  const tileTargets = useMemo(() => {
    const byMatch = (p: any, kw: string) => {
      const name = (p?.name || '').toLowerCase();
      const category = (p?.category || '').toLowerCase();
      return name.includes(kw) || category.includes(kw);
    };

    const used = new Set<string>();
    return tiles.map(t => {
      let chosen = products.find(p => byMatch(p, t.keyword) && !used.has(String(p.id)));
      if (!chosen) {
        chosen = products.find(p => !used.has(String(p.id)));
      }
      if (chosen) {
        used.add(String(chosen.id));
        return { product: chosen, href: `/product/${chosen.id}` };
      }
      return undefined;
    });
  }, [products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
      {tiles.map((tile, index) => {
        const target = tileTargets[index] as undefined | { product: any; href: string };
        const href = target?.href;
        const content = (
        <div
          key={index}
          className={`group ${tile.bgColor} p-2.5 md:p-3 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-24 md:h-28 text-white`}
        >
          {/* Limited Time Badge */}
          <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
            LIMITED
          </div>
          
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <h3 className="font-bold text-xs mb-0.5 leading-tight text-white group-hover:text-yellow-200 transition-colors duration-200" style={{ color: 'inherit' }}>{tile.title}</h3>
              {target?.product?.name ? (
                <p className="text-sm font-bold leading-tight text-white/90 truncate max-w-[14rem]">{target.product.name}</p>
              ) : null}
              <p className="text-xs font-semibold text-orange-200 mb-0.5">{tile.discount}</p>
              
              {/* Countdown Timer */}
              <div className="text-xs text-white/90 mb-0.5">
                <span className="font-medium">Ends in: </span>
                <span className="font-mono bg-black/20 px-1 rounded text-xs">
                  {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
                </span>
              </div>
              
              <button
                className="text-xs font-semibold underline hover:no-underline transition-all text-white hover:opacity-80"
                onClick={() => href && setLocation(href)}
              >
                {tile.buttonText}
              </button>
            </div>
            
            <div className="opacity-60 group-hover:opacity-80 transition-opacity ml-2 md:ml-4">
              {tile.icon}
            </div>
          </div>
          
          {/* Stock indicator */}
          <div className="absolute bottom-1 right-1 text-xs text-white/70">
            Only {tile.stockLeft} left!
          </div>
          
          {/* Animated background effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br from-white to-transparent"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
        </div>
        );
        return href ? (
          <Link key={index} href={href}>
            {content}
          </Link>
        ) : (
          content
        );
      })}
    </div>
  );
}