import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4">
              Welcome to HoodHub
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with your neighbors, start local events, and build a stronger community right where you live.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">Why HoodHub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon="🏠"
                title="Hyperlocal Connections"
                description="Connect with people in your building, street, or neighborhood."
              />
              <FeatureCard 
                icon="🎉"
                title="Local Events"
                description="Discover and create events happening right in your community."
              />
              <FeatureCard 
                icon="🤝"
                title="Community Support"
                description="Offer or receive help from your neighbors when you need it most."
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LocalVibe. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

