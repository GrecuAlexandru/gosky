"use client"

import {
    ArrowUpRight,
    Link,
    MoreHorizontal,
    StarOff,
    Trash2,
    Plus,
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { createClient } from "@/utils/supabase/client"
import * as React from "react"

interface NavYourCommunitiesProps {
    active: string;
    setActive: (active: string) => void;
}

export function NavYourCommunities({ active, setActive }: NavYourCommunitiesProps) {
    const { isMobile } = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Your Communities</SidebarGroupLabel>
            <SidebarMenu>
                {yourCommunities.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url} title={item.name}>
                                <span>{item.emoji}</span>
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <Trash2 className="text-muted-foreground" />
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
