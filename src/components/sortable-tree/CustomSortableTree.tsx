import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import { CustomSortableTreeItem } from './CustomTreeItem';

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

interface CustomSortableTreeProps {
  collapsible?: boolean;
  defaultItems: TreeItems;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
  className?: string;
}

export function CustomSortableTree({
  collapsible,
  defaultItems,
  indicator = false,
  indentationWidth = 20,
  removable,
  className,
}: CustomSortableTreeProps) {
  const [items, setItems] = useState(() => defaultItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

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

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (active && over && active.id !== over.id) {
      const activeItemIndex = flattenedItems.findIndex(({ id }) => id === active.id);
      const overItemIndex = flattenedItems.findIndex(({ id }) => id === over.id);
      
      const activeItem = flattenedItems[activeItemIndex];
      const overItem = flattenedItems[overItemIndex];

      const newItems = buildTree(
        arrayMove(flattenedItems, activeItemIndex, overItemIndex)
      );

      setItems(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);
  }

  function handleRemove(id: UniqueIdentifier) {
    setItems((items) => removeItem(items, id));
  }

  function handleCollapse(id: UniqueIdentifier) {
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => !value)
    );
  }

  return (
    <div className={className}>
      <DndContext
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
          <ul className="p-0 m-0 list-none">
            {flattenedItems.map(({ id, children, collapsed, depth }) => (
              <CustomSortableTreeItem
                key={id}
                id={id}
                depth={depth}
                indentationWidth={indentationWidth}
                indicator={indicator}
                collapsed={Boolean(collapsed && children.length)}
                onCollapse={
                  collapsible && children.length
                    ? () => handleCollapse(id)
                    : undefined
                }
                onRemove={removable ? () => handleRemove(id) : undefined}
              />
            ))}
          </ul>
        </SortableContext>
        {typeof document !== 'undefined' &&
          createPortal(
            <DragOverlay
              dropAnimation={dropAnimationConfig}
            >
              {activeId && activeItem ? (
                <CustomSortableTreeItem
                  id={activeId}
                  depth={activeItem.depth}
                  clone
                  childCount={getChildCount(items, activeId) + 1}
                  indentationWidth={indentationWidth}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
} 