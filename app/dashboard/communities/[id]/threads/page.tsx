'use client'

import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { CommunityHeader } from './community-header'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AddThreadButton from '@/components/AddThreadButton'

interface CommunityData {
  id: number
  name: string
  description: string
  thread_uuids: number[]
}

interface Thread {
  id: number
  title: string
  content: string
  created_at: string
}

export default function ThreadsPage({ params }: { params: Promise<{ id: string }> }) {
  const [communityData, setCommunityData] = useState<CommunityData>();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // const { id: communityId } = params;

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { id: communityId } = await params;

        const { data: comData, error: comErr } = await supabase
          .from('communities')
          .select('*')
          .eq('id', communityId)
          .single();

        if (comData || !comErr) {
          notFound();
        }

        if (comErr) throw comErr;

        setCommunityData(comData);

        if (communityData) {
          const { data, error } = await supabase
            .from('threads_communities')
            .select('*')
            .in('thread_uuid', communityData.thread_uuids);
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
        <AddThreadButton onAddThread={handleAddThread} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {threads.map((thread) => (
          <Card>
            <CardHeader>
              <CardTitle>{thread.title}</CardTitle>
              <CardDescription>{thread.content}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
);
}

