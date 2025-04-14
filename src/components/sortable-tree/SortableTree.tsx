import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Announcements,
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  DropAnimation,
  Modifier,
  defaultDropAnimation,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  buildTree,
  flattenTree,
  getProjection,
  getChildCount,
  removeItem,
  removeChildrenOf,
  setProperty,
} from './utilities';
import type { FlattenedItem, SensorContext, TreeItems } from './types';
import { sortableTreeKeyboardCoordinates } from './keyboardCoordinates';
import { SortableTreeItem } from './TreeItem';

const initialItems: TreeItems = [
  {
    id: 'Home',
    displayName: 'Home',
    children: [],
  },
  {
    id: 'Collections',
    displayName: 'Collections',
    children: [
      { id: 'Spring', displayName: 'Spring', children: [] },
      { id: 'Summer', displayName: 'Summer', children: [] },
      { id: 'Fall', displayName: 'Fall', children: [] },
      { id: 'Winter', displayName: 'Winter', children: [] },
    ],
  },
  {
    id: 'About Us',
    displayName: 'About Us',
    children: [],
  },
  {
    id: 'My Account',
    displayName: 'My Account',
    children: [
      { id: 'Addresses', displayName: 'Addresses', children: [] },
      { id: 'Order History', displayName: 'Order History', children: [] },
    ],
  },
];

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

interface SortableTreeProps {
  collapsible?: boolean;
  defaultItems?: TreeItems;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
  className?: string;
  onItemsChange?: (items: TreeItems) => void;
  onRemove?: (id: string) => void;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
}

// Simple helper function to compare tree arrays by their IDs and structure
function areTreeItemsEqual(a: TreeItems, b: TreeItems): boolean {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const itemB = b[i];
    
    if (String(itemA.id) !== String(itemB.id)) return false;
    if (!areTreeItemsEqual(itemA.children, itemB.children)) return false;
  }
  
  return true;
}

export function SortableTree({
  collapsible,
  defaultItems = initialItems,
  indicator = false,
  indentationWidth = 20,
  removable,
  className,
  onItemsChange,
  onRemove,
  onSelect,
  selectedId,
}: SortableTreeProps) {
  const [items, setItems] = useState(() => defaultItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null;
    overId: UniqueIdentifier;
  } | null>(null);
  
  // Add a reference to track if items were updated internally
  const itemsUpdatedInternally = useRef(false);
  const prevDefaultItemsRef = useRef<TreeItems>(defaultItems);

  // Update items when default items change
  useEffect(() => {
    if (!areTreeItemsEqual(prevDefaultItemsRef.current, defaultItems)) {
      setItems(defaultItems);
      prevDefaultItemsRef.current = defaultItems;
      itemsUpdatedInternally.current = false;
    }
  }, [defaultItems]);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id as string] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId != null ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);
  
  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth
        )
      : null;
  
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });
  
  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth)
  );
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
  
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  // Notify parent component when items change, but only if the change
  // was triggered internally (not from a defaultItems prop change)
  useEffect(() => {
    if (onItemsChange && itemsUpdatedInternally.current) {
      onItemsChange(items);
      itemsUpdatedInternally.current = false;
    }
  }, [items, onItemsChange]);

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement('onDragMove', active.id, over?.id);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement('onDragOver', active.id, over?.id);
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement('onDragEnd', active.id, over?.id);
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  return (
    <div className={className}>
      <DndContext
        accessibility={{ announcements }}
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
          <ul
            className="flex min-h-full flex-col gap-1"
            style={{
              maxWidth: '100%',
            }}
          >
            {flattenedItems.map(({ id, children, collapsed, depth }) => (
              <SortableTreeItem
                key={id}
                id={id}
                value={String(id)}
                displayName={
                  items
                    .flatMap(item => [item, ...(item.children || [])])
                    .find(item => item.id === id)?.displayName
                }
                depth={
                  id === activeId && projected
                    ? projected.depth
                    : depth
                }
                indentationWidth={indentationWidth}
                indicator={indicator}
                collapsed={Boolean(collapsed && children.length)}
                onCollapse={
                  collapsible && children.length
                    ? () => handleCollapse(id)
                    : undefined
                }
                onRemove={
                  removable
                    ? () => handleRemove(id)
                    : undefined
                }
                onSelect={() => handleSelect(id)}
                isSelected={selectedId === String(id)}
              />
            ))}
          </ul>
        </SortableContext>
        {typeof document !== 'undefined' &&
          createPortal(
            <DragOverlay
              dropAnimation={dropAnimationConfig}
              modifiers={indicator ? [adjustTranslate] : undefined}
            >
              {activeId && activeItem ? (
                <SortableTreeItem
                  id={activeId}
                  depth={activeItem.depth}
                  clone
                  childCount={getChildCount(items, activeId) + 1}
                  value={String(activeId)}
                  displayName={activeItem.displayName}
                  indentationWidth={indentationWidth}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      });
    }

    document.body.style.setProperty('cursor', 'grabbing');
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      // Mark that we're updating items internally before setting state
      itemsUpdatedInternally.current = true;
      setItems(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty('cursor', '');
  }

  function handleRemove(id: UniqueIdentifier) {
    if (onRemove) {
      onRemove(String(id));
    }
    
    const newItems = removeItem(items, id);
    
    setItems(newItems);
    itemsUpdatedInternally.current = true;
  }

  function handleSelect(id: UniqueIdentifier) {
    if (onSelect) {
      onSelect(String(id));
    }
  }

  function handleCollapse(id: UniqueIdentifier) {
    itemsUpdatedInternally.current = true;
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => {
        return !value;
      })
    );
  }

  function getMovementAnnouncement(
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier
  ) {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved';
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested';

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
}; 