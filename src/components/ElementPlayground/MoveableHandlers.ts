import * as React from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { getContainerId, TempTransform, extractRotation } from "./types";
import { updateElementStyle, calculateFinalPosition } from "./transformUtils";

export function useMoveableHandlers() {
  const containers = useCanvasStore(state => state.containers);
  
  // Track temporary transformations during drag/resize/rotate operations
  const tempTransformsRef = React.useRef<Record<string, TempTransform>>({});
  
  // Track if we're actually dragging vs just clicking
  const isDraggingRef = React.useRef<Record<string, boolean>>({});
  
  // Get methods from store, wrapped in useCallback to maintain reference stability
  const updateContainer = React.useCallback(
    (id: string, updates: any) => {
      useCanvasStore.getState().updateContainer(id, updates);
    },
    []
  );
  
  // Save transform data during operations
  const saveTempTransform = React.useCallback((containerId: string, transform: string, width?: number, height?: number) => {
    const rotation = extractRotation(transform);
    tempTransformsRef.current[containerId] = { 
      transform, 
      width, 
      height,
      rotation
    };
  }, []);
  
  // Event handler for when drag starts
  const handleDragStart = React.useCallback((e: any) => {
    // Mark that we're starting a drag operation and store the initial position
    const target = e.target as HTMLElement;
    const containerId = getContainerId(target);
    
    if (!containerId) return;
    
    const container = containers[containerId];
    if (container) {
      isDraggingRef.current[containerId] = false; // Will be set to true on actual drag
      tempTransformsRef.current[containerId] = {
        ...tempTransformsRef.current[containerId] || {},
        initialPosition: {
          x: container.x,
          y: container.y
        },
        transform: ''
      };
    }
  }, [containers]);

  const handleDrag = React.useCallback((e: any) => {
    const target = e.target as HTMLElement;
    const containerId = getContainerId(target);
    
    if (!containerId) return;
    
    // Mark that we're actually dragging (not just a click)
    isDraggingRef.current[containerId] = true;
    
    // Update position in the UI only (no store update yet)
    updateElementStyle(target, { transform: e.transform });
    
    // Save temporary transform
    saveTempTransform(containerId, e.transform);
  }, [saveTempTransform]);

  const handleDragGroup = React.useCallback((e: any) => {
    // Update transform for each element in the group (no store update yet)
    e.events.forEach((ev: any) => {
      const target = ev.target as HTMLElement;
      const containerId = getContainerId(target);
      
      if (!containerId) return;
      
      // Mark that we're actually dragging
      isDraggingRef.current[containerId] = true;
      
      // Apply transformation to the target element
      updateElementStyle(target, { transform: ev.transform });
      
      // Save temporary transform
      saveTempTransform(containerId, ev.transform);
    });
  }, [saveTempTransform]);

  const handleResize = React.useCallback((e: any) => {
    const target = e.target as HTMLElement;
    const containerId = getContainerId(target);
    
    if (!containerId) return;
    
    const { width, height, drag } = e;
    
    // Update size in the UI only (no store update yet)
    updateElementStyle(target, {
      width: `${width}px`,
      height: `${height}px`,
      transform: drag.transform
    });
    
    // Save temporary transform
    saveTempTransform(containerId, drag.transform, width, height);
  }, [saveTempTransform]);

  const handleResizeGroup = React.useCallback((e: any) => {
    e.events.forEach((ev: any) => {
      const target = ev.target as HTMLElement;
      const containerId = getContainerId(target);
      
      if (!containerId) return;
      
      const { width, height, drag } = ev;
      
      // Update size in the UI only (no store update yet)
      updateElementStyle(target, {
        width: `${width}px`,
        height: `${height}px`,
        transform: drag.transform
      });
      
      // Save temporary transform
      saveTempTransform(containerId, drag.transform, width, height);
    });
  }, [saveTempTransform]);

  const handleRotate = React.useCallback((e: any) => {
    const target = e.target as HTMLElement;
    const containerId = getContainerId(target);
    
    if (!containerId) return;
    
    // Update rotation in the UI only (no store update yet)
    updateElementStyle(target, { transform: e.drag.transform });
    
    // Save temporary transform
    saveTempTransform(containerId, e.drag.transform);
  }, [saveTempTransform]);

  const handleRotateGroup = React.useCallback((e: any) => {
    e.events.forEach((ev: any) => {
      const target = ev.target as HTMLElement;
      const containerId = getContainerId(target);
      
      if (!containerId) return;
      
      // Update rotation in the UI only (no store update yet)
      updateElementStyle(target, { transform: ev.drag.transform });
      
      // Save temporary transform
      saveTempTransform(containerId, ev.drag.transform);
    });
  }, [saveTempTransform]);
   
  // Event handlers for when operations end - now we update the store
  const handleDragEnd = React.useCallback((e: any) => {
    const target = e.target as HTMLElement;
    const containerId = getContainerId(target);
    
    if (!containerId) return;
    
    // Only update position if there was an actual drag (not just a click)
    if (isDraggingRef.current[containerId]) {
      // Get the final position directly from the transform matrix and current position
      const finalPosition = calculateFinalPosition(target);
      
      // First update the visual position immediately to prevent flickering
      // Reset transform to avoid double-transformation
      target.style.transform = containers[containerId].rotation ? 
        `rotate(${containers[containerId].rotation}deg)` : '';
      target.style.left = `${finalPosition.x}px`;
      target.style.top = `${finalPosition.y}px`;
      
      // Then update the store with the final position
      updateContainer(containerId, { 
        x: finalPosition.x, 
        y: finalPosition.y 
      });
    } else {
      // It was just a click, reset the element to its original position
      const container = containers[containerId];
      if (container) {
        // Reset to stored position and rotation
        target.style.transform = container.rotation ? `rotate(${container.rotation}deg)` : '';
        target.style.left = `${container.x}px`;
        target.style.top = `${container.y}px`;
      }
    }
    
    // Clear tracking data
    delete tempTransformsRef.current[containerId];
    delete isDraggingRef.current[containerId];
  }, [containers, updateContainer]);
   
  const handleDragGroupEnd = React.useCallback((e: any) => {
    if (!e.targets) return;
    
    e.targets.forEach((target: HTMLElement) => {
      const containerId = getContainerId(target);
      
      if (!containerId) return;
      
      // Only update if there was actual dragging
      if (isDraggingRef.current[containerId]) {
        // Get the final position directly from the transform matrix and current position
        const finalPosition = calculateFinalPosition(target);
        
        // First update the visual position immediately to prevent flickering
        // Reset transform to avoid double-transformation
        target.style.transform = containers[containerId].rotation ? 
          `rotate(${containers[containerId].rotation}deg)` : '';
        target.style.left = `${finalPosition.x}px`;
        target.style.top = `${finalPosition.y}px`;
        
        // Then update the store with the final position
        updateContainer(containerId, { 
          x: finalPosition.x, 
          y: finalPosition.y 
        });
      } else {
        // Reset to original position if it was just a click
        const container = containers[containerId];
        if (container) {
          target.style.transform = container.rotation ? `rotate(${container.rotation}deg)` : '';
          target.style.left = `${container.x}px`;
          target.style.top = `${container.y}px`;
        }
      }
      
      // Clear tracking data
      delete tempTransformsRef.current[containerId];
      delete isDraggingRef.current[containerId];
    });
  }, [containers, updateContainer]);
   
  const handleResizeEnd = React.useCallback((e: any) => {
    const target = e.target as HTMLElement;
    const containerId = getContainerId(target);
    
    if (!containerId) return;
    
    const tempTransform = tempTransformsRef.current[containerId];
    
    if (!tempTransform) return;
    
    // Get the final position directly from the transform matrix and current position
    const finalPosition = calculateFinalPosition(target);
    
    // First update the visual position immediately to prevent flickering
    // Reset transform to avoid double-transformation while keeping rotation
    target.style.transform = containers[containerId].rotation ? 
      `rotate(${containers[containerId].rotation}deg)` : '';
    target.style.left = `${finalPosition.x}px`;
    target.style.top = `${finalPosition.y}px`;
    
    // Update container in store only when resize ends
    updateContainer(containerId, {
      width: tempTransform.width,
      height: tempTransform.height,
      x: finalPosition.x,
      y: finalPosition.y
    });
    
    // Clear temp transform
    delete tempTransformsRef.current[containerId];
  }, [containers, updateContainer]);
   
  const handleResizeGroupEnd = React.useCallback((e: any) => {
    if (!e.targets) return;
    
    e.targets.forEach((target: HTMLElement) => {
      const containerId = getContainerId(target);
      
      if (!containerId) return;
      
      const tempTransform = tempTransformsRef.current[containerId];
      
      if (!tempTransform) return;
      
      // Get the final position directly from the transform matrix and current position
      const finalPosition = calculateFinalPosition(target);
      
      // First update the visual position immediately to prevent flickering
      // Reset transform to avoid double-transformation while keeping rotation
      target.style.transform = containers[containerId].rotation ? 
        `rotate(${containers[containerId].rotation}deg)` : '';
      target.style.left = `${finalPosition.x}px`;
      target.style.top = `${finalPosition.y}px`;
      
      // Update container in store only when resize ends
      updateContainer(containerId, {
        width: tempTransform.width,
        height: tempTransform.height,
        x: finalPosition.x,
        y: finalPosition.y
      });
      
      // Clear temp transform
      delete tempTransformsRef.current[containerId];
    });
  }, [containers, updateContainer]);
   
  const handleRotateEnd = React.useCallback((e: any) => {
    const target = e.target as HTMLElement;
    const containerId = getContainerId(target);
    
    if (!containerId) return;
    
    const tempTransform = tempTransformsRef.current[containerId];
    
    if (!tempTransform) return;
    
    // Get the final position directly from the transform matrix and current position
    const finalPosition = calculateFinalPosition(target);
    
    // Apply rotation directly
    target.style.transform = tempTransform.rotation ? 
      `rotate(${tempTransform.rotation}deg)` : '';
    target.style.left = `${finalPosition.x}px`;
    target.style.top = `${finalPosition.y}px`;
    
    // Update container in store only when rotation ends
    updateContainer(containerId, {
      rotation: tempTransform.rotation,
      x: finalPosition.x,
      y: finalPosition.y
    });
    
    // Clear temp transform
    delete tempTransformsRef.current[containerId];
  }, [containers, updateContainer]);
   
  const handleRotateGroupEnd = React.useCallback((e: any) => {
    if (!e.targets) return;
    
    e.targets.forEach((target: HTMLElement) => {
      const containerId = getContainerId(target);
      
      if (!containerId) return;
      
      const tempTransform = tempTransformsRef.current[containerId];
      
      if (!tempTransform) return;
      
      // Get the final position directly from the transform matrix and current position
      const finalPosition = calculateFinalPosition(target);
      
      // Apply rotation directly
      target.style.transform = tempTransform.rotation ? 
        `rotate(${tempTransform.rotation}deg)` : '';
      target.style.left = `${finalPosition.x}px`;
      target.style.top = `${finalPosition.y}px`;
      
      // Update container in store only when rotation ends
      updateContainer(containerId, {
        rotation: tempTransform.rotation,
        x: finalPosition.x,
        y: finalPosition.y
      });
      
      // Clear temp transform
      delete tempTransformsRef.current[containerId];
    });
  }, [containers, updateContainer]);
  
  const handleClick = React.useCallback((e: any) => {
    if (e.isDouble) {
      const inputTarget = e.inputEvent.target as HTMLElement;
      // Note: selectoRef is passed from parent component
      return { isDouble: true, target: inputTarget };
    }
    return null;
  }, []);
  
  return {
    handleDragStart,
    handleDrag,
    handleDragGroup,
    handleDragEnd,
    handleDragGroupEnd,
    handleResize,
    handleResizeGroup,
    handleResizeEnd,
    handleResizeGroupEnd,
    handleRotate,
    handleRotateGroup,
    handleRotateEnd,
    handleRotateGroupEnd,
    handleClick
  };
} 