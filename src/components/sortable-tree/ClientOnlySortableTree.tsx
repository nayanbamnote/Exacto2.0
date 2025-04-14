"use client";

import { useState, useEffect } from 'react';
import { SortableTree } from './SortableTree';
import { TreeItems } from './types';
import { UniqueIdentifier } from '@dnd-kit/core';

interface ClientOnlySortableTreeProps {
  collapsible?: boolean;
  defaultItems?: any[];
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
  className?: string;
  onItemsChange?: (items: TreeItems) => void;
  onRemove?: (id: string) => void;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
}

export function ClientOnlySortableTree(props: ClientOnlySortableTreeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a placeholder with the same dimensions during SSR
    return <div className={props.className} style={{ minHeight: '100px' }}></div>;
  }

  return <SortableTree {...props} />;
}