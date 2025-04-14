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
import { PlusCircle } from "lucide-react";
import { ContainerProps, ContainerPropsChangeHandler } from "./types";

interface AddContainerProps extends ContainerPropsChangeHandler {
  containerProps: ContainerProps;
  setContainerProps: React.Dispatch<React.SetStateAction<ContainerProps>>;
}

export function AddContainer({ containerProps, setContainerProps, handleInputChange }: AddContainerProps) {
  return (
    <DropdownMenu>
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
            <Input
              id="newBgColor"
              name="backgroundColor"
              type="text"
              value={containerProps.backgroundColor}
              onChange={handleInputChange}
              placeholder="#000000"
              className="h-8"
            />
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
          
          <Button className="col-span-2 mt-2">
            Create Container
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 