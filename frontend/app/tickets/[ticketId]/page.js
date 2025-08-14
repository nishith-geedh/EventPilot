import { API } from "@/lib/api"

export default async function Ticket({ params }) {
  const data = await API(`/tickets/${params.ticketId}`)
  return (
    <div className="max-w-xl mx-auto brutal-card bg-white p-6">
      <h1 className="text-2xl font-bold mb-2">Your Ticket</h1>
      <p className="mb-4">Ticket ID: {data.ticketId}</p>
      <a href={data.downloadUrl} className="brutal-btn bg-yellow-300 px-3 py-1">Download PDF</a>
    </div>
  )
}
