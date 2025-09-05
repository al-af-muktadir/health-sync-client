"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          const hasSubItems = item.items?.length;
          const isSubActive = item.items?.some((sub) => pathname === sub.url);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive || isSubActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`
                      group flex items-center
                      ${
                        isActive
                          ? "bg-violet-100 text-violet-700 font-semibold"
                          : "hover:bg-violet-50 hover:text-violet-700"
                      }
                      transition-all duration-150 rounded-md px-2
                    `}
                  >
                    {item.url ? (
                      <Link href={item.url}>
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon className="size-4" />}
                          <span>{item.title}</span>
                          {hasSubItems && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                        {hasSubItems && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </div>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {hasSubItems && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={`
                                ${
                                  isSubActive
                                    ? "bg-violet-100 text-violet-700 font-medium"
                                    : "hover:bg-violet-50 hover:text-violet-700"
                                }
                                transition-all duration-150
                              `}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
