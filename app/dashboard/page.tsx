import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, NewspaperIcon, UsersIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { redirect } from "next/navigation";
import React from "react";

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

export default async function DashboardPage() {  
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/sign-in");
  }
  
  const { data: eventsCountData, count: eventsCount } = await supabase.from("events").select("id", { count: "exact" });

  const { data: userCountData, count: userCount } = await supabase.from("users").select("id", { count: "exact" });

  const latestNews = mockData.latestNews;

  const { data: topUpcomingEvent } = await supabase.from("events")
  .select("title, description, participants, start_date, duration")
  .order("start_date", { ascending: true }).limit(1);
  

  // const { eventsCount, userCount, latestNews, topUpcomingEvent } = mockData;

  return (
    <div className="flex-1 w-full p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Members</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <NewspaperIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestNews.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Upcoming Event</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">{topUpcomingEvent.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{new Date(topUpcomingEvent.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>{topUpcomingEvent.duration} minutes</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>{topUpcomingEvent.street}</span>
            </div>
            <p className="text-sm">{topUpcomingEvent.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Neighborhood News</CardTitle>
          </CardHeader>
          <CardContent>
            {latestNews && latestNews.length > 0 ? (
              <ul className="space-y-4">
                {latestNews.map((news) => (
                  <li key={news.id} className="border-b pb-2">
                    <h3 className="font-semibold">{news.title}</h3>
                    <p className="text-sm text-muted-foreground">{news.summary}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent news available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
