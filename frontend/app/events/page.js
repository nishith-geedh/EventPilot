"use client"
import { useEffect, useState } from "react"
import { API } from "@/lib/api"
import Link from "next/link"

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API("/events").then(setEvents).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Events</h1>
      {loading ? <p>Loading...</p> : (
        <div className="grid md:grid-cols-3 gap-4">
          {events.map(ev => (
            <div key={ev.eventId} className="p-4 brutal-card bg-white">
              <div className="h-40 bg-gray-200 mb-3"
                   style={{ backgroundImage: `url(${ev.bannerUrl || "https://picsum.photos/seed/"+ev.eventId+"/600/300"})`, backgroundSize: "cover" }} />
              <h3 className="text-xl font-bold">{ev.title}</h3>
              <p className="text-sm">{ev.description?.slice(0,100)}</p>
              <Link href={`/events/${ev.eventId}`} className="brutal-btn bg-yellow-300 px-3 py-1 inline-block mt-3">View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
