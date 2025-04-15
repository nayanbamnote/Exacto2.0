"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarProvider,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { ClientOnlySortableTree } from "@/components/sortable-tree/ClientOnlySortableTree";
import { ElementPlayground } from "@/components/ElementPlayground";
import { Toolbar } from "@/components/Toolbar";
import { CanvasTreeView } from "./sortable-tree/CanvasTreeView";

interface SortableSidebarProps {
  defaultOpen?: boolean;
}

function ToolbarWithPosition() {
  const { open } = useSidebar();
  
  return (
    <div className={`fixed top-4 z-10 flex items-center transition-all duration-300 ${open ? 'left-[400px]' : 'left-[300px]'}`}>
      <Toolbar />
    </div>
  );
}

export function MainLayout({ 
  defaultOpen = true
}: SortableSidebarProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4 ">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex-1 text-center">Relative+Absolute</h2>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <div className="px-2 py-2">
                <CanvasTreeView />
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger className="absolute z-[1] left-4 top-4" />
        <div className="flex-1 flex flex-col relative bg-sidebar">
          {/* Responsive toolbar position based on sidebar state */}
          <ToolbarWithPosition />
          
          {/* Content area with full height for canvas */}
          <div className="flex-1">
            <ElementPlayground />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
} 