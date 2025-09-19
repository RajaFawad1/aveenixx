import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OfflineIndicator() {
  const { isOnline, isRetrying, retryConnection } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
      <WifiOff className="h-5 w-5" />
      <span className="text-sm font-medium">You're offline</span>
      <Button
        size="sm"
        variant="outline"
        onClick={retryConnection}
        disabled={isRetrying}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
      >
        {isRetrying ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          'Retry'
        )}
      </Button>
    </div>
  );
}