import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCanvasStore } from "@/stores/canvasStore";

export function ZIndexManager() {
  const selectedContainerId = useUIStore(state => state.selectedContainerId);
  const containers = useCanvasStore(state => state.containers);
  const updateContainer = useCanvasStore(state => state.updateContainer);

  const bringForward = () => {
    if (!selectedContainerId) return;
    
    const container = containers[selectedContainerId];
    const currentZIndex = container.styles?.zIndex || 1;
    
    updateContainer(selectedContainerId, {
      styles: {
        ...container.styles,
        zIndex: currentZIndex + 1
      }
    });
  };

  const sendBackward = () => {
    if (!selectedContainerId) return;
    
    const container = containers[selectedContainerId];
    const currentZIndex = container.styles?.zIndex || 1;
    
    // Don't allow negative z-index
    if (currentZIndex > 0) {
      updateContainer(selectedContainerId, {
        styles: {
          ...container.styles,
          zIndex: currentZIndex - 1
        }
      });
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={bringForward}
              disabled={!selectedContainerId}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bring forward</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={sendBackward}
              disabled={!selectedContainerId}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send backward</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
} 