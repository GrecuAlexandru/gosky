'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

interface ChatPageProps {
    id: string
}

interface Message {
    id: string
    sender: {
        id: string
        name: string
    }
    content: string
    timestamp: string
    isSentByMe: boolean
    isAdmin: boolean
}

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

async function getMessageCommunityId(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('communities')
        .select('messages_communities')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching community data:", error)
        return null
    }

    return data
}

export default function Internal(props: ChatPageProps) {
    const { id } = props
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [communityData, setCommunityData] = useState<{ name: string, icon: string } | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [user, setUser] = React.useState<{ id: string; isAdmin: boolean, username: string, first_name: string, last_name: string } | null>(null)
    const [messagesCommunityId, setMessagesCommunityId] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCommunityData() {
            const data = await getCommunityData(id)
            if (data) {
                setCommunityData(data)
            } else {
                notFound()
            }
        }
        async function fetchMessagesCommunityId() {
            const data = await getMessageCommunityId(id)
            if (data) {
                setMessagesCommunityId(data.messages_communities)
                const supabase = createClient()
                const { data: mData, error: mError } = await supabase
                    .from('messages_communities')
                    .select('messages')
                    .eq('id', data.messages_communities)
                    .single()

                if (mError) {
                    console.error("Error fetching messages:", mError)
                    return
                }

                if (mData) {
                    setMessages(mData.messages)
                }
            } else {
                notFound()
            }
        }
        async function getUser() {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                console.error("Error fetching user:", error)
                return
            }

            setUser({ id: data.user.id, isAdmin: false, username: "", first_name: data.user.user_metadata.full_name, last_name: "" })
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("id, isAdmin, username, first_name, last_name")
                .eq("id", data.user.id)
                .single()

            if (userError) {
                console.error("Error fetching user data:", userError)
                return
            }

            setUser({ id: userData.id, isAdmin: userData.isAdmin, username: userData.username, first_name: userData.first_name, last_name: userData.last_name })

        }

        fetchCommunityData()
        fetchMessagesCommunityId()
        getUser()

    }, [id])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        const supabase = createClient()

        const handleInserts = (payload: any) => {
            console.log('Change received!', payload)
            setMessages((prevMessages) => [...prevMessages, payload.new.message])
        }

        const subscription = supabase
            .channel('messages_communities')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages_communities' }, handleInserts)
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newMessage.trim() && user) {
            const newMsg: Message = {
                id: Date.now().toString(),
                sender: {
                    id: user.id,
                    name: user.first_name + " " + user.last_name,
                },
                content: newMessage,
                timestamp: new Date().toISOString(),
                isSentByMe: true,
                isAdmin: user.isAdmin
            }

            const supabase = createClient()
            const { data, error } = await supabase
                .from('messages_communities')
                .update({ messages: [...messages, newMsg] })
                .eq('id', messagesCommunityId)


            if (error) {
                console.error("Error inserting message:", error)
                return
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
                                        <AvatarImage alt={message.sender.name} />
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
                    <div ref={messagesEndRef} />
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