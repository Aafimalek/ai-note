"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SidebarGroupContent from "./SidebarGroupContent";
import useNote from "@/hooks/useNote";

function AppSidebar() {
  const { notes } = useNote();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">Your Notes</span>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent notes={notes} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
