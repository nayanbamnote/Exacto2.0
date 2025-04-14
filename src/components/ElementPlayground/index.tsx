"use client";

import * as React from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import { diff } from "@egjs/children-differ";
import { useCanvasStore } from "@/stores/canvasStore";
import { useCanvasStore as useDeviceSectionStore } from "@/stores/devicesectionStore";
import { useUIStore } from "@/stores/uiStore";
import { ContainerRenderer } from "./ContainerRenderer";
import { useMoveableHandlers } from "./MoveableHandlers";
import { handleNestedSelection } from "./SelectionUtils";
import { getContainerId } from "./types";

export function ElementPlayground() {
  const [targets, setTargets] = React.useState<Array<SVGElement | HTMLElement>>([]);
  const moveableRef = React.useRef<Moveable>(null);
  const selectoRef = React.useRef<Selecto>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  
  // Get device section store values using stable selectors
  const canvasWidth = useDeviceSectionStore(state => state.canvasWidth);
  const canvasHeight = useDeviceSectionStore(state => state.canvasHeight);
  const zoomLevel = useDeviceSectionStore(state => state.zoomLevel);
  const selectedDevice = useDeviceSectionStore(state => state.selectedDevice);
  
  // Get containers with a stable reference to prevent re-renders
  const containers = useCanvasStore(state => state.containers);
  
  // Get the UI store for container selection
  const { selectedContainerId, selectContainer } = useUIStore();
  
  // Get root containers once and memoize the result
  const topLevelContainers = React.useMemo(() => {
    return useCanvasStore.getState().getRootContainers();
  }, [containers]); // Only recalculate when containers change
  
  // Calculate container dimensions based on zoomLevel
  const scaledWidth = canvasWidth * zoomLevel;
  const scaledHeight = canvasHeight * zoomLevel;
  
  // Get all the event handlers from the custom hook
  const handlers = useMoveableHandlers();

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

  // Sync targets when selectedContainerId changes
  React.useEffect(() => {
    if (selectedContainerId && selectoRef.current) {
      // Find the DOM element corresponding to the selected container
      const containerElement = document.querySelector(`[data-container-id="${selectedContainerId}"]`) as HTMLElement;
      if (containerElement) {
        const newTargets = [containerElement];
        // Update Selecto's selection
        selectoRef.current.setSelectedTargets(newTargets);
        // Update our local targets state
        setTargets(newTargets);
      }
    } else if (!selectedContainerId) {
      // If nothing is selected, clear the targets
      if (selectoRef.current) {
        selectoRef.current.setSelectedTargets([]);
      }
      setTargets([]);
    }
  }, [selectedContainerId]);

  const handleClick = React.useCallback((e: any) => {
    const result = handlers.handleClick(e);
    if (result?.isDouble) {
      const selectableElements = selectoRef.current!.getSelectableElements();
      if (selectableElements.includes(result.target)) {
        // Get the container ID from the target element
        const containerId = getContainerId(result.target);
        if (containerId) {
          // Use the UI store to select the container
          selectContainer(containerId);
        }
      }
    }
  }, [handlers, selectContainer]);

  return (
    <div 
      id="window" 
      ref={canvasRef}
      className="relative bg-neutral-200 w-full h-full pt-20 px-6 pb-6 flex items-center justify-center"
    >
      <div className="device-frame bg-white relative overflow-hidden max-w-full max-h-full border border-dashed border-gray-300 rounded-md"
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
          snappable={true}
          snapThreshold={5}
          elementGuidelines={[".device-frame"]}
          onClickGroup={e => {
            // Propagate click events from groups to selecto
            selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
          }}
          onDragStart={handlers.handleDragStart}
          onDrag={handlers.handleDrag}
          onDragGroup={handlers.handleDragGroup}
          onDragEnd={handlers.handleDragEnd}
          onDragGroupEnd={handlers.handleDragGroupEnd}
          onResize={handlers.handleResize}
          onResizeGroup={handlers.handleResizeGroup}
          onResizeEnd={handlers.handleResizeEnd}
          onResizeGroupEnd={handlers.handleResizeGroupEnd}
          onRotate={handlers.handleRotate}
          onRotateGroup={handlers.handleRotateGroup}
          onRotateEnd={handlers.handleRotateEnd}
          onRotateGroupEnd={handlers.handleRotateGroupEnd}
          onClick={handleClick}
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
            
            // Update local targets state
            setTargets(selected);
            
            // Update the UI store with the selected container ID
            if (selected.length === 1) {
              const containerId = getContainerId(selected[0]);
              if (containerId) {
                selectContainer(containerId);
              }
            } else if (selected.length === 0) {
              // If nothing is selected, clear the UI store selection
              selectContainer(null);
            }
          }}
        />
        <div className="elements selecto-area relative" style={{ transformOrigin: 'top left' }}>
          {topLevelContainers.map(container => (
            <ContainerRenderer key={container.id} containerId={container.id} />
          ))}
        </div>
        
        <div className="absolute bottom-2 right-2 text-sm text-gray-500 bg-white/50 px-2 py-1 rounded">
          {selectedDevice} • {canvasWidth}×{canvasHeight} • {Math.round(zoomLevel * 100)}%
        </div>
      </div>
    </div>
  );
} 