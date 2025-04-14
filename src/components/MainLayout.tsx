"use client";

import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarProvider,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ClientOnlySortableTree } from "@/components/sortable-tree/ClientOnlySortableTree";
import { ElementPlayground } from "@/components/ElementPlayground";
import { Toolbar } from "@/components/Toolbar";

interface SortableSidebarProps {
  defaultOpen?: boolean;
}

export function MainLayout({ 
  defaultOpen = true
}: SortableSidebarProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <h2 className="text-lg font-semibold">Container Explorer</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <div className="px-2 py-2">
                <ClientOnlySortableTree
                  useContainers={true}
                  collapsible={true}
                  indicator={true}
                  removable={false}
                  className="w-full"
                />
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col relative bg-sidebar">
          {/* Fixed floating toolbar */}
          <div className="fixed top-4  z-10 flex items-center gap-4">
            <SidebarTrigger />
            <Toolbar />
          </div>
          
          {/* Content area with full height for canvas */}
          <div className="flex-1">
            <ElementPlayground />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
} 