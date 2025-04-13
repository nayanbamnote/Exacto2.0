"use client";

import { useState, useEffect } from 'react';
import { SortableTree } from './SortableTree';
import { CustomSortableTree } from './CustomSortableTree';
import type { TreeItems } from './types';
import { dummyContainers } from '../../data/dummyCanvasData';

interface ClientOnlySortableTreeProps {
  collapsible?: boolean;
  defaultItems?: TreeItems;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
  className?: string;
  useContainers?: boolean;
}

// Convert container data to TreeItems format
const convertContainersToTreeItems = (): TreeItems => {
  // First create a map of all containers
  const containerMap = new Map();
  
  // Initialize all containers as TreeItems
  Object.values(dummyContainers).forEach(container => {
    containerMap.set(container.id, {
      id: container.id,
      children: [],
      collapsed: false
    });
  });
  
  // Then populate children
  Object.values(dummyContainers).forEach(container => {
    if (container.children.length > 0) {
      const parentItem = containerMap.get(container.id);
      container.children.forEach(childId => {
        if (containerMap.has(childId)) {
          parentItem.children.push(containerMap.get(childId));
        }
      });
    }
  });
  
  // Return only root containers (those with no parent)
  return Object.values(dummyContainers)
    .filter(container => container.parentId === null)
    .map(container => containerMap.get(container.id));
};

export function ClientOnlySortableTree(props: ClientOnlySortableTreeProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [treeItems, setTreeItems] = useState<TreeItems>([]);

  useEffect(() => {
    setIsMounted(true);
    
    // If useContainers is true, use container data, otherwise use props.defaultItems
    if (props.useContainers) {
      setTreeItems(convertContainersToTreeItems());
    } else if (props.defaultItems) {
      setTreeItems(props.defaultItems);
    }
  }, [props.useContainers, props.defaultItems]);

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