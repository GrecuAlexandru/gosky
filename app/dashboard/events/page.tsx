'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UsersIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

interface Event {
    id: number;
    title: string;
    description: string;
    participants: number;
    date: string;
}

var mockData = [
    {
        "id": 1,
        "title": "Community Garden Planting Day",
        "description": "Join us for a day of planting and beautifying our community garden. Bring your gardening gloves and let's grow together!",
        "participants": 30,
        "date": "2023-07-15T09:00:00Z"
    },
    {
        "id": 2,
        "title": "Neighborhood Watch Meeting",
        "description": "Monthly meeting to discuss local safety concerns and strategies. All residents are welcome to attend and contribute.",
        "participants": 25,
        "date": "2023-07-20T19:00:00Z"
    },
    {
        "id": 3,
        "title": "Local Artists Showcase",
        "description": "Celebrate the talent in our community! Local artists will display their work, with live music and refreshments.",
        "participants": 75,
        "date": "2023-07-29T14:00:00Z"
    },
    {
        "id": 4,
        "title": "Summer Block Party",
        "description": "Our annual block party is here! Bring a dish to share, enjoy games, music, and get to know your neighbors better.",
        "participants": 150,
        "date": "2023-08-05T16:00:00Z"
    },
    {
        "id": 5,
        "title": "Community Cleanup Day",
        "description": "Let's keep our neighborhood beautiful! We'll be cleaning up litter in public spaces. Gloves and bags provided.",
        "participants": 40,
        "date": "2023-08-12T10:00:00Z"
    },
    {
        "id": 6,
        "title": "Local Business Networking Event",
        "description": "Connect with other local business owners and entrepreneurs. Share ideas, find collaborations, and grow together.",
        "participants": 50,
        "date": "2023-08-17T18:30:00Z"
    },
    {
        "id": 7,
        "title": "Family Movie Night in the Park",
        "description": "Bring your blankets and snacks for a family-friendly movie under the stars. Movie title to be announced.",
        "participants": 100,
        "date": "2023-08-26T20:00:00Z"
    },
    {
        "id": 8,
        "title": "Community Yoga Class",
        "description": "Start your weekend right with a free yoga class in the park. All levels welcome. Don't forget your yoga mat!",
        "participants": 35,
        "date": "2023-09-02T08:00:00Z"
    },
    {
        "id": 9,
        "title": "Local Food Festival",
        "description": "Taste the best our community has to offer! Local restaurants and home cooks will showcase their signature dishes.",
        "participants": 200,
        "date": "2023-09-09T12:00:00Z"
    },
    {
        "id": 10,
        "title": "Neighborhood Book Club Meeting",
        "description": "Join us for a lively discussion of this month's book selection. New members always welcome!",
        "participants": 15,
        "date": "2023-09-14T19:00:00Z"
    }
]

export default async function EventList() {
    const [events, setEvents] = useState<Event[]>(mockData)

    


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
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
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
    )
}