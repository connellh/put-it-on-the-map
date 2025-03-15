import maplibregl from 'maplibre-gl';

export const calculateCentroid = (coords: [number, number][]): [number, number] => {
  let area = 0;
  let cx = 0;
  let cy = 0;
  const n = coords.length;

  for (let i = 0; i < n - 1; i++) {
    const x0 = coords[i][0];
    const y0 = coords[i][1];
    const x1 = coords[i + 1][0];
    const y1 = coords[i + 1][1];
    const a = x0 * y1 - x1 * y0;
    area += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }

  // Close the polygon (first and last point)
  const x0 = coords[n - 1][0];
  const y0 = coords[n - 1][1];
  const x1 = coords[0][0];
  const y1 = coords[0][1];
  const a = x0 * y1 - x1 * y0;
  area += a;
  cx += (x0 + x1) * a;
  cy += (y0 + y1) * a;

  area /= 2;
  if (area === 0) return coords[0]; // Fallback to first point if no area

  cx /= (6 * area);
  cy /= (6 * area);

  return [cx, cy];
}

export const getPopupCoordinates = (geometry: any): [number, number] => {
  const type = geometry.type;
  const coordinates = geometry.coordinates;

  switch (type) {
    case 'Point':
      // Point: [lng, lat]
      return coordinates as [number, number];

    case 'Polygon':
      // Polygon: [[lng, lat], [lng, lat], ...]
      return calculateCentroid(coordinates[0]);

    case 'MultiPolygon':
      // MultiPolygon: [[[lng, lat], [lng, lat], ...], ...]
      // Use the first polygon's coordinates for simplicity
      return calculateCentroid(coordinates[0][0]);

    default:
      console.warn(`Unsupported geometry type: ${type}`);
      return [0, 0]; // Fallback
  }
}

export const throttle = <T extends (...args: any[]) => void>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
