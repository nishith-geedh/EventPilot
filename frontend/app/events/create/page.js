"use client";
import { useState } from "react";
import { API } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("general");
  const [bannerUrl, setBannerUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await API("/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          category,
          organizerId: "test-organizer", // Automate later as needed
          bannerUrl,
        }),
      });
      router.push("/events");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181B23] to-[#23272F] flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full bg-[#23272F] rounded-3xl shadow-xl border border-[#353942] p-10 text-gray-100"
      >
        <h1 className="text-3xl font-extrabold mb-8 text-amber-400 text-center">Create New Event</h1>

        <label className="block mb-2 font-semibold">Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-6 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none transition"
          placeholder="Event title"
        />

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-3 mb-6 rounded-md bg-[#181B23] border border-[#353942] text-gray-300 focus:border-amber-400 outline-none transition resize-none"
          placeholder="Brief description of your event"
        />

        <label className="block mb-2 font-semibold">Date (ISO format) <span className="text-red-500">*</span></label>
        <input
          type="datetime-local"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 mb-6 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none transition"
        />

        <label className="block mb-2 font-semibold">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-6 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none transition"
          placeholder="e.g., Music, Conference, Workshop"
        />

        <label className="block mb-2 font-semibold">Banner URL (optional)</label>
        <input
          type="url"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          className="w-full p-3 mb-6 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none transition"
          placeholder="https://example.com/banner.jpg"
        />

        {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="brutal-btn w-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold px-6 py-3 rounded-lg shadow-lg text-lg transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
