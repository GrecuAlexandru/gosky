import EventList from '@/components/eventlist'

export default function EventsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
            <EventList />
        </div>
    )
}

