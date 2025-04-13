import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ZoomIn } from "lucide-react";

export function ZoomControls() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select defaultValue="100">
              <SelectTrigger className="w-[100px]">
                <div className="flex items-center gap-1">
                  <ZoomIn className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Zoom" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="125">125%</SelectItem>
                <SelectItem value="150">150%</SelectItem>
                <SelectItem value="200">200%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Set zoom level</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 