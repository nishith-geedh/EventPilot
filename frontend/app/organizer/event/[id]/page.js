"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Registrants({ params }) {
  const { id: eventId } = params;

  const { data: session, status } = useSession();

  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [eventName, setEventName] = useState("");

  // Fetch events metadata & get current event for title
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.ok ? res.json() : [])
      .then((events) => {
        if (Array.isArray(events)) {
          const currentEvent = events.find((ev) => ev.eventId === eventId);
          setEventName(currentEvent ? currentEvent.title : "");
        }
      })
      .catch(() => setEventName(""));
  }, [eventId]);

  // Fetch registrants
  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    setErrorMsg(null);
    fetch(`/api/event-registrants?eventId=${encodeURIComponent(eventId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch registrants");
        return res.json();
      })
      .then((data) => {
        setRegistrants(data.registrants || []);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message || "Error loading registrants");
        setLoading(false);
      });
  }, [eventId]);

  // Download as CSV
  function exportCSV() {
    if (!registrants.length) return;
    const header = [
      "Registration ID",
      "Name",
      "Email",
      "Registered At",
      "User ID"
    ];
    const rows = registrants.map((r) => [
      r.registrationId || "",
      r.name || "",
      r.email || "",
      r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
      r.userId || ""
    ]);
    const csvContent = [header, ...rows]
      .map((row) => row.map(
        (cell) => `"${(cell ?? "").toString().replace(/"/g, '""')}"`
      ).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `registrants-${eventId}.csv`);
    a.click();
    URL.revokeObjectURL(url);
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F] text-gray-200">
        <div className="bg-[#23272F] px-10 py-8 rounded-xl shadow border border-[#353942] font-semibold text-xl">
          Loading registrant data...
        </div>
      </div>
    );
  }

  if (!session || !session.groups || !session.groups.includes("organizer")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F] text-red-500 font-bold text-xl">
        Access denied: Organizer role required.
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F] text-yellow-400 font-semibold text-lg">
        Error: {errorMsg}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181B23] to-[#23272F] text-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/organizer"
          className="text-sm text-blue-400 mb-6 inline-block hover:underline"
        >
          &larr; Back to Organizer Dashboard
        </Link>
        {/* EVENT NAME */}
        {eventName && (
          <h2 className="text-xl font-semibold text-gray-400 mb-2">{eventName}</h2>
        )}
        <h1 className="text-3xl font-extrabold text-amber-300 mb-6">
          Event Registrants
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-400">
            {registrants.length} registrant{registrants.length !== 1 ? "s" : ""}
          </div>
          {registrants.length > 0 && (
            <button
              onClick={exportCSV}
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2 rounded-md shadow transition"
              aria-label="Download registrants CSV"
              title="Download registrants CSV"
            >
              Download CSV
            </button>
          )}
        </div>
        {registrants.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-lg">
            No registrants found for this event yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#353942] shadow-lg">
            <table className="min-w-full divide-y divide-[#383c45] text-left">
              <thead className="bg-[#23272F]">
                <tr>
                  <th className="px-5 py-3 font-semibold text-gray-300">Registration ID</th>
                  <th className="px-5 py-3 font-semibold text-gray-300">Name</th>
                  <th className="px-5 py-3 font-semibold text-gray-300">Email</th>
                  <th className="px-5 py-3 font-semibold text-gray-300">Registered At</th>
                  <th className="px-5 py-3 font-semibold text-gray-300">User ID</th>
                </tr>
              </thead>
              <tbody className="bg-[#1C1F26] divide-y divide-[#353942]">
                {registrants.map((r) => (
                  <tr key={r.registrationId}>
                    <td className="px-5 py-4">{r.registrationId || "-"}</td>
                    <td className="px-5 py-4">{r.name || "-"}</td>
                    <td className="px-5 py-4 text-amber-300">{r.email || "-"}</td>
                    <td className="px-5 py-4">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</td>
                    <td className="px-5 py-4">{r.userId || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
