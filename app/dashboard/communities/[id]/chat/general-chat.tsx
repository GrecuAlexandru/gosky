'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

interface GeneralChatProps {
    communityId: string
}

export function GeneralChat({ communityId }: GeneralChatProps) {
    const [messages, setMessages] = useState<string[]>([])
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, newMessage])
            setNewMessage('')
        }
    }

    return (
        <Card className="h-[400px] flex flex-col">
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full">
                    {messages.map((message, index) => (
                        <div key={index} className="mb-2 p-2 bg-secondary rounded">
                            {message}
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow"
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </CardFooter>
        </Card>
    )
}

