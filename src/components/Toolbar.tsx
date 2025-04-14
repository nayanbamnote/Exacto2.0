import React, { useState } from "react";
import { DeviceSelector } from "./Toolbar/DeviceSelector";
import { ZoomControls } from "./Toolbar/ZoomControls";
import { DimensionsControl } from "./Toolbar/DimensionsControl";
import { BackgroundControl } from "./Toolbar/BackgroundControl";
import { BorderControls } from "./Toolbar/BorderControls";
import { AddContainer } from "./Toolbar/AddContainer";
import { CodeGenerator } from "./Toolbar/CodeGenerator";
import { ZIndexManager } from "./Toolbar/ZIndexManager";
import { ContainerProps } from "./Toolbar/types";

export function Toolbar() {
  const [containerProps, setContainerProps] = useState<ContainerProps>({
    width: "200", 
    height: "200",
    backgroundColor: "#f0f0f0",
    borderStyle: "solid",
    borderWidth: "1",
    borderColor: "#000000",
  });

  // Generate random hex color
  const generateRandomColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    setContainerProps({ ...containerProps, backgroundColor: randomColor });
  };

  // Handle input changes for container properties
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContainerProps({ ...containerProps, [name]: value });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-2 bg-background border rounded-md p-2 shadow-sm">
        <DeviceSelector />
        
        <ZoomControls />
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <DimensionsControl />
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <BackgroundControl
          handleInputChange={handleInputChange}
          generateRandomColor={generateRandomColor}
          backgroundColor={containerProps.backgroundColor}
        />
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <BorderControls
          handleInputChange={handleInputChange}
          containerProps={containerProps}
          setContainerProps={setContainerProps}
        />
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <AddContainer
          containerProps={containerProps}
          setContainerProps={setContainerProps}
          handleInputChange={handleInputChange}
        />

        <div className="h-6 w-px bg-border mx-1" />
        
        <ZIndexManager />

        <div className="h-6 w-px bg-border mx-1" />
        
        <CodeGenerator />
      </div>
    </div>
  );
} 