"use client"
import { useEffect, useState } from "react"
import { API } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"

export default function Organizer() {
  const [data, setData] = useState(null)
  useEffect(() => { API("/analytics").then(setData) }, [])

  if (!data) return <p>Loading analytics...</p>

  const perEventData = Object.entries(data.perEvent).map(([eventId, count]) => ({ eventId, count }))
  const scansData = Object.entries(data.scans).map(([day, scans]) => ({ day, scans }))
  const catData = Object.entries(data.categories).map(([name, value]) => ({ name, value }))

  return (
    <div className="grid gap-6">
      <div className="p-4 brutal-card bg-white">
        <h2 className="text-2xl font-bold mb-2">At a Glance</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          <Stat label="Total Registrations" value={data.totalRegs} />
          <Stat label="Estimated Visits" value={data.visits} />
          <Stat label="Conversion" value={`${(data.conversion*100).toFixed(1)}%`} />
          <Stat label="Active Attendees" value={data.activeAttendees} />
        </div>
      </div>

      <div className="p-4 brutal-card bg-white">
        <h3 className="text-xl font-bold mb-3">Registrants per Event</h3>
        <BarChart width={800} height={320} data={perEventData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="eventId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </div>

      <div className="p-4 brutal-card bg-white">
        <h3 className="text-xl font-bold mb-3">Ticket Scans Over Time</h3>
        <LineChart width={800} height={320} data={scansData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="scans" />
        </LineChart>
      </div>

      <div className="p-4 brutal-card bg-white">
        <h3 className="text-xl font-bold mb-3">Registrations by Category</h3>
        <PieChart width={500} height={320}>
          <Pie data={catData} dataKey="value" nameKey="name" outerRadius={120} label />
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-4 border">
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-extrabold">{value}</div>
    </div>
  )
}
