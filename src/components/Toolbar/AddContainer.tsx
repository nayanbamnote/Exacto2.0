import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusCircle, RefreshCw } from "lucide-react";
import { ContainerProps, ContainerPropsChangeHandler } from "./types";
import { useCanvasStore } from "@/stores/canvasStore";

interface AddContainerProps extends ContainerPropsChangeHandler {
  containerProps: ContainerProps;
  setContainerProps: React.Dispatch<React.SetStateAction<ContainerProps>>;
}

export function AddContainer({ containerProps, setContainerProps, handleInputChange }: AddContainerProps) {
  const addContainer = useCanvasStore(state => state.addContainer);
  
  const handleCreateContainer = () => {
    // Create a new container with properties from the form 
    const container = {
      x: 50, // Default x position
      y: 50, // Default y position
      width: Number(containerProps.width) || 200,
      height: Number(containerProps.height) || 100,
      rotation: 0, // Default rotation
      styles: {
        backgroundColor: containerProps.backgroundColor || '#ffffff',
        border: `${containerProps.borderWidth || 1}px ${containerProps.borderStyle || 'solid'} ${containerProps.borderColor || '#cccccc'}`,
        zIndex: 1,
      }
    };
    
    // Add the container to the store
    addContainer(container);
  };

  const generateRandomColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setContainerProps({
      ...containerProps,
      backgroundColor: randomColor
    });
  };

  return (
    <DropdownMenu modal={false}>
      <TooltipProvider>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent>
            <p>Add container</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-[350px] p-3" align="end">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="newWidth" className="text-xs">Width</Label>
            <Input
              id="newWidth"
              name="width"
              value={containerProps.width}
              onChange={handleInputChange}
              placeholder="Width (px)"
              className="h-8"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="newHeight" className="text-xs">Height</Label>
            <Input
              id="newHeight"
              name="height"
              value={containerProps.height}
              onChange={handleInputChange}
              placeholder="Height (px)"
              className="h-8"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="newBgColor" className="text-xs">Background</Label>
            <div className="flex gap-2">
              <Input
                id="newBgColor"
                name="backgroundColor"
                type="text"
                value={containerProps.backgroundColor}
                onChange={handleInputChange}
                placeholder="#000000"
                className="h-8 flex-1"
              />
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
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="newBorderStyle" className="text-xs">Border</Label>
            <Select 
              value={containerProps.borderStyle}
              onValueChange={(value) => setContainerProps({...containerProps, borderStyle: value})}
            >
              <SelectTrigger id="newBorderStyle" className="h-8">
                <SelectValue placeholder="Border style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="newBorderWidth" className="text-xs">Border Width</Label>
            <Input
              id="newBorderWidth"
              name="borderWidth"
              type="number"
              value={containerProps.borderWidth}
              onChange={handleInputChange}
              placeholder="Width (px)"
              min="0"
              max="10"
              className="h-8"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="newBorderColor" className="text-xs">Border Color</Label>
            <Input
              id="newBorderColor"
              name="borderColor"
              type="text"
              value={containerProps.borderColor}
              onChange={handleInputChange}
              placeholder="#000000"
              className="h-8"
            />
          </div>
          
          <Button className="col-span-2 mt-2" onClick={handleCreateContainer}>
            Create Container
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 