import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface WeatherData {
  date: string;
  location: string;
  temperature: number | null;
  description: string | null;
  icon: string | null;
}

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Format current date
  const formatDate = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return { date };
  };

  // Get weather data from server API
  const getWeatherData = async () => {
    try {
      const response = await fetch('/api/weather', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }
      
      const data = await response.json();
      return {
        location: data.location || 'Your Location',
        temperature: data.temperature,
        description: data.description,
        icon: data.icon
      };
    } catch (error) {
      return {
        location: 'Your Location',
        temperature: null,
        description: null,
        icon: null
      };
    }
  };

  // Update date and weather data
  const updateData = async () => {
    const { date } = formatDate();
    const weather = await getWeatherData();
    
    setWeatherData({
      date,
      location: weather.location,
      temperature: weather.temperature,
      description: weather.description,
      icon: weather.icon
    });
  };

  // Update every minute
  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  if (!weatherData) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
      {/* Date and Location */}
      <div className="flex items-center space-x-3">
        <span className="font-medium text-xs">{weatherData.date}</span>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-green-500" />
          <span className="text-xs">{weatherData.location}</span>
        </div>
        {weatherData.temperature && (
          <div className="flex items-center gap-1">
            <span className="text-xs">{weatherData.icon}</span>
            <span className="text-xs font-medium">{weatherData.temperature}°C</span>
          </div>
        )}
      </div>
    </div>
  );
}