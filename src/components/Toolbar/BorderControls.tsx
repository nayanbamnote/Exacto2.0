import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ContainerProps, ContainerPropsChangeHandler } from "./types";

interface BorderControlsProps extends ContainerPropsChangeHandler {
  containerProps: ContainerProps;
  setContainerProps: React.Dispatch<React.SetStateAction<ContainerProps>>;
} 

export function BorderControls({ handleInputChange, containerProps, setContainerProps }: BorderControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select 
                value={containerProps.borderStyle}
                onValueChange={(value) => setContainerProps({...containerProps, borderStyle: value})}
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue placeholder="Border" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Border style</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              type="number"
              min="0"
              max="10"
              value={containerProps.borderWidth}
              className="w-[50px] h-8"
              name="borderWidth"
              onChange={handleInputChange}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Border width (px)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              type="text"
              className="w-24 h-8"
              value={containerProps.borderColor}
              name="borderColor"
              onChange={handleInputChange}
              placeholder="#000000"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Border color (hex)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 