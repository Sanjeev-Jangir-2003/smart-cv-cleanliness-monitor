import { ToiletZone, CleanlinessData, Alert } from '../types';

export const generateMockToilets = (): ToiletZone[] => {
  const locations = [
    'Central Park Station', 'Mall Complex A', 'University Campus',
    'Airport Terminal 2', 'Shopping District', 'Metro Station B',
    'Hospital Complex', 'Business District', 'Residential Area C'
  ];

  return locations.map((location, index) => ({
    id: `toilet-${index + 1}`,
    name: `Toilet ${index + 1}`,
    location,
    lastUpdated: new Date(Date.now() - Math.random() * 3600000),
    cleanlinessScore: Math.floor(Math.random() * 100),
    status: ['Clean', 'Moderately Dirty', 'Dirty'][Math.floor(Math.random() * 3)] as any,
    zones: {
      floor: Math.floor(Math.random() * 100),
      toiletSeat: Math.floor(Math.random() * 100),
      sink: Math.floor(Math.random() * 100),
      dustbin: Math.floor(Math.random() * 100),
    },
    predictedDirtyTime: new Date(Date.now() + Math.random() * 7200000),
    alertsActive: Math.random() > 0.7,
  }));
};

export const generateHistoricalData = (toiletId: string): CleanlinessData[] => {
  const data: CleanlinessData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3600000);
    const baseScore = 70 + Math.sin(i / 4) * 20;
    const noise = Math.random() * 20 - 10;
    
    data.push({
      timestamp,
      score: Math.max(0, Math.min(100, Math.floor(baseScore + noise))),
      toiletId,
    });
  }
  
  return data;
};

export const generateMockAlerts = (): Alert[] => {
  const messages = [
    'Cleanliness score below threshold (25)',
    'Multiple zones require immediate attention',
    'Predicted cleaning time exceeded',
    'High traffic detected - preventive cleaning recommended',
    'Dustbin overflow detected',
    'Floor contamination level critical'
  ];

  return messages.map((message, index) => ({
    id: `alert-${index + 1}`,
    toiletId: `toilet-${Math.floor(Math.random() * 9) + 1}`,
    message,
    severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    resolved: Math.random() > 0.6,
  }));
};