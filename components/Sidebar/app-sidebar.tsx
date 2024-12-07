"use client"

import * as React from "react"
import {
    AudioWaveform,
    Blocks,
    Calendar,
    Command,
    Home,
    icons,
    Inbox,
    MessageCircleQuestion,
    Search,
    Settings2,
    Sparkles,
    Trash2,
} from "lucide-react"
import HoodHubLogo from "@/components/hoodhub-logo"

import { NavYourCommunities } from "@/components/Sidebar/nav-yourcommunities"
import { NavMain } from "@/components/Sidebar/nav-main"
import { NavSecondary } from "@/components/Sidebar/nav-secondary"
import { NavUser } from "@/components/Sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"

// This is sample data.
const sampleData = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Home",
            url: "/dashboard",
            icon: Home,
            isActive: true,
        },
        {
            title: "Communities",
            url: "/dashboard/communities",
            icon: Inbox,
        },
        {
            title: "Events",
            url: "/dashboard/events",
            icon: Calendar,
        }
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings2,
        },
        {
            title: "Help",
            url: "/help",
            icon: MessageCircleQuestion,
        },
    ],
    yourCommunities: [
        {
            name: "Project Management & Task Tracking",
            url: "#",
            emoji: "📊",
        },
        {
            name: "Family Recipe Collection & Meal Planning",
            url: "#",
            emoji: "🍳",
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser()

            console.log("data", data);

            if (error) {
                console.error("Error fetching user:", error)
                return
            }

            if (data.user) {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("username")
                    .eq("id", data.user.id)
                    .single()

                if (userError) {
                    console.error("Error fetching user data:", userError)
                    return
                }

                setUser({ name: userData.username, email: data.user.email ?? "" })
            }
        }

        fetchUser()
    }, [])

    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <HoodHubLogo />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">HoodHub</span>
                                    <span className="truncate text-xs">Resident</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavMain items={sampleData.navMain} />
            </SidebarHeader>
            <SidebarContent>
                <NavYourCommunities yourCommunities={sampleData.yourCommunities} />
                <NavSecondary items={sampleData.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user ?? { name: "", email: "" }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
