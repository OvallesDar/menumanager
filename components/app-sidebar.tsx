"use client";

import * as React from "react";
import {
  BookOpen,
  Coffee,
  NotebookPen,
  ScrollText,
  Utensils,
} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { NavMain } from "./nav-main";

const data = {
  teams: [
    {
      name: "Cafetería Lauka",
      logo: Utensils,
      plan: "Menú Manager",
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: BookOpen,
    },
    {
      name: "Secciones",
      url: "/dashboard/sections",
      icon: ScrollText,
    },
    {
      name: "Categorías",
      url: "/dashboard/categories",
      icon: NotebookPen,
    },
    {
      name: "Productos",
      url: "/dashboard/products",
      icon: Coffee,
    },
  ],
  navMain: [
    {
      title: "Sección",
      icon: ScrollText,

      items: [
        {
          title: "Crear sección",
          url: "/dashboard/sections/create",
        },
      ],
    },
    {
      title: "Categoría",
      icon: NotebookPen,
      items: [
        {
          title: "Crear categoría",
          url: "/dashboard/categories/create",
        },
      ],
    },
    {
      title: "Producto",
      icon: Coffee,
      items: [
        {
          title: "Crear producto",
          url: "/dashboard/products/create",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    avatar: "",
  });

  React.useEffect(() => {
    if (!session?.user) return;

    const { name, email, image } = session.user;

    setUser((prevUser) => ({
      ...prevUser,
      email: email || user.email,
      name: name || user.name,
      avatar: image || user.avatar,
    }));
  }, [session]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
