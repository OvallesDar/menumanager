"use client";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import SectionsProvider, { SectionsContext } from "../context/sectionContext";
import Loading from "@/components/loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <SessionProvider>
      <SectionsProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex fixed z-30 bg-white w-full h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {parts.map((part, index) => (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          <BreadcrumbPage className="first-letter:uppercase">
                            {part}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                        {index < parts.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="mt-16">
              <ContentWrapper>{children}</ContentWrapper>
              <footer className="bg-muted/50 min-h-[10vh] flex-1 rounded-xl mx-4 p-4"></footer>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SectionsProvider>
    </SessionProvider>
  );
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { loading, error } = useContext(SectionsContext);
  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  return children;
}
