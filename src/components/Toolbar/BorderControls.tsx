import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUIStore } from "@/stores/uiStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { useEffect, useState } from "react";

export function BorderControls() {
  const selectedContainerId = useUIStore(state => state.selectedContainerId);
  const containers = useCanvasStore(state => state.containers);
  const updateContainer = useCanvasStore(state => state.updateContainer);

  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderWidth, setBorderWidth] = useState("1");
  const [borderColor, setBorderColor] = useState("#000000");

  // Parse border string into components
  const parseBorder = (borderStr: string) => {
    // Default values
    let width = "1";
    let style = "solid";
    let color = "#000000";

    // Match pattern: <width>px <style> <color>
    const match = borderStr.match(/^(\d+)px\s+(solid|dashed|dotted|none)\s+(.+)$/);
    if (match) {
      width = match[1];
      style = match[2];
      color = match[3];
    }

    return { width, style, color };
  };

  // Update border properties when selection changes
  useEffect(() => {
    if (selectedContainerId && containers[selectedContainerId]) {
      const container = containers[selectedContainerId];
      const { width, style, color } = parseBorder(container.styles.border);
      setBorderWidth(width);
      setBorderStyle(style);
      setBorderColor(color);
    }
  }, [selectedContainerId, containers]);

  // Combine border properties into a single string and update container
  const updateBorder = (updates: { width?: string; style?: string; color?: string }) => {
    if (!selectedContainerId) return;

    const newWidth = updates.width ?? borderWidth;
    const newStyle = updates.style ?? borderStyle;
    const newColor = updates.color ?? borderColor;

    // Update local state
    if (updates.width) setBorderWidth(updates.width);
    if (updates.style) setBorderStyle(updates.style);
    if (updates.color) setBorderColor(updates.color);

    // Create combined border string
    const borderValue = `${newWidth}px ${newStyle} ${newColor}`;

    // Update container in store
    updateContainer(selectedContainerId, {
      styles: {
        ...containers[selectedContainerId].styles,
        border: borderValue
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select 
                value={borderStyle}
                onValueChange={(value) => updateBorder({ style: value })}
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
              value={borderWidth}
              className="w-[50px] h-8"
              onChange={(e) => updateBorder({ width: e.target.value })}
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
              value={borderColor}
              onChange={(e) => updateBorder({ color: e.target.value })}
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