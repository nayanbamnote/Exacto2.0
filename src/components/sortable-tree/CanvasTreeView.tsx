"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Container, useCanvasStore } from "@/stores/canvasStore";
import { ClientOnlySortableTree } from "./ClientOnlySortableTree";
import { containersToTreeItems, updateContainersFromTree } from "./canvasStoreAdapter";
import { TreeItems } from "./types";
import { useUIStore } from "@/stores/uiStore";
import { useImportStore } from "@/stores/importStore";

// Helper function to check if containers have changed in a way that affects the tree
function haveContainersChanged(
  prev: Record<string, Container>, 
  current: Record<string, Container>
): boolean {
  // Quick check: different keys means different containers
  const prevKeys = Object.keys(prev);
  const currentKeys = Object.keys(current);
  
  if (prevKeys.length !== currentKeys.length) {
    return true;
  }
  
  // Check each container for relevant changes (parentId and children)
  for (const id of currentKeys) {
    // If container is new, it's a change
    if (!prev[id]) {
      return true;
    }
    
    const prevContainer = prev[id];
    const currentContainer = current[id];
    
    // Only check properties that affect the tree structure
    if (prevContainer.parentId !== currentContainer.parentId) {
      return true;
    }
    
    // Check if children arrays are different
    if (prevContainer.children.length !== currentContainer.children.length) {
      return true;
    }
    
    // Check each child ID
    for (let i = 0; i < currentContainer.children.length; i++) {
      if (prevContainer.children[i] !== currentContainer.children[i]) {
        return true;
      }
    }
  }
  
  return false;
}

interface CanvasTreeViewProps {
  className?: string;
  collapsible?: boolean;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
}

export function CanvasTreeView({
  className,
  collapsible = true,
  indentationWidth = 20,
  indicator = true,
  removable = true,
}: CanvasTreeViewProps) {
  const [treeItems, setTreeItems] = useState<TreeItems>([]);
  const { 
    containers, 
    updateContainer, 
    removeContainer, 
    getAllContainers,
    getRootContainers,
    nestContainer,
    unnestContainer
  } = useCanvasStore();
  
  // Get import store status to detect when import completes
  const { importStatus } = useImportStore();
  
  const { selectedContainerId, selectContainer } = useUIStore();
  
  // Add a ref to track if we're currently updating from tree changes
  const isUpdatingFromTree = useRef(false);
  // Add a ref to store previous containers for comparison
  const prevContainersRef = useRef<Record<string, Container>>({});
  // Track if we're handling a selection from the tree to avoid loops
  const isSelectingFromTree = useRef(false);
  // Track last import status to detect changes
  const lastImportStatusRef = useRef(importStatus);
  // Add a key to force re-render of the tree component
  const [treeKey, setTreeKey] = useState(0);

  // Function to update the tree with latest containers
  const updateTreeWithLatestContainers = useCallback(() => {
    console.log("Force updating tree view with containers:", Object.keys(containers).length);
    const items = containersToTreeItems(containers);
    setTreeItems(items);
    prevContainersRef.current = { ...containers };
    // Force rebuild the tree component by updating its key
    setTreeKey(prevKey => prevKey + 1);
  }, [containers]);

  // Force update the tree when import is successful
  useEffect(() => {
    if (importStatus === 'success' && lastImportStatusRef.current !== 'success') {
      console.log("Import success detected, updating tree view");
      // Small delay to ensure the canvas store has fully updated
      setTimeout(() => {
        updateTreeWithLatestContainers();
      }, 100);
    }
    lastImportStatusRef.current = importStatus;
  }, [importStatus, updateTreeWithLatestContainers]);

  // Convert containers to tree items whenever containers change
  useEffect(() => {
    // Skip if the update is coming from our own tree changes
    if (isUpdatingFromTree.current) {
      isUpdatingFromTree.current = false;
      return;
    }
    
    // Check if containers actually changed in a way that affects the tree
    if (!haveContainersChanged(prevContainersRef.current, containers)) {
      return;
    }
    
    // Update the previous containers reference
    prevContainersRef.current = { ...containers };
    
    // Convert containers to tree items
    const items = containersToTreeItems(containers);
    setTreeItems(items);
  }, [containers]);

  // Handle changes in the tree structure
  const handleTreeChange = (newItems: TreeItems) => {
    // Set flag that we're updating from tree changes
    isUpdatingFromTree.current = true;
    
    // Update container relationships based on the new tree structure
    updateContainersFromTree(newItems, updateContainer);
  };

  // Handle removing an item from the tree
  const handleRemove = (id: string) => {
    removeContainer(id);
  };

  // Handle selecting a container when clicked in the tree
  const handleContainerSelect = (id: string) => {
    isSelectingFromTree.current = true;
    selectContainer(id);
  };

  return (
    <div className="relative">
      <ClientOnlySortableTree
        key={treeKey}
        className={className}
        collapsible={collapsible}
        defaultItems={treeItems}
        indentationWidth={indentationWidth}
        indicator={indicator}
        removable={removable}
        onItemsChange={handleTreeChange}
        onRemove={handleRemove}
        onSelect={handleContainerSelect}
        selectedId={selectedContainerId}
      />
    </div>
  );
} 