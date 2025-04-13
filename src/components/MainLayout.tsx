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
        <div className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-4">
            <SidebarTrigger />
            <Toolbar />
          </div>
          <ElementPlayground />
        </div>
      </div>
    </SidebarProvider>
  );
} 