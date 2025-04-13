import React, { forwardRef, HTMLAttributes, CSSProperties } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trash2, GripVertical } from 'lucide-react';

import { iOS } from './utilities';

export interface TreeItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <li
        className={cn(
          'relative box-border',
          clone && 'z-10 opacity-70',
          ghost && 'opacity-50',
          indicator && 'drop-indicator',
          disableSelection && 'select-none',
          disableInteraction && 'pointer-events-none'
        )}
        ref={wrapperRef}
        style={{
          paddingLeft: `${indentationWidth * depth}px`,
          ...style as React.CSSProperties
        }}
        {...props}
      >
        <div 
          ref={ref} 
          className={cn(
            'flex items-center gap-2 p-2 border bg-card rounded-md shadow-sm',
            ghost && 'opacity-50'
          )}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 shrink-0" 
            {...handleProps}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          
          {onCollapse && (
            <Button
              onClick={onCollapse}
              variant="ghost"
              size="icon"
              className={cn(
                'h-6 w-6 shrink-0 transition-transform',
                collapsed ? 'rotate-0' : 'rotate-90'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          
          <span className="flex-1 text-sm font-medium">{value}</span>
          
          {!clone && onRemove && (
            <Button 
              onClick={onRemove} 
              variant="ghost" 
              size="icon"
              className="h-6 w-6 shrink-0 text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          {clone && childCount && childCount > 1 ? (
            <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium">
              {childCount}
            </span>
          ) : null}
        </div>
      </li>
    );
  }
);

TreeItem.displayName = 'TreeItem';

interface SortableTreeItemProps extends TreeItemProps {
  id: UniqueIdentifier;
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;

export function SortableTreeItem({ id, depth, ...props }: SortableTreeItemProps) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });
  
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={iOS}
      disableInteraction={isSorting}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
} 