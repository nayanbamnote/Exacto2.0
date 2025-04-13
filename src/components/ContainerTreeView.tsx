"use client";

import { ClientOnlySortableTree } from './sortable-tree/ClientOnlySortableTree';

export function ContainerTreeView() {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Container Hierarchy</h3>
      <p className="mb-3 text-sm text-gray-600">
        Showing container structure from dummyCanvasData.ts. Each container displays its ID, width, and height.
        Click on the arrows to expand/collapse containers with children.
      </p>
      <ClientOnlySortableTree 
        useContainers={true}
        collapsible={true}
        indicator={true}
        indentationWidth={24}
        className="w-full"
        removable={false}
      />
    </div>
  );
} 