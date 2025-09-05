"use client";

import React from "react";
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

interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

interface NavMainProps {
  items: NavItem[];
  itemClassName?: string;
  activeClassName?: string;
  iconClassName?: string;
  linkWrapper?: (props: {
    children: React.ReactNode;
    href?: string;
    isActive?: boolean;
  }) => React.ReactNode;
}

export function NavMain({
  items,
  itemClassName = "",
  activeClassName = "",
  iconClassName = "",
  linkWrapper,
}: NavMainProps) {
  const pathname = usePathname();

  const wrapLink = (
    children: React.ReactNode,
    href?: string,
    isActive?: boolean
  ) => (linkWrapper ? linkWrapper({ children, href, isActive }) : children);

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
              <SidebarMenuItem className={itemClassName}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    {wrapLink(
                      item.url ? (
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon className={iconClassName} />}
                          <span>{item.title}</span>
                          {hasSubItems && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon className={iconClassName} />}
                          <span>{item.title}</span>
                          {hasSubItems && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </div>
                      ),
                      item.url,
                      isActive
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {hasSubItems && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map((subItem) => {
                        const isSubActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={isSubActive ? activeClassName : ""}
                            >
                              <Link href={subItem.url}>{subItem.title}</Link>
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
