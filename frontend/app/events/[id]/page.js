"use client"
import { useEffect, useState } from "react"
import { API } from "@/lib/api"

export default function EventDetail({ params }) {
  const { id } = params
  const [ev, setEv] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [ticketUrl, setTicketUrl] = useState("")

  useEffect(() => {
    API(`/events/${id}`).then(setEv)
  }, [id])

  const register = async () => {
    const res = await API(`/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id, userId: email, name, email })
    })
    setTicketUrl(res.ticket.downloadUrl)
  }

  if (!ev) return <p>Loading...</p>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="h-72 brutal-card bg-white mb-4"
           style={{ backgroundImage: `url(${ev.bannerUrl || "https://picsum.photos/seed/"+ev.eventId+"/1200/400"})`, backgroundSize: "cover" }} />
      <h1 className="text-3xl font-bold mb-2">{ev.title}</h1>
      <p className="mb-6">{ev.description}</p>

      <div className="brutal-card bg-white p-4">
        <h3 className="font-bold mb-2">Register</h3>
        <div className="grid md:grid-cols-2 gap-2">
          <input placeholder="Full Name" className="border p-2" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" className="border p-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <button onClick={register} className="brutal-btn bg-green-300 px-4 py-2 mt-3">Register</button>

        {ticketUrl && (
          <div className="mt-4">
            <a className="brutal-btn bg-yellow-300 px-3 py-1" href={ticketUrl} target="_blank">Download Ticket PDF</a>
          </div>
        )}
      </div>
    </div>
  )
}
