import { useEffect, useState } from 'react';

interface PollingSettings {
  frequency: number;
  enabled: boolean;
}

export function usePollingSettings(initial: PollingSettings = { frequency: 10000, enabled: true }) {
  const [pollingSettings, setPollingSettings] = useState<PollingSettings>(initial);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/polling/settings');
        if (response.ok) {
          const settings = await response.json();
          setPollingSettings(settings);
        }
      } catch (err) {
        // ignore
      }
    };
    load();
  }, []);

  const updatePollingSettings = async (newSettings: PollingSettings) => {
    try {
      const response = await fetch('/api/polling/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (response.ok) {
        setPollingSettings(newSettings);
      }
    } catch (err) {
      // ignore
    }
  };

  return { pollingSettings, setPollingSettings, updatePollingSettings };
}


