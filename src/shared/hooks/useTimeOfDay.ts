import { useState, useEffect } from 'react';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 23) return 'evening';
  return 'night';
}

export function useTimeOfDay(): TimeOfDay {
  const [tod, setTod] = useState<TimeOfDay>(getTimeOfDay);

  useEffect(() => {
    const interval = setInterval(() => setTod(getTimeOfDay()), 5 * 60_000);
    return () => clearInterval(interval);
  }, []);

  return tod;
}
