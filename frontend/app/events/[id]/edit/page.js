"use client";
import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { parseISO, formatISO } from "date-fns";

export default function EditEvent() {
  const router = useRouter();
  const pathname = usePathname();
  // Extract eventId from pathname "/events/[eventId]/edit"
  const eventId = pathname?.split("/")[2];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // Load existing event data
  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    API(`/events/${eventId}`)
      .then((ev) => {
        setTitle(ev.title || "");
        setDescription(ev.description || "");
        setCategory(ev.category || "general");
        setBannerUrl(ev.bannerUrl || "");
        // Format ISO string for datetime-local input
        if (ev.date) {
          const parsedDate = parseISO(ev.date);
          setDate(formatISO(parsedDate, { representation: "date" }) + "T" + ev.date.split("T")[1]);
        }
      })
      .catch((e) => setError(e.message || "Failed to load event data"))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!date) {
      setError("Date and time are required.");
      return;
    }

    setSaving(true);
    try {
      await API(`/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          date,
          category: category.trim() || "general",
          bannerUrl: bannerUrl.trim(),
        }),
      });
      router.push(`/events/${eventId}`);
    } catch (e) {
      setError(e.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181B23] to-[#23272F]">
        <p className="text-gray-400 text-lg">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181B23] to-[#23272F] flex justify-center px-4 py-12 text-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-[#23272F] p-10 rounded-3xl shadow-xl border border-[#353942]"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-amber-400 text-center">Edit Event</h1>

        <label className="block mb-2 font-semibold" htmlFor="title">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-6 p-3 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none text-gray-200 transition"
          required
          placeholder="Enter event title"
        />

        <label className="block mb-2 font-semibold" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full mb-6 p-3 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none text-gray-200 transition resize-none"
          placeholder="Describe your event"
        />

        <label className="block mb-2 font-semibold" htmlFor="date">
          Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-6 p-3 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none text-gray-200 transition"
          required
        />

        <label className="block mb-2 font-semibold" htmlFor="category">
          Category
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-6 p-3 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none text-gray-200 transition"
          placeholder="e.g., Music, Conference"
        />

        <label className="block mb-2 font-semibold" htmlFor="bannerUrl">
          Banner URL
        </label>
        <input
          id="bannerUrl"
          type="url"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          className="w-full mb-6 p-3 rounded-md bg-[#181B23] border border-[#353942] focus:border-amber-400 outline-none text-gray-200 transition"
          placeholder="https://example.com/banner.jpg"
        />

        {error && <p className="text-red-500 mb-6 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="brutal-btn w-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold px-6 py-3 rounded-lg shadow-lg text-lg transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
