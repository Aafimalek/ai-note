"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import SidebarGroupContent from "./SidebarGroupContent";
import useNote from "@/hooks/useNote";
import ApiKeyManager from "./ApiKeyManager";

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
      <SidebarSeparator />
      <SidebarFooter>
        <ApiKeyManager />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
