"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CalendarCheck2,
  ClipboardList,
  LayoutDashboard,
  SquareTerminal,
  UsersRoundIcon,
  FileClock,
  DollarSign,
  Paperclip,
  Check,
} from "lucide-react";
import image from "../../../public/Animation - 1749834497886.json";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useUser } from "@/api/Context/UserContext";
import Lottie from "lottie-react";
import { FaDisease } from "react-icons/fa";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { collapsed?: boolean }) {
  const { user, setIsLoading, refetchUser } = useUser();

  // Patient menu
  const patientMenu = [
    {
      title: "Dashboard",
      url: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "View Appointments",
      url: "/patient/view-appointments",
      icon: CalendarCheck2,
    },
    {
      title: "Payments",
      url: "/patient/payment",
      icon: DollarSign,
    },
    {
      title: "Manage Medical Reports",
      url: "/patient/medical-reports",
      icon: Paperclip,
    },
    {
      title: "My Health Information",
      icon: ClipboardList,
      items: [
        { title: "Update My Health Details", url: "/patient/health/update" },
        { title: "View", url: "/patient/health/viewinfo" },
      ],
    },
  ];

  // Doctor menu
  const doctorMenu = [
    {
      title: "Dashboard",
      url: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Publish Schedule",
      url: "/doctor/publish-schedule",
      icon: FileClock,
    },
    {
      title: "Manage Schedule",
      url: "/doctor/manage-my-schedule",
      icon: FileClock,
    },
    {
      title: "View Appointments",
      url: "/doctor/view-appointments",
      icon: CalendarCheck2,
    },
    {
      title: "Manage Health Blogs",
      url: "/doctor/manage-blogs",
      icon: Check,
    },
  ];

  // Admin menu
  const adminMenu = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Publish Blog",
      url: "/admin/publish-blog",
      icon: CalendarCheck2,
    },
    {
      title: "Manage Users",
      icon: UsersRoundIcon,
      items: [
        { title: "Create Doctor", url: "/admin/manage-users/create-doctor" },
        { title: "Manage Doctor", url: "/admin/manage-users/manage-doctor" },
        { title: "Manage Patient", url: "/admin/manage-users/manage-patient" },
      ],
    },
    {
      title: "Manage Schedule",
      icon: ClipboardList,
      items: [
        {
          title: "Manage Schedules",
          url: "/admin/manage-schedule/create-schedule",
        },
        {
          title: "View Schedules",
          url: "/admin/manage-schedule/view-schedules",
        },
      ],
    },
    {
      title: "Manage Specialties",
      icon: ClipboardList,
      items: [
        {
          title: "Create Specialties",
          url: "/admin/manage-specialties/create-specialties",
        },
        {
          title: "View Specialties",
          url: "/admin/manage-specialties/view-specialties",
        },
      ],
    },
    {
      title: "Manage Diseases",
      icon: FaDisease,
      items: [
        { title: "View Diseases", url: "/admin/manage-diseases/view-diseases" },
      ],
    },
  ];

  // Superadmin menu
  const superAdminMenu = [
    {
      title: "Dashboard",
      url: "/superadmin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Users",
      icon: UsersRoundIcon,
      items: [
        { title: "View All Users", url: "/superadmin/manage-users/view" },
        { title: "Assign Roles", url: "/superadmin/manage-users/roles" },
      ],
    },
  ];

  // Determine menu based on role
  const getNavItems = () => {
    switch (user?.role?.toUpperCase()) {
      case "PATIENT":
        return patientMenu;
      case "DOCTOR":
        return doctorMenu;
      case "ADMIN":
        return adminMenu;
      case "SUPERADMIN":
        return superAdminMenu;
      default:
        return [];
    }
  };

  const navData = { navMain: getNavItems() };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-[#0f0f17] text-white overflow-hidden"
    >
      {/* Header */}
      <SidebarHeader className="px-4 py-4 bg-[#1a1538]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="xl" asChild>
              <Link href="/" className="flex items-center gap-3">
                <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-[#1e173f] border border-[#5f3dc4] flex items-center justify-center shadow-md">
                  <div className="w-10 h-10">
                    <Lottie animationData={image} loop />
                  </div>
                  <span className="absolute inset-0 rounded-full ring-1 ring-[#8f6fff] opacity-30" />
                </div>
                <div className="flex flex-col leading-tight">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white tracking-tight">
                      Health
                    </span>
                    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#b38bff] to-[#c073ff] tracking-tight">
                      Sync
                    </span>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">
                    Connected Care
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="flex-1 bg-black/90 backdrop-blur-sm">
        <NavMain
          items={navData.navMain}
          itemClassName="relative group rounded-md overflow-hidden"
          activeClassName="bg-[rgba(99,54,223,0.15)] text-white"
          iconClassName="stroke-[1.3]"
          linkWrapper={({ children, href, isActive }: any) => (
            <Link
              href={href}
              className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition ${
                isActive ? "text-white" : "text-gray-300 group-hover:text-white"
              }`}
            >
              {children}
              {isActive && (
                <div className="absolute -left-1 w-1 h-full rounded-full bg-gradient-to-b from-[#b38bff] to-[#c073ff]" />
              )}
            </Link>
          )}
        />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="mt-auto bg-black/90 border-t border-[#2f2a50]">
        <div className="px-4 py-3">
          <NavUser
            user={user}
            setIsLoading={setIsLoading}
            refetchUser={refetchUser}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
