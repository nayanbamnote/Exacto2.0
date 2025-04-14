import { TreeItems } from './types';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useCanvasStore, Container } from '@/stores/canvasStore';

/**
 * Converts canvas store containers to a TreeItems structure for SortableTree
 */
export function containersToTreeItems(containers: Record<string, Container>): TreeItems {
  // If no containers, return empty array
  if (!containers || Object.keys(containers).length === 0) {
    return [];
  }
  
  // First, create a map of all tree items
  const treeItems: Record<string, any> = {};
  
  // Initialize tree items with empty children arrays
  Object.values(containers).forEach(container => {
    treeItems[container.id] = {
      id: container.id,
      children: [],
      displayName: `Container ${container.id.substring(0, 6)}`, // Add a user-friendly name
      // You can add more fields here as needed, such as:
      // color: container.styles.backgroundColor,
      // or other container properties
    };
  });
  
  // Second pass to build the parent-child relationships
  Object.values(containers).forEach(container => {
    // Add this container as a child to its parent
    if (container.parentId && treeItems[container.parentId]) {
      treeItems[container.parentId].children.push(treeItems[container.id]);
    }
  });
  
  // Filter out all items that have parents (to get root items only)
  const rootItems = Object.values(treeItems).filter(item => {
    const container = containers[item.id];
    return !container.parentId;
  });
  
  return rootItems;
}

/**
 * Updates container relationships based on tree items structure
 */
export function updateContainersFromTree(
  treeItems: TreeItems, 
  updateContainer: (id: string, updates: Partial<Container>) => void
) {
  // Skip if no items to update
  if (!treeItems || treeItems.length === 0) {
    return;
  }
  
  // Get the current state of containers to calculate position adjustments
  const currentContainers = useCanvasStore.getState().containers;
  
  // Create a map to efficiently track what we've already processed
  const processedItems = new Set<string>();
  
  // Helper function to get absolute position of a container
  function getAbsolutePosition(containerId: string): { x: number, y: number } {
    const container = currentContainers[containerId];
    if (!container) return { x: 0, y: 0 };
    
    if (!container.parentId) {
      // If no parent, the position is already absolute
      return { x: container.x, y: container.y };
    }
    
    // If has parent, calculate absolute position by adding parent's absolute position
    const parentPos = getAbsolutePosition(container.parentId);
    return {
      x: container.x + parentPos.x,
      y: container.y + parentPos.y
    };
  }
  
  function updateRelationships(items: TreeItems, parentId: string | null = null) {
    items.forEach((item) => {
      const itemId = String(item.id);
      
      // Skip if already processed to avoid duplicate updates
      if (processedItems.has(itemId)) {
        return;
      }
      
      // Mark this item as processed
      processedItems.add(itemId);
      
      const container = currentContainers[itemId];
      if (!container) return;
      
      // Calculate the container's current absolute position
      const absolutePosition = getAbsolutePosition(itemId);
      
      // Calculate new relative position based on the new parent
      let adjustedX = absolutePosition.x;
      let adjustedY = absolutePosition.y;
      
      // If this container will have a parent, adjust coordinates to be relative to parent
      if (parentId) {
        const newParentAbsPos = getAbsolutePosition(parentId);
        adjustedX = absolutePosition.x - newParentAbsPos.x;
        adjustedY = absolutePosition.y - newParentAbsPos.y;
      }
      
      // Update the parent ID, children array, and adjusted coordinates
      updateContainer(itemId, {
        parentId: parentId,
        children: item.children.map(child => String(child.id)),
        x: adjustedX,
        y: adjustedY
      });
      
      // Recursively update children
      if (item.children.length > 0) {
        updateRelationships(item.children, itemId);
      }
    });
  }
  
  updateRelationships(treeItems);
} 