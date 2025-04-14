import { getContainerId } from './types';

// Update element during drag/resize operations (without updating store)
export const updateElementStyle = (target: HTMLElement, styleUpdates: {
  transform?: string, 
  width?: string, 
  height?: string
}) => {
  if (styleUpdates.transform) {
    target.style.transform = styleUpdates.transform;
  }
  if (styleUpdates.width) {
    target.style.width = styleUpdates.width;
  }
  if (styleUpdates.height) {
    target.style.height = styleUpdates.height;
  }
};

// Calculate final position from transform matrix
export const calculateFinalPosition = (target: HTMLElement | SVGElement): {x: number, y: number} => {
  // Get the computed transform matrix
  const style = window.getComputedStyle(target);
  const matrix = new DOMMatrix(style.transform);
  
  // Get the current left/top values from style or attribute
  let currentLeft = 0;
  let currentTop = 0;
  
  if (target instanceof HTMLElement) {
    currentLeft = parseInt(target.style.left) || 0;
    currentTop = parseInt(target.style.top) || 0;
  }
  
  // Calculate the new position by adding the translation from the matrix
  return {
    x: currentLeft + matrix.m41,
    y: currentTop + matrix.m42
  };
}; 