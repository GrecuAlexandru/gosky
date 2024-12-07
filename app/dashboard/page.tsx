import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, UsersIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import EventHeatmap from "@/components/EventHeatmap";

const mockData = {
    eventsCount: 15,
    userCount: 250,
    latestNews: [
        { id: 1, title: "Community Cleanup Day", summary: "Join us this Saturday for our annual neighborhood cleanup event." },
        { id: 2, title: "New Playground Opening", summary: "The new children's playground in Central Park will be inaugurated next week." },
        { id: 3, title: "Local Artist Exhibition", summary: "Don't miss the showcase of our talented local artists at the Community Center." },
    ],
    topUpcomingEvent: {
        title: "Summer Block Party",
        start_date: "2023-07-15",
        duration: 120,
        street: "Main Street",
        description: "Join us for our annual Summer Block Party! There will be food, music, and activities for all ages. Don't miss out on the fun!",
    },
};

interface UpcomingEvent {
    title: string;
    start_date: string;
    duration: number;
    street: string;
    description: string;
}

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const { count: eventsCount } = await supabase.from("events").select("id", { count: "exact" });
    const { count: userCount } = await supabase.from("users").select("id", { count: "exact" });

    const latestNews = mockData.latestNews;

    const { data: nextEventData } = await supabase
        .from("events")
        .select("title, description, duration, start_date, duration, street")
        .order("start_date", { ascending: true })
        .limit(1);

    const topUpcomingEvent: UpcomingEvent | null =
        nextEventData && nextEventData.length > 0
            ? {
                title: nextEventData[0].title,
                start_date: nextEventData[0].start_date,
                duration: nextEventData[0].duration,
                street: nextEventData[0].street,
                description: nextEventData[0].description,
            }
            : mockData.topUpcomingEvent;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-[#F3F6FF]">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-[#383838]">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Events */}
                <Card className="bg-[#0264FA] text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{eventsCount}</div>
                        <p className="text-xs text-[#F3F6FF]/70">+20% from last month</p>
                    </CardContent>
                </Card>

                {/* Total Users */}
                <Card className="bg-[#EAEDED] text-[#383838]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UsersIcon className="h-4 w-4 text-[#383838]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-[#383838]/70">+10% from last month</p>
                    </CardContent>
                </Card>

                {/* Active Users */}
                <Card className="bg-[#383838] text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <UsersIcon className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-[#FFFFFF]/70">+201 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Upcoming Event */}
            <Card className="col-span-4 bg-[#FFFFFF] text-[#383838] shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Top Upcoming Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 className="text-xl font-bold mb-2">{topUpcomingEvent.title}</h3>
                    <div className="flex items-center text-sm mb-1">
                        <CalendarIcon className="h-4 w-4 mr-2 text-[#383838]" />
                        <span>{new Date(topUpcomingEvent.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm mb-1">
                        <ClockIcon className="h-4 w-4 mr-2 text-[#383838]" />
                        <span>{topUpcomingEvent.duration} minutes</span>
                    </div>
                    <div className="flex items-center text-sm mb-3">
                        <MapPinIcon className="h-4 w-4 mr-2 text-[#383838]" />
                        <span>{topUpcomingEvent.street}</span>
                    </div>
                    <p className="text-sm text-[#383838]/80">{topUpcomingEvent.description}</p>
                </CardContent>
            </Card>

            {/* Event Heatmap */}
            <Card className="col-span-full bg-[#EAEDED] shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#383838]">What's Hot</CardTitle>
                </CardHeader>
                <CardContent>
                    <EventHeatmap />
                </CardContent>
            </Card>
        </div>
    );
}
