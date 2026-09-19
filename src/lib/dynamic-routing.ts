import { DemoStop } from "./agra-demo-data";

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export function generateLmoRoute(availableStops: DemoStop[], cap = 7, startStopId?: string): DemoStop[] {
  const unassigned = availableStops.filter(s => !s.isAssigned);
  if (unassigned.length === 0) return [];

  // Pick the specified starting point, or a random one
  let startStop = startStopId ? unassigned.find(s => s.id === startStopId) : undefined;
  
  if (!startStop) {
    const startIndex = Math.floor(Math.random() * unassigned.length);
    startStop = unassigned[startIndex];
  }

  // Calculate distances to all other unassigned stops
  const stopsWithDistance = unassigned.map(stop => ({
    ...stop,
    distance: haversineDistance(startStop.lat, startStop.lng, stop.lat, stop.lng)
  }));

  // Sort by distance (nearest first)
  stopsWithDistance.sort((a, b) => a.distance - b.distance);

  // Return up to 'cap' stops (including the starting stop which has distance 0)
  return stopsWithDistance.slice(0, cap).map(s => {
    const { distance, ...stopData } = s;
    return stopData;
  });
}
