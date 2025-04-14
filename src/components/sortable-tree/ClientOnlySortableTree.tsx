"use client";

import { useState, useEffect, useMemo } from 'react';
import { SortableTree } from './SortableTree';
import { CustomSortableTree } from './CustomSortableTree';
import type { TreeItems } from './types';
import { useCanvasStore } from '@/stores/canvasStore';

interface ClientOnlySortableTreeProps {
  collapsible?: boolean;
  defaultItems?: TreeItems;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
  className?: string;
  useContainers?: boolean;
}

export function ClientOnlySortableTree(props: ClientOnlySortableTreeProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Get containers from the store with a stable reference
  const containers = useCanvasStore(state => state.containers);

  // Convert container data to TreeItems format - this returns the actual tree items
  const treeItems = useMemo(() => {
    if (!props.useContainers) {
      return props.defaultItems || [];
    }
    
    // Create a map of all containers
    const containerMap = new Map();
    
    // Initialize all containers as TreeItems
    Object.values(containers).forEach(container => {
      containerMap.set(container.id, {
        id: container.id,
        children: [],
        collapsed: false
      });
    });
    
    // Then populate children
    Object.values(containers).forEach(container => {
      if (container.children.length > 0) {
        const parentItem = containerMap.get(container.id);
        if (parentItem) {  // Add null check
          container.children.forEach(childId => {
            if (containerMap.has(childId)) {
              parentItem.children.push(containerMap.get(childId));
            }
          });
        }
      }
    });
    
    // Return only root containers (those with no parent)
    return Object.values(containers)
      .filter(container => container.parentId === null)
      .map(container => containerMap.get(container.id))
      .filter(Boolean); // Filter out any undefined values
  }, [containers, props.useContainers, props.defaultItems]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a placeholder with the same dimensions during SSR
    return <div className={props.className} style={{ minHeight: '100px' }}></div>;
  }

  // Create a new props object without useContainers to avoid passing it to SortableTree
  const { useContainers, defaultItems, ...otherProps } = props;

  // Use CustomSortableTree for containers, or regular SortableTree for non-container data
  if (useContainers) {
    return <CustomSortableTree {...otherProps} defaultItems={treeItems} />;
  } else {
    return <SortableTree {...otherProps} defaultItems={treeItems} />;
  }
} 