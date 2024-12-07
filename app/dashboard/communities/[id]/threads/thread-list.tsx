import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ThreadListProps {
    communityId: string
}

export function ThreadList({ communityId }: ThreadListProps) {
    // This is a mock function. In a real application, you would fetch this data from your backend.
    const threads = [
        { id: 1, title: 'Welcome to the community!', author: 'Admin' },
        { id: 2, title: 'Best practices for responsive design', author: 'WebDev123' },
        { id: 3, title: 'How to optimize database queries?', author: 'DataGuru' },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Threads</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {threads.map((thread) => (
                        <li key={thread.id} className="p-2 bg-secondary rounded">
                            <h3 className="font-semibold">{thread.title}</h3>
                            <p className="text-sm text-muted-foreground">by {thread.author}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

