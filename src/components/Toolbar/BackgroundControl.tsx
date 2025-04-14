import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { useEffect, useState } from "react";

export function BackgroundControl() {
  const selectedContainerId = useUIStore(state => state.selectedContainerId);
  const containers = useCanvasStore(state => state.containers);
  const updateContainer = useCanvasStore(state => state.updateContainer);
  
  const [backgroundColor, setBackgroundColor] = useState("#f0f0f0");

  // Update background color when selection changes
  useEffect(() => {
    if (selectedContainerId && containers[selectedContainerId]) {
      const container = containers[selectedContainerId];
      setBackgroundColor(container.styles?.backgroundColor || "#f0f0f0");
    }
  }, [selectedContainerId, containers]);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedContainerId) return;
    
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    
    // Update the container in the store
    updateContainer(selectedContainerId, {
      styles: {
        ...containers[selectedContainerId].styles,
        backgroundColor: newColor
      }
    });
  };

  const generateRandomColor = () => {
    if (!selectedContainerId) return;
    
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBackgroundColor(randomColor);
    
    // Update the container in the store
    updateContainer(selectedContainerId, {
      styles: {
        ...containers[selectedContainerId].styles,
        backgroundColor: randomColor
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Input
                type="text"
                className="w-24 h-8"
                value={backgroundColor}
                onChange={handleBackgroundChange}
                placeholder="#000000"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Background color (hex)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={generateRandomColor}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate random color</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 