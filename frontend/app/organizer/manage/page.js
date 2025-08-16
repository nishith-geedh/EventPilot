"use client"
import { useState } from "react"
import { API } from "@/lib/api"

export default function Manage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("general")
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerUrl, setBannerUrl] = useState("")

  const uploadBanner = async () => {
    if (!bannerFile) return
    const { uploadUrl, publicUrl } = await API("/presign/banner", { method: "POST", body: JSON.stringify({ contentType: bannerFile.type }) })
    await fetch(uploadUrl, { method: "PUT", body: bannerFile, headers: { "Content-Type": bannerFile.type } })
    setBannerUrl(publicUrl)
  }

  const createEvent = async () => {
    const res = await API("/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, date, category, organizerId: "ORG-001", bannerUrl })
    })
    alert("Created event " + res.eventId)
  }

  return (
    <div className="max-w-2xl mx-auto brutal-card bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <div className="grid gap-2">
        <input className="border p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="border p-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="border p-2" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <select className="border p-2" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="general">General</option>
          <option value="music">Music</option>
          <option value="tech">Tech</option>
          <option value="workshop">Workshop</option>
        </select>

        <div className="border-dashed border-2 p-6 text-center">
          <input type="file" onChange={(e)=>setBannerFile(e.target.files?.[0] || null)} />
          <button onClick={uploadBanner} className="brutal-btn bg-blue-300 px-3 py-1 mt-2">Upload Banner</button>
          {bannerUrl && <p className="text-sm mt-2">Uploaded: {bannerUrl}</p>}
        </div>

        <button onClick={createEvent} className="brutal-btn bg-green-300 px-4 py-2">Create</button>
      </div>
    </div>
  )
}
