"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  title: string;
  description: string;
  participants: number;
  date: string;
}

// Mock Data
const mockData: Event[] = [
  {
    id: 1,
    title: "Community Garden Planting Day",
    description:
      "Join us for a day of planting and beautifying our community garden. Bring your gardening gloves and let's grow together!",
    participants: 30,
    date: "2023-07-15T09:00:00Z",
  },
  {
    id: 2,
    title: "Neighborhood Watch Meeting",
    description: "Monthly meeting to discuss local safety concerns and strategies. All residents are welcome to attend and contribute.",
    participants: 25,
    date: "2023-07-20T19:00:00Z",
  },
  // Add more mock data...
];

function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulate fetching events (replace with API call if needed)
    setEvents(mockData);
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <time dateTime={event.date}>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <UsersIcon className="w-3 h-3" />
                <span>{event.participants}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        <Button className="ml-auto">Add Event</Button> {/* Add Event Button */}
      </div>
      <EventList />
    </div>
  );
}
