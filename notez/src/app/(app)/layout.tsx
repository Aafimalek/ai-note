import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import NoteProvider from "@/providers/NoteProvider";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NoteProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </NoteProvider>
  );
}
