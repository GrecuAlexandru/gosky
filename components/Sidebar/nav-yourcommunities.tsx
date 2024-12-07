"use client"

import {
    ArrowUpRight,
    Link,
    MoreHorizontal,
    StarOff,
    Trash2,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavYourCommunities({
    yourCommunities,
  }: {
    yourCommunities: {
      name: string
      url: string
      emoji: string
    }[]
  }) {
    const { isMobile } = useSidebar()
  
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="text-[#383838]">Your Communities</SidebarGroupLabel>
        <SidebarMenu>
          {yourCommunities.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a
                  href={item.url}
                  title={item.name}
                  className="hover:bg-[#F3F6FF] hover:text-[#0264FA] text-[#383838] rounded-md px-2 py-1 transition-colors"
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal className="text-[#383838]" />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg border border-[#EAECED] bg-white"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem className="hover:bg-[#F3F6FF] hover:text-[#0264FA]">
                    <Trash2 className="text-[#383838]" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }
