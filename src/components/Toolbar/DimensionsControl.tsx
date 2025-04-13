import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DimensionsControl() {
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
                defaultValue="100%"
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
                defaultValue="auto"
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