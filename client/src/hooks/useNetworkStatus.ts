import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const retryConnection = async () => {
    setIsRetrying(true);
    // Simple connectivity test
    try {
      await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
      });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    } finally {
      setIsRetrying(false);
    }
  };

  return { isOnline, isRetrying, retryConnection };
}