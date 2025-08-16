"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FiUserCheck, FiUsers, FiPercent, FiActivity } from "react-icons/fi";
import Link from "next/link";

// Color palette for charts
const pieColors = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#5DADE2"
];

// Modern dark-mode tooltip for Bar/Line/Pie
function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#181B23] px-4 py-2 rounded-md shadow text-gray-100 border border-[#353942]">
        {label && <div className="font-semibold mb-1">{label}</div>}
        {payload.map((pl, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: pl.color }}
            />
            <span>{pl.name}: </span>
            <span className="font-bold">{pl.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function Stat({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-[#23272F] rounded-lg p-6 border border-[#383c45] text-center shadow flex flex-col items-center gap-2">
      {Icon && <Icon size={28} className={color || "text-amber-300"} />}
      <div className="text-md text-gray-300">{label}</div>
      <div className={`text-3xl font-extrabold ${color || "text-amber-300"}`}>{value}</div>
    </div>
  );
}

function ProgressBar({ value, max, color, height = 18, label }) {
  const pct = !max || !value ? 0 : Math.round((value / max) * 100);
  return (
    <div className="w-full mb-2">
      {label && <div className="mb-1 text-sm text-gray-400">{label}</div>}
      <div
        className="rounded-full bg-[#353942] relative overflow-hidden"
        style={{ height }}
      >
        <div
          className="rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: color,
            height: "100%",
            minWidth: pct > 0 ? 18 : 0
          }}
        ></div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-100">
          {pct}%
        </span>
      </div>
    </div>
  );
}

function NoAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F] px-4">
      <div className="bg-[#23272F] rounded-2xl shadow-xl border-l-4 border-red-500 p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
        <p className="text-gray-200 mb-4">
          You do not have access to the organizer dashboard.
        </p>
        <p className="text-gray-400 text-sm">
          If you believe this is a mistake, contact your administrator.
        </p>
      </div>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F] px-4">
      <div className="bg-[#23272F] rounded-2xl shadow-xl border-l-4 border-yellow-400 p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">Something Went Wrong</h2>
        <p className="text-gray-200 mb-2">{message}</p>
      </div>
    </div>
  );
}

export default function Organizer() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [eventMeta, setEventMeta] = useState([]);
  const [error, setError] = useState(null);

  // Live fetch dashboard data
  useEffect(() => {
    if (session && session.groups && session.groups.includes("organizer")) {
      API("/analytics")
        .then(setData)
        .catch((e) => setError(e.message || "Failed to fetch analytics"));
    }
  }, [session]);
  useEffect(() => {
    API("/events")
      .then((arr) => setEventMeta(Array.isArray(arr) ? arr : []))
      .catch(() => setEventMeta([]));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F]">
        <div className="bg-[#23272F] px-10 py-6 rounded-2xl shadow border border-[#353942] text-gray-200 text-xl font-bold">
          Checking authentication...
        </div>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F]">
        <div className="bg-[#23272F] px-10 py-6 rounded-2xl shadow border border-[#353942] text-gray-200 text-xl font-bold">
          Please log in to access the organizer dashboard.
        </div>
      </div>
    );
  }
  if (!session.groups || !session.groups.includes("organizer")) return <NoAccess />;
  if (error) return <ErrorBox message={error} />;
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1e25] to-[#23272F]">
        <div className="bg-[#23272F] px-10 py-6 rounded-2xl shadow border border-[#353942] text-gray-200 text-xl font-bold">
          Loading analytics...
        </div>
      </div>
    );
  }

  // Current only events
  const eventIdSet = new Set(eventMeta.map(ev => ev.eventId));
  const eventTitles = {};
  eventMeta.forEach(ev => {
    eventTitles[ev.eventId] = ev.title || ev.eventId.slice(0, 8) + "...";
  });

  // ---- Registrations per Event ----
  const perEventData = Object.entries(data.perEvent || {})
    .filter(([eventId]) => eventIdSet.has(eventId))
    .map(([eventId, count]) => ({
      eventId,
      title: eventTitles[eventId],
      count
    }))
    .sort((a, b) => b.count - a.count);

  // ---- Registrations by Category ----
  const mergedCategories = {};
  for (const [eventId, count] of Object.entries(data.perEvent || {})) {
    if (!eventIdSet.has(eventId)) continue;
    const event = eventMeta.find(ev => ev.eventId === eventId);
    const category = (event && event.category && event.category !== "unknown")
      ? event.category
      : "Other";
    mergedCategories[category] = (mergedCategories[category] || 0) + (count || 0);
  }
  const catData = Object.entries(mergedCategories)
    .filter(([name, value]) => value > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // ---- Conversion Progress ----
  const progress = data.conversion !== undefined ? Math.round(data.conversion * 100) : null;

  // ---- Visits to Registrations Funnel ----
  const funnel = [
    { name: "Visits", value: data.visits ?? 0 },
    { name: "Total Registrations", value: data.totalRegs ?? 0 },
    { name: "Active Attendees", value: data.activeAttendees ?? 0 }
  ];

  // ---- Registered vs Active ----
  const raData = [
    { name: "Registered", value: data.totalRegs ?? 0 },
    { name: "Active", value: data.activeAttendees ?? 0 }
  ];

  // ---- Events List at Top with "View Registrants" buttons ----
  const organizerEvents = eventMeta.length > 0 ? (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-amber-300 mb-3">Your Events</h2>
      <div className="grid gap-5">
        {eventMeta.map(event => (
          <div
            key={event.eventId}
            className="bg-[#23272F] rounded-xl border border-[#353942] shadow flex justify-between items-center px-6 py-5"
          >
            <span className="text-lg font-semibold text-gray-100">{event.title}</span>
            <Link
              href={`/organizer/event/${event.eventId}`}
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2 rounded-lg transition shadow"
            >
              View Registrants
            </Link>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1e25] to-[#23272F] text-gray-100 py-12 px-2">
      <div className="max-w-7xl mx-auto grid gap-10">

        {/* EVENTS WITH 'VIEW REGISTRANTS' BUTTONS */}
        {organizerEvents}

        {/* STATISTICS */}
        <div className="bg-[#23272F] rounded-2xl shadow-2xl border border-[#353942] p-8 mb-2">
          <h2 className="text-3xl font-extrabold mb-5 text-amber-400 text-center">At a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat label="Total Registrations" icon={FiUsers} value={data.totalRegs ?? "-"} color="text-amber-300" />
            <Stat label="Estimated Visits" icon={FiUserCheck} value={data.visits ?? "-"} color="text-blue-300" />
            <Stat
              label="Conversion"
              icon={FiPercent}
              value={progress !== null ? `${progress}%` : "-"}
              color="text-orange-300"
            />
            <Stat label="Active Attendees" icon={FiActivity} value={data.activeAttendees ?? "-"} color="text-green-300" />
          </div>
        </div>

        {/* CONVERSION RATE PROGRESS */}
        <div className="bg-[#23272F] rounded-2xl border border-[#353942] p-6 mb-2">
          <h3 className="text-xl font-bold mb-2 text-orange-200">Conversion Rate</h3>
          <ProgressBar value={data.totalRegs} max={data.visits} color="#FFBB28" label="Visits → Total Registrations" />
        </div>

        {/* VISITS → REGIST/ACTIVE (FUNNEL) */}
        <div className="bg-[#23272F] rounded-2xl border border-[#353942] p-6">
          <h3 className="text-xl font-bold mb-2 text-blue-200">Visitor to Engagement Funnel</h3>
          <BarChart width={500} height={220} data={funnel}>
            <CartesianGrid strokeDasharray="3 3" stroke="#383c45" />
            <XAxis dataKey="name" tick={{ fill: "#B1B6C9" }} />
            <YAxis tick={{ fill: "#B1B6C9" }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" fill="#00C49F" radius={[8,8,0,0]} />
          </BarChart>
        </div>

        {/* EVENT ACTIVITY LEADERBOARD */}
        <div className="bg-[#23272F] rounded-2xl shadow-xl border border-[#353942] p-8">
          <h3 className="text-2xl font-bold mb-5 text-fuchsia-300">Event Activity Leaderboard</h3>
          {perEventData.length > 0 ? (
            <div className="overflow-x-auto">
              <BarChart width={700} height={320} data={perEventData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#383c45" />
                <XAxis dataKey="title" tick={{ fill: "#B1B6C9" }} />
                <YAxis tick={{ fill: "#B1B6C9" }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill="#A569BD" radius={[10, 10, 0, 0]} />
              </BarChart>
            </div>
          ) : (
            <p className="text-gray-400 text-lg text-center">No registration data yet. Add an event!</p>
          )}
        </div>

        {/* BAR: Registered vs Active Attendees */}
        <div className="bg-[#23272F] rounded-2xl border border-[#353942] p-6">
          <h3 className="text-xl font-bold mb-2 text-green-200">Engagement Dropoff</h3>
          <BarChart width={320} height={220} data={raData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#383c45" />
            <XAxis dataKey="name" tick={{ fill: "#B1B6C9" }} />
            <YAxis tick={{ fill: "#B1B6C9" }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" fill="#2DC46F" radius={[8,8,0,0]} />
          </BarChart>
        </div>

        {/* REGISTRATIONS BY CATEGORY */}
        <div className="bg-[#23272F] rounded-2xl shadow-xl border border-[#353942] p-8">
          <h3 className="text-2xl font-bold mb-5 text-green-300">Registrations by Category</h3>
          {catData.length > 0 ? (
            <div className="flex items-center flex-col md:flex-row md:justify-start gap-8">
              <PieChart width={380} height={320}>
                <Pie
                  data={catData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {catData.map((entry, idx) => (
                    <Cell key={entry.name} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ color: "#B1B6C9" }} />
              </PieChart>
              <div>
                {catData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                    />
                    <span className="text-gray-200">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-lg text-center">No category data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
