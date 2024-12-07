import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CommunityHeader } from './community-header'
import { GeneralChat } from './general-chat'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface CommunityPageProps {
    params: { id: string }
}



async function getCommunityData(id: string) {
    const supabase = createClient()
    console.log("id", id)
    const { data, error } = await supabase
        .from('communities')
        .select('name, description, icon')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching community data:", error)
        return null
    }

    return data
}

export default async function CommunityPage({ params }: CommunityPageProps) {
    const communityData = await getCommunityData(params.id)

    // if (!communityData) {
    //     notFound()
    // }

    if (!communityData) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <CommunityHeader
                title={communityData.name}
                description={communityData.description}
                icon={communityData.icon}
            />
            <div className="mt-8 grid gap-8 md:grid-cols-2">
                <h2 className="text-2xl font-bold mb-4">General Chat</h2>
                <GeneralChat communityId={params.id} />
            </div>
        </div>
    )
}