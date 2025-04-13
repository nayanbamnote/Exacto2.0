import React from 'react';
import { SortableTreeItem } from './TreeItem';
import { UniqueIdentifier } from '@dnd-kit/core';
import { dummyContainers } from '../../data/dummyCanvasData';

interface CustomSortableTreeItemProps {
  id: UniqueIdentifier;
  depth: number;
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  indicator?: boolean;
  indentationWidth: number;
  onCollapse?(): void;
  onRemove?(): void;
}

export function CustomSortableTreeItem({ 
  id, 
  ...props 
}: CustomSortableTreeItemProps) {
  // Format the value string - just use the ID directly
  const value = id.toString();
  
  return (
    <SortableTreeItem
      id={id}
      value={value}
      {...props}
    />
  );
} 