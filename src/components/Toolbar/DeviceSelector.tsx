import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Smartphone, Tablet, Monitor, Laptop } from "lucide-react";
import { useCanvasStore, devicePresets } from "@/stores/devicesectionStore";

export function DeviceSelector() {
  const { selectedDevice, setSelectedDevice } = useCanvasStore();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select
              value={selectedDevice}
              onValueChange={setSelectedDevice}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobileS">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Mobile S (320×568)</span>
                  </div>
                </SelectItem>
                <SelectItem value="mobileM">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Mobile M (375×667)</span>
                  </div>
                </SelectItem>
                <SelectItem value="mobileL">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Mobile L (425×896)</span>
                  </div>
                </SelectItem>
                <SelectItem value="tablet">
                  <div className="flex items-center gap-2">
                    <Tablet className="h-4 w-4" />
                    <span>Tablet (768×1024)</span>
                  </div>
                </SelectItem>
                <SelectItem value="laptop">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    <span>Laptop (1024×768)</span>
                  </div>
                </SelectItem>
                <SelectItem value="desktop">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>Desktop (1440×900)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Select device preset</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 