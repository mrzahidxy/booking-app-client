import { Card, CardContent } from "@/components/ui/card"
import { Clock } from 'lucide-react'

const recentSearches = [
  "Paris hotels",
  "New York restaurants",
  "London attractions",
  "Tokyo things to do",
]

export function RecentSearches() {
  return (
    <section className="py-8">
      <div className="container">
        <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {recentSearches.map((search) => (
            <Card key={search} className="min-w-[200px] cursor-pointer hover:bg-accent">
              <CardContent className="flex items-center gap-2 p-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{search}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

