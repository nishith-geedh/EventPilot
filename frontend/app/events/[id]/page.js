"use client";
import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { FiCalendar } from "react-icons/fi";

export default function EventDetail({ params }) {
  const { id } = params;
  const [ev, setEv] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    API(`/events/${id}`).then(setEv);
  }, [id]);

  const register = async () => {
    setError(null);
    setLoadingRegister(true);
    try {
      const res = await API(`/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id, userId: email, name, email }),
      });
      setTicketUrl(res.ticket.downloadUrl);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoadingRegister(false);
    }
  };

  if (!ev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181B23] to-[#23272F]">
        <p className="text-gray-400 text-lg">Loading event details...</p>
      </div>
    );
  }

  // Format event date nicely
  let formattedDate = "Date TBD";
  if (ev.date) {
    try {
      formattedDate = format(parseISO(ev.date), "EEEE, MMM d, yyyy 'at' h:mm a");
    } catch {
      // fallback
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181B23] to-[#23272F] text-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-[#23272F] rounded-3xl shadow-xl border border-[#353942] overflow-hidden">
        <div
          className="h-72 bg-cover bg-center"
          style={{
            backgroundImage: `url(${ev.bannerUrl || "https://picsum.photos/seed/" + ev.eventId + "/1200/400"})`,
          }}
        />
        <div className="p-8">
          <h1 className="text-4xl font-extrabold mb-2 text-amber-400">{ev.title}</h1>

          <div className="flex items-center text-amber-300 mb-6 space-x-2">
            <FiCalendar size={20} />
            <time className="italic">{formattedDate}</time>
          </div>

          <p className="mb-8 text-gray-300">{ev.description}</p>

          <div className="bg-[#1E222B] rounded-xl p-6 shadow-md border border-[#2E3341]">
            <h3 className="text-2xl font-bold mb-4">Register</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Full Name"
                className="rounded-md bg-[#181B23] border border-[#353942] p-3 text-gray-200 focus:outline-none focus:border-amber-400 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="rounded-md bg-[#181B23] border border-[#353942] p-3 text-gray-200 focus:outline-none focus:border-amber-400 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}

            <button
              onClick={register}
              disabled={loadingRegister}
              className="brutal-btn bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-3 rounded-lg shadow-md transition disabled:opacity-60 w-full md:w-auto"
            >
              {loadingRegister ? "Registering..." : "Register"}
            </button>

            {ticketUrl && (
              <div className="mt-6">
                <a
                  className="brutal-btn bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2 rounded-lg shadow-md inline-block transition"
                  href={ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Ticket PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
