"use client";
import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { useSession } from "next-auth/react";

export default function Events() {
  const { data: session, status } = useSession();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isOrganizer = session?.groups?.includes("organizer");

  // Load events
  const loadEvents = () => {
    setLoading(true);
    API("/events")
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error("Failed to load events:", e);
        setError(e.message || "Failed to load events.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (status !== "loading" && session) {
      loadEvents();
    }
  }, [status, session]);

  // Handle event deletion
  const handleDelete = async (eventId) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }
    setDeletingId(eventId);
    try {
      await API(`/events/${eventId}`, { method: "DELETE" });
      loadEvents();
    } catch (e) {
      alert("Failed to delete event: " + (e.message || "Unknown error"));
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181B23] to-[#23272F]">
        <p className="text-gray-400 text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F] px-4">
        <div className="bg-[#23272F] px-10 py-6 rounded-2xl shadow border border-[#353942] text-gray-200 text-xl font-bold max-w-md text-center">
          Please log in to view the ongoing/upcoming events.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#191D24] text-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8">Events</h1>

        {/* Show Create Event button only for organizers */}
        {isOrganizer && (
          <Link
            href="/events/create"
            className="brutal-btn bg-green-500 hover:bg-green-400 text-black px-5 py-3 mb-10 inline-block rounded-lg shadow-lg text-xl font-bold transition"
          >
            + Create Event
          </Link>
        )}

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <p className="text-gray-400">No events yet. Be the first to create one!</p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((ev) => {
              const eventDate = ev.date
                ? format(parseISO(ev.date), "MMM d, yyyy, h:mm a")
                : "Date TBD";

              return (
                <div
                  key={ev.eventId}
                  className="bg-[#23272F] max-w-md w-full rounded-3xl shadow-2xl border border-[#353942] p-6 flex flex-col min-h-[470px] mx-auto"
                >
                  <div
                    className="h-56 mb-6 rounded-xl bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${ev.bannerUrl || "https://via.placeholder.com/600x300?text=No+Banner"})`,
                    }}
                  />
                  <h3 className="text-xl font-extrabold text-amber-400 mb-1">{ev.title}</h3>
                  <p className="text-gray-300 italic mb-3">{eventDate}</p>
                  <p className="text-gray-200 text-base flex-grow mb-4">{ev.description?.slice(0, 120)}</p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/events/${ev.eventId}`}
                      className="brutal-btn bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2 rounded-lg shadow font-bold text-base transition inline-block"
                      style={{ width: "fit-content" }}
                    >
                      View
                    </Link>

                    {/* Show edit/delete buttons only for organizers */}
                    {isOrganizer && (
                      <>
                        <Link
                          href={`/events/${ev.eventId}/edit`}
                          className="brutal-btn bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-lg shadow font-bold text-base transition inline-block"
                          style={{ width: "fit-content" }}
                        >
                          Edit
                        </Link>
                        <button
                          disabled={deletingId === ev.eventId}
                          onClick={() => handleDelete(ev.eventId)}
                          className="brutal-btn bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg shadow font-bold text-base transition"
                          style={{ width: "fit-content" }}
                        >
                          {deletingId === ev.eventId ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
