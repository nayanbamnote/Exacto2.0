"use client";

import { useEffect } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { CanvasTreeView } from "@/components/sortable-tree/CanvasTreeView";
import { Button } from "@/components/ui/button";

export default function TreeTestPage() {
  const { addContainer, nestContainer, containers } = useCanvasStore();

  // Initialize with some test containers when the page loads
  useEffect(() => {
    // Only add test containers if the store is empty
    if (Object.keys(containers).length === 0) {
      const container1 = addContainer({ 
        x: 0, 
        y: 0, 
        width: 300, 
        height: 200,
        styles: { 
          backgroundColor: '#f0f0f0', 
          border: '1px solid #cccccc',
          zIndex: 1 
        }
      });
      
      const container2 = addContainer({ 
        x: 50, 
        y: 50, 
        width: 200, 
        height: 150,
        styles: { 
          backgroundColor: '#e0e0e0', 
          border: '1px solid #cccccc',
          zIndex: 2 
        }
      });
      
      const container3 = addContainer({ 
        x: 100, 
        y: 100, 
        width: 150, 
        height: 100,
        styles: { 
          backgroundColor: '#d0d0d0', 
          border: '1px solid #cccccc',
          zIndex: 3 
        }
      });
      
      // Nest container3 inside container2
      nestContainer(container3, container2);
    }
  }, [addContainer, nestContainer, containers]);

  // Add a new container to the canvas
  const handleAddContainer = () => {
    addContainer({
      x: Math.random() * 200,
      y: Math.random() * 200,
      width: 100 + Math.random() * 100,
      height: 100 + Math.random() * 100,
      styles: {
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)`,
        border: '1px solid #cccccc',
        zIndex: Object.keys(containers).length + 1
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Canvas Container Tree</h1>
      
      <div className="mb-4">
        <Button onClick={handleAddContainer}>
          Add Container
        </Button>
      </div>
      
      <div className="border rounded-lg p-4 bg-background">
        <CanvasTreeView 
          className="w-full" 
          collapsible={true}
          removable={true}
          indicator={true}
        />
      </div>
    </div>
  );
} 