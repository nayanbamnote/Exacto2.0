import * as React from "react";
import { useCanvasStore } from "@/stores/canvasStore";

interface ContainerRendererProps {
  containerId: string;
  depth?: number;
}

export const ContainerRenderer: React.FC<ContainerRendererProps> = ({ 
  containerId, 
  depth = 0 
}) => {
  // Get containers with a stable reference to prevent re-renders
  const containers = useCanvasStore(state => state.containers);
  const container = containers[containerId];
  
  if (!container) {
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
        transform: container.rotation ? `rotate(${container.rotation}deg)` : undefined,
        touchAction: "none",
      }}
    >
      {container.id}
      {container.children && container.children.length > 0 && (
        <>
          <div className="text-xs absolute bottom-1 right-1">
            {container.children.length} children
          </div>
          {container.children.map((childId) => (
            <ContainerRenderer key={childId} containerId={childId} depth={depth + 1} />
          ))}
        </>
      )}
    </div>
  );
}; 