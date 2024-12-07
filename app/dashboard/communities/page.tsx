import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from 'lucide-react'
import { redirect } from "next/navigation"
import { CommunitiesGrid } from "./communities-grid"

export default async function CommunitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  // Fetch all communities
  const { data: communities, error } = await supabase
    .from('communities')
    .select('id, name, description, city, building, members')

  if (error) {
    console.error('Error fetching communities:', error)
    return <div>Failed to load communities</div>
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <h1>Communities</h1>
        </div>
      </div>
      <CommunitiesGrid communities={communities} userId={user.id} />
    </div>
  )
}