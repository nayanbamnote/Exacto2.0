// Define interface for temporary transform data
export interface TempTransform {
  transform: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  rotation?: number;
  // For click vs drag detection
  initialPosition?: {
    x: number;
    y: number;
  };
}

// Utility functions for working with transforms

// Extract rotation angle from transform string
export const extractRotation = (transform: string): number => {
  const rotationMatch = transform.match(/rotate\(([^)]+)deg\)/);
  return rotationMatch ? parseFloat(rotationMatch[1]) : 0;
};

// Extract container ID from element
export const getContainerId = (element: HTMLElement | SVGElement): string | null => {
  return element.getAttribute('data-container-id');
}; 