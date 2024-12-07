"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddEventButton from "@/components/AddEventButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Event {
  id: number;
  title: string;
  description: string;
  participants: number;
  start_date: string;
  end_date: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*");
        if (error) throw error;

        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    router.refresh();
  };

  if (loading) {
    return <p className="text-center text-[#383838]">Loading events...</p>;
  }

  return (
    <div className="space-y-8 flex-1 w-full p-6 bg-[#F3F6FF] min-h-screen">
      {/* Add Event Button */}
      <div className="flex justify-end">
        <AddEventButton onAddEvent={handleAddEvent} />
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            className="bg-white shadow-md rounded-lg flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-[#0264FA] text-lg font-bold">
                {event.title}
              </CardTitle>
              <CardDescription className="text-[#383838]/80">
                {event.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-[#383838]">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-[#0264FA]" />
                  <span>
                    {new Date(event.start_date).toLocaleDateString()} -{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
                  className="text-[#0264FA] border-[#0264FA] hover:bg-[#0264FA] hover:text-white transition"
                >
                  View Event
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}