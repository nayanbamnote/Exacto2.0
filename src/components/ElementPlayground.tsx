"use client";

import * as React from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import { diff } from "@egjs/children-differ";
import { dummyContainers } from "../data/dummyCanvasData";
import { useCanvasStore } from "@/stores/devicesectionStore";

export function ElementPlayground() {
  const [targets, setTargets] = React.useState<Array<SVGElement | HTMLElement>>([]);
  const moveableRef = React.useRef<Moveable>(null);
  const selectoRef = React.useRef<Selecto>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  
  // Get store values
  const { canvasWidth, canvasHeight, zoomLevel, selectedDevice } = useCanvasStore();
  
  // Calculate container dimensions based on zoomLevel
  const scaledWidth = canvasWidth * zoomLevel;
  const scaledHeight = canvasHeight * zoomLevel;
  
  // Get top-level containers (those with no parent)
  const topLevelContainers = Object.values(dummyContainers).filter(
    container => container.parentId === null
  );

  // Apply canvas dimensions and zoom
  React.useEffect(() => {
    if (canvasRef.current) {
      const elementsContainer = canvasRef.current.querySelector('.elements') as HTMLElement;
      if (elementsContainer) {
        // Apply zoom using transform scale
        elementsContainer.style.transform = `scale(${zoomLevel})`;
        elementsContainer.style.transformOrigin = 'top left';
        elementsContainer.style.width = `${canvasWidth}px`;
        elementsContainer.style.height = `${canvasHeight}px`;
      }
    }
  }, [canvasWidth, canvasHeight, zoomLevel]);

  // Recursive function to render nested containers
  const renderContainer = (containerId: string, depth = 0) => {
    const container = dummyContainers[containerId];
    
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return null;
    }
    
    return (
      <div
        className="container absolute flex items-center justify-center border font-medium"
        key={container.id}
        data-container-id={container.id}
        data-depth={depth}
        style={{
          width: `${container.width}px`,
          height: `${container.height}px`,
          left: `${container.x}px`,
          top: `${container.y}px`,
          backgroundColor: container.styles?.backgroundColor || '#ffffff',
          border: container.styles?.border || '1px solid #ccc',
          zIndex: container.styles?.zIndex || 1,
          touchAction: "none",
        }}
      >
        {container.id}
        {container.children && container.children.length > 0 && (
          <>
            <div className="text-xs absolute bottom-1 right-1">
              {container.children.length} children
            </div>
            {container.children.map((childId) => renderContainer(childId, depth + 1))}
          </>
        )}
      </div>
    );
  };

  // Handle selecting nested elements
  const handleNestedSelection = (selected: Array<HTMLElement | SVGElement>) => {
    // Option 1: Keep only top-level elements (current behavior)
    // if (false) { // Set to true to enable this option
      return selected.filter(target => 
        selected.every(target2 => target === target2 || !target2.contains(target))
      );
    // }
    
    // Option 2: Keep all selected elements, both parent and children
    // return selected;
  };

  return (
    <div 
      id="window" 
      ref={canvasRef}
      className="relative bg-neutral-200 w-full h-full pt-20 px-6 pb-6 flex items-center justify-center"
    >
      <div className="device-frame bg-white relative overflow-hidden max-w-full max-h-full border border-dashed border-gray-300 rounded-md p-4"
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transition: "width 0.3s, height 0.3s",
        }}
      >
        <Moveable
          ref={moveableRef}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={false}
          renderDirections={["n", "e", "s", "w", "ne", "nw", "se", "sw"]}
          edge={false}
          target={targets}
          onClickGroup={e => {
            // Propagate click events from groups to selecto
            selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
          }}
          onDrag={e => {
            // Update individual element transform
            e.target.style.transform = e.transform;
          }}
          onDragGroup={e => {
            // Update transform for each element in the group
            e.events.forEach(ev => {
              // Apply transformation to the target element
              ev.target.style.transform = ev.transform;
            });
          }}
          onResize={e => {
            const { width, height, drag } = e;
            e.target.style.width = `${width}px`;
            e.target.style.height = `${height}px`;
            e.target.style.transform = drag.transform;
          }}
          onResizeGroup={e => {
            e.events.forEach(ev => {
              const { width, height, drag } = ev;
              ev.target.style.width = `${width}px`;
              ev.target.style.height = `${height}px`;
              ev.target.style.transform = drag.transform;
            });
          }}
          onRotate={e => {
            e.target.style.transform = e.drag.transform;
          }}
          onRotateGroup={e => {
            e.events.forEach(ev => {
              ev.target.style.transform = ev.drag.transform;
            });
          }}
          onClick={e => {
            if (e.isDouble) {
              const inputTarget = e.inputEvent.target as HTMLElement;
              const selectableElements = selectoRef.current!.getSelectableElements();

              if (selectableElements.includes(inputTarget)) {
                // Set the double-clicked element as the sole moveable target
                selectoRef.current!.setSelectedTargets([inputTarget]);
                setTargets([inputTarget]);
              }
            }
          }}
        />
        <Selecto
          ref={selectoRef}
          dragContainer={".elements"}
          selectableTargets={[".elements .container"]}
          hitRate={0}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={["shift"]}
          ratio={0}
          onDragStart={e => {
            const moveable = moveableRef.current!;
            const target = e.inputEvent.target;
            if (
              moveable.isMoveableElement(target) ||
              targets.some(t => t === target || t.contains(target))
            ) {
              e.stop();
            }
          }}
          onSelectEnd={e => {
            const moveable = moveableRef.current!;
            let selected = e.selected;

            // Handle nested selections
            selected = handleNestedSelection(selected);

            const result = diff(e.startSelected, selected);

            e.currentTarget.setSelectedTargets(selected);

            if (!result.added.length && !result.removed.length) {
              return;
            }
            if (e.isDragStartEnd) {
              e.inputEvent.preventDefault();
              moveable.waitToChangeTarget().then(() => {
                moveable.dragStart(e.inputEvent);
              });
            }
            setTargets(selected);
          }}
        />
        <div className="elements selecto-area relative" style={{ transformOrigin: 'top left' }}>
          {topLevelContainers.map(container => renderContainer(container.id))}
        </div>
        
        <div className="absolute bottom-2 right-2 text-sm text-gray-500 bg-white/50 px-2 py-1 rounded">
          {selectedDevice} • {canvasWidth}×{canvasHeight} • {Math.round(zoomLevel * 100)}%
        </div>
      </div>
    </div>
  );
} 