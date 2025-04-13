import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw } from "lucide-react";
import { ContainerProps, ContainerPropsChangeHandler } from "./types";

interface BackgroundControlProps extends ContainerPropsChangeHandler {
  generateRandomColor: () => void;
  backgroundColor: string; 
}

export function BackgroundControl({ handleInputChange, generateRandomColor, backgroundColor }: BackgroundControlProps) {
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
                onChange={handleInputChange}
                name="backgroundColor"
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