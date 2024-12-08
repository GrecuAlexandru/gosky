'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AddThreadButton from '@/components/AddThreadButton'
import { ArrowRight } from 'lucide-react'

interface Thread {
  id: number
  title: string
  content: string
  created_at: string
}

export default function ThreadsPage({ params }: { params: Promise<{ id: number }> }) {
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

        const { data, error } = await supabase
          .from('threads_communities')
          .select('*')
          .eq('community_uuid', comId);

        if (error) throw error;

        setThreads(data || []);
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

  return (
    <div className="space-y-8 flex-1 w-full p-6 bg-[#F3F6FF] min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Community Threads</h1>
      <div className="flex justify-start mb-6">
        <AddThreadButton onAddThread={handleAddThread} communityId={communityId ?? 0} />
      </div>
      <div className="space-y-4">
        {loading ? (
          <Card className="p-6">
            <p className="text-center text-[#383838]">Loading threads...</p>
          </Card>
        ) : threads.length > 0 ? (
          threads.map((thread) => (
            <Card
              key={thread.id}
              className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle>{thread.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{thread.content}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Created on: {new Date(thread.created_at).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/threads/${thread.id}`)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="p-6">
            <p className="text-center text-[#383838]">No threads found. Be the first to start a discussion!</p>
          </Card>
        )}
      </div>
    </div>
  );
}

