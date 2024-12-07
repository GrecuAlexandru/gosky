'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

interface ChatPageProps {
    params: {
        id: string
    }
}

interface Message {
    id: string
    sender: {
        id: string
        name: string
        avatar: string
    }
    content: string
    timestamp: string
    isSentByMe: boolean
}

const initialMessages: Message[] = [
    {
        id: "1",
        sender: {
            id: "user1",
            name: "Sarah",
            avatar: "/placeholder.svg?height=40&width=40"
        },
        content: "Hey Alex! How's it going?",
        timestamp: "2023-12-07T14:30:00Z",
        isSentByMe: false
    },
    {
        id: "2",
        sender: {
            id: "user2",
            name: "Alex",
            avatar: "/placeholder.svg?height=40&width=40"
        },
        content: "Hi Sarah! I'm doing great, thanks for asking. How about you?",
        timestamp: "2023-12-07T14:32:00Z",
        isSentByMe: true
    },
    {
        id: "3",
        sender: {
            id: "user1",
            name: "Sarah",
            avatar: "/placeholder.svg?height=40&width=40"
        },
        content: "I'm good too! Just working on some new projects. Anything exciting on your end?",
        timestamp: "2023-12-07T14:35:00Z",
        isSentByMe: false
    },
    {
        id: "4",
        sender: {
            id: "user2",
            name: "Alex",
            avatar: "/placeholder.svg?height=40&width=40"
        },
        content: "Actually, yes! I'm learning about AI and machine learning. It's fascinating stuff!",
        timestamp: "2023-12-07T14:38:00Z",
        isSentByMe: true
    }
]

async function getCommunityData(id: string) {
    console.log("id", id)
    const supabase = createClient()
    const { data, error } = await supabase
        .from('communities')
        .select('name, icon')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching community data:", error)
        return null
    }

    return data
}

export default function Internal(props: ChatPageProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [communityData, setCommunityData] = useState<{ name: string, icon: string } | null>(null)

    useEffect(() => {
        async function fetchCommunityData() {
            const data = await getCommunityData(params.id)
            if (data) {
                setCommunityData(data)
            } else {
                notFound()
            }
        }
        fetchCommunityData()
    }, [params.id])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (newMessage.trim()) {
            const newMsg: Message = {
                id: Date.now().toString(),
                sender: {
                    id: "user2",
                    name: "Alex",
                    avatar: "/placeholder.svg?height=40&width=40"
                },
                content: newMessage,
                timestamp: new Date().toISOString(),
                isSentByMe: true
            }
            setMessages([...messages, newMsg])
            setNewMessage('')
        }
    }

    if (!communityData) {
        return <div>Loading...</div>
    }

    return (
        <div className="h-screen w-full flex flex-col bg-gray-100">
            <header className="bg-white shadow-sm py-4 px-6 flex items-center space-x-2">
                <span className="text-2xl">{communityData.icon}</span>
                <h1 className="text-2xl font-bold">{communityData.name}</h1>
            </header>
            <ScrollArea className="flex-grow p-6">
                <div className="w-full mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isSentByMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start space-x-2 max-w-[70%] ${message.isSentByMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {!message.isSentByMe && (
                                    <Avatar>
                                        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                                        <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <Card className={`${message.isSentByMe ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                                    <CardContent className="p-3">
                                        <p className="text-sm font-semibold mb-1">{message.sender.name}</p>
                                        <p className="text-sm">{message.content}</p>
                                        <p className={`text-xs mt-1 ${message.isSentByMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 p-4 bg-white border-t">
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow"
                />
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                </Button>
            </form>
        </div>
    )
}