'use client'

import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { CommunityHeader } from './community-header'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AddThreadButton from '@/components/AddThreadButton'
import { set } from 'react-hook-form'

interface CommunityData {
  id: number
  name: string
  description: string
  threads_uuids: number[]
}

interface Thread {
  id: number
  title: string
  content: string
  created_at: string
}

export default function ThreadsPage({ params }: { params: Promise<{ id: number }> }) {
  const [communityData, setCommunityData] = useState<CommunityData>();
  const [communityId, setCommunityId] = useState<number>();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { id: comId } = await params;
        setCommunityId(comId);

        console.log("Community ID: " + comId);
        const { data: comData, error: comErr } = await supabase
          .from('communities')
          .select('*')
          .eq('id', comId)
          .single();
        
          console.log("Community data: " + comData);
          
          if (!comData || comErr) {
            notFound();
          }
          
        if (comErr) throw comErr;

        setCommunityData(comData);

        if (true) {
          console.log("Threads for community " + comId + ": " + comData.threads_uuids);
          const { data, error } = await supabase
            .from('threads_communities')
            .select('*')
            // .in('id', comData.threads_uuids);

            console.log(data);
            if (error) throw error;

            setThreads(data || []);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);   
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleAddThread = (newThread: Thread) => {
    setThreads((prevThreads) => [...prevThreads, newThread]);
    router.refresh();
  };

  if (loading) {
    return <p className="text-center text-[#383838]">Loading threads...</p>;
  }

  return (
    <div className="space-y-8 flex-1 w-full p-6 bg-[#F3F6FF] min-h-screen">
      <div className="flex justify-end">
        <AddThreadButton onAddThread={handleAddThread} communityId={communityId} threads={threads} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {threads.map((thread) => (
          <Card
            key={thread.id}
            className="bg-white shadow-md rounded-lg flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle>{thread.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{thread.content}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

