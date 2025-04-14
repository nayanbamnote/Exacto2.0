import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUIStore } from "@/stores/uiStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { useEffect, useState } from "react";

export function DimensionsControl() {
  const selectedContainerId = useUIStore(state => state.selectedContainerId);
  const containers = useCanvasStore(state => state.containers);
  const updateContainer = useCanvasStore(state => state.updateContainer);

  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("auto");

  // Update dimensions when selection changes
  useEffect(() => {
    if (selectedContainerId && containers[selectedContainerId]) {
      const container = containers[selectedContainerId];
      setWidth(container.width.toString());
      setHeight(container.height.toString());
    }
  }, [selectedContainerId, containers]);

  const handleDimensionChange = (dimension: "width" | "height", value: string) => {
    if (!selectedContainerId) return;

    // Update local state
    if (dimension === "width") {
      setWidth(value);
    } else {
      setHeight(value);
    }

    // Convert value to number if possible
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      // Update the container in the store
      updateContainer(selectedContainerId, {
        [dimension]: numericValue
      });

      // Find and update the DOM element
      const element = document.querySelector(`[data-container-id="${selectedContainerId}"]`) as HTMLElement;
      if (element) {
        element.style[dimension] = `${numericValue}px`;
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Label htmlFor="width" className="text-xs">W:</Label>
              <Input
                id="width"
                type="text"
                placeholder="Width"
                className="w-[70px] h-8"
                value={width}
                onChange={(e) => handleDimensionChange("width", e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleDimensionChange("width", e.currentTarget.value);
                  }
                }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Container width (px, %, etc)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Label htmlFor="height" className="text-xs">H:</Label>
              <Input
                id="height"
                type="text"
                placeholder="Height"
                className="w-[70px] h-8"
                value={height}
                onChange={(e) => handleDimensionChange("height", e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleDimensionChange("height", e.currentTarget.value);
                  }
                }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Container height (px, %, etc)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 