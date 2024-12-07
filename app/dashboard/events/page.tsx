"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddEventButton from "@/components/AddEventButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // Import Supabase client

interface Event {
  id: number;
  title: string;
  description: string;
  participants: number;
  start_date: string;
  end_date: string;
  latitude?: string;
  longitude?: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*"); // Query all events
        if (error) throw error;

        setEvents(data || []); // Set the fetched events
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false); // Turn off loading state
      }
    };

    fetchEvents();
  }, [supabase]);

  const handleAddEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    router.refresh();
  };

  if (loading) {
    return <p>Loading events...</p>; // Show a loading message while fetching data
  }

  return (
    <div className="space-y-6">
      {/* Add Event Button */}
      <div className="flex justify-end">
        <AddEventButton onAddEvent={handleAddEvent} />
      </div>

      {/* Event Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {new Date(event.start_date).toLocaleDateString()} -{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </span>
                </div>
                <Badge className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  {event.participants}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
