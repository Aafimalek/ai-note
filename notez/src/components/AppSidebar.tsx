"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import SidebarGroupContent from "./SidebarGroupContent";
import useNote from "@/hooks/useNote";

function AppSidebar() {
  const { notes } = useNote();

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            Your Notes
          </SidebarGroupLabel>
          <SidebarGroupContent notes={notes} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
