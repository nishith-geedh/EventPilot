"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiBarChart2, FiCalendar, FiChevronDown } from "react-icons/fi";
import EventCarousel from "./components/EventCarousel";

// Real-Time Analytics icon (works everywhere)
const analyticsImg =
  "https://cdn-icons-png.flaticon.com/512/2838/2838735.png";

// FAQ content (detailed as you requested)
const faqs = [
  {
    q: "What is EventPilot?",
    a: (
      <span>
        <b>EventPilot</b> is a modern, cloud-native platform designed to simplify event management from start to finish. Whether you’re organizing a local workshop or a large-scale festival, EventPilot helps you:<br />
        • Build and promote your event<br />
        • Manage registrations and ticketing<br />
        • Monitor real-time analytics and check-ins<br />
        Powered by AWS and real-time technologies, EventPilot ensures your event runs smoothly—no matter the size.<br /><br />
        <b>Empower events. Ignite connections.</b> Your ideas take flight with EventPilot.
      </span>
    )
  },
  {
    q: "How do tickets work?",
    a: (
      <span>
        When someone registers for an event, they instantly receive a <b>PDF ticket</b> with a unique QR code—no email delivery required.<br />
        The ticket appears immediately on the confirmation screen.<br />
        It can be downloaded and saved on any device.<br />
        The QR code allows for fast and secure scanning at the event entrance.<br />
        This eliminates inbox issues and streamlines access for attendees.
      </span>
    )
  },
  {
    q: "Is EventPilot suitable for large events?",
    a: (
      <span>
        Yes. EventPilot is designed to handle events of all sizes—from small gatherings to crowds of <b>50,000+ attendees</b>.<br />
        Behind the scenes:<br />
        • A <b>serverless architecture</b> automatically scales with demand<br />
        • Real-time systems handle check-ins and updates without delay<br />
        • No bottlenecks, even at peak traffic or check-in times<br />
        Whether you're a local startup or an enterprise brand, EventPilot keeps your operations fast and stable.
      </span>
    )
  },
  {
    q: "Can organizers manage their events?",
    a: (
      <span>
        Yes, organizers have full control over their events. Through the EventPilot dashboard, you can:<br />
        • <b>Create and customize</b> new events<br />
        • <b>Edit</b> event details like date, time, or description<br />
        • <b>Delete</b> events as needed<br />
        • <b>View real-time data</b> on registrations and attendance<br />
        Attendees cannot modify their registrations, ensuring consistency and security across all event data.
      </span>
    )
  },
  {
    q: "Does EventPilot support real-time analytics?",
    a: (
      <span>
        Absolutely. EventPilot provides organizers with powerful live dashboards to make data-driven decisions before, during, and after your event.<br /><br />
        You can track key metrics in real time including:<br />
        • Total Registrations<br />
        • Estimated Visits<br />
        • Conversion Rates from Visits to Registrations<br />
        • Active Attendees and Engagement Levels<br />
        • Event Activity Leaderboards to see top-performing events<br />
        • Registrations broken down by Categories<br /><br />
        All updates happen instantly. This gives you immediate insights so you can adapt and improve your events on the fly.
      </span>
    )
  },
];

// Animated FAQ component
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="max-w-2xl mx-auto">
      {faqs.map((item, i) => (
        <div key={i} className="mb-4 rounded-xl overflow-hidden border border-[#353942] bg-[#21242C]">
          <button
            className="flex justify-between w-full px-6 py-4 text-lg font-semibold text-left text-gray-100 focus:outline-none"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            <FiChevronDown
              className={`transform transition-transform duration-300 text-amber-300 ${open === i ? "rotate-180" : ""}`}
              size={24}
            />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 pb-5 text-gray-300 text-base"
              >
                <div>{item.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// Main exported page
export default function Home() {
  // Load events from API (shows only organizer events now)
  const [events, setEvents] = useState([]);
  const [carousel, setCarousel] = useState(0);

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(arr => {
        // Accepts any array of events with "eventId", "title", "date", "img"
        setEvents(Array.isArray(arr) ? arr : []);
      });
  }, []);

  // Responsive font sizes for hero
  const heroTitleClass =
    "font-bold text-center my-6 " +
    "text-xl md:text-2xl lg:text-3xl text-gray-100 drop-shadow";


  const heroTaglineClass =
    "text-base md:text-lg lg:text-xl max-w-2xl text-center text-gray-300 mx-auto mt-2 mb-4 font-medium leading-snug whitespace-pre-line";

  // Carousel controls (works if events present)
  function nextEvent() {
    if (events.length) setCarousel((carousel + 1) % events.length);
  }
  function prevEvent() {
    if (events.length) setCarousel((carousel - 1 + events.length) % events.length);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181B23] via-[#22252C] to-[#23272F] text-gray-100">
      {/* Animated Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-20"
      >
        <div className="pt-12 pb-7 px-4 flex flex-col items-center max-w-5xl mx-auto">

          <span className="flex items-center gap-3 mb-2 mt-1">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180, delay: 0.3 }}
            >
              <FiZap className="text-5xl text-amber-400 drop-shadow-md" />
            </motion.span>
            <span className="text-4xl md:text-5xl font-extrabold text-amber-400 tracking-tight drop-shadow-lg whitespace-nowrap">
              EventPilot
            </span>
          </span>

          <h2 className={heroTitleClass}>
            Empower Events. Ignite Connections.
          </h2>
          <p className={heroTaglineClass}>
            Organize, promote, and analyze your events in real-time.
            {"\n"}Effortless planning, seamless ticketing, and instant analytics.
            {"\n\n"}<span className="text-amber-300 font-semibold">EventPilot is where your ideas take flight.</span>
          </p>
          <motion.img
            src="https://cdn.dribbble.com/userupload/43402343/file/original-c35282b18daa6d3735f39d455a1315e8.png?resize=2400x1925&vertical=center"
            alt="Event management software dashboard illustration"
            className="mt-7 rounded-2xl shadow-xl w-full mx-auto object-cover border border-[#353942]"
            style={{ maxHeight: '350px' }}
            loading="lazy"
            draggable={false}
            initial={{ scale: 0.98, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.25, type: "spring" }}
          />



        </div>
      </motion.div>
      {/* Event carousel: only live events */}

      <EventCarousel events={events} />



      {/* Feature grid */}
      <section className="max-w-7xl mx-auto mb-20 px-4">
        <h3 className="text-3xl font-bold mt-12 mb-12 text-center text-amber-300 drop-shadow">
          Why EventPilot?
        </h3>

        <div className="grid md:grid-cols-3 gap-10 text-center text-gray-300">
          <div className="bg-[#23272F] p-8 rounded-xl shadow-lg border border-[#353942] hover:scale-105 transition">
            <img
              src={analyticsImg}
              alt="Real-time dashboard analytics"
              className="mx-auto mb-5"
              width={70}
              height={70}
              draggable={false}
              loading="lazy"
            />
            <h4 className="text-xl font-semibold mb-2 text-amber-400">
              Real-Time Analytics
            </h4>
            <p>Get instant insights to make smart decisions and maximize event success.</p>
          </div>
          <div className="bg-[#23272F] p-8 rounded-xl shadow-lg border border-[#353942] hover:scale-105 transition">
            <img
              src="https://img.icons8.com/ios-filled/100/06D6A0/qr-code.png"
              alt="Seamless Ticketing"
              className="mx-auto mb-5"
              width={70}
              height={70}
              draggable={false}
              loading="lazy"
            />
            <h4 className="text-xl font-semibold mb-2 text-green-400">Seamless Ticketing</h4>
            <p>Automate registrations and ticket distribution with secure QR codes.</p>
          </div>
          <div className="bg-[#23272F] p-8 rounded-xl shadow-lg border border-[#353942] hover:scale-105 transition">
            <img
              src="https://img.icons8.com/ios-filled/100/EF476F/cloud.png"
              alt="Built on AWS Cloud"
              className="mx-auto mb-5"
              width={70}
              height={70}
              draggable={false}
              loading="lazy"
            />
            <h4 className="text-xl font-semibold mb-2 text-pink-400">Scalable & Secure</h4>
            <p>Built on AWS for optimal performance, security, and scalability.</p>
          </div>
        </div>
      </section>

      {/* Example Stats Section */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 px-4 mb-20">
        {[
          { label: "Tickets Issued", val: "5,000+", color: "text-amber-300" },
          { label: "Serverless Uptime", val: "99.9%", color: "text-green-300" },
          { label: "Live Analytics", val: "24/7", color: "text-blue-300" }
        ].map((s, i) => (
          <div
            key={s.label}
            className={`bg-[#1C1F26] rounded-2xl p-8 text-center shadow-lg border border-[#23272F] hover:scale-105 transition-transform`}
          >
            <div className={`text-4xl font-extrabold mb-3 ${s.color}`}>{s.val}</div>
            <div className="text-gray-400 font-semibold text-lg">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FAQ accordion */}
      <section className="max-w-4xl mx-auto mb-24">
        <h3 className="text-3xl font-bold mb-10 text-center text-blue-300">FAQ</h3>
        <FAQ />
      </section>

      {/* Modern color footer with gradient and bold CTA */}
      <footer className="relative">
        <div className="w-full bg-gradient-to-r from-[#FFD166] via-[#00C49F] to-[#0066FF] py-12 px-2">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl md:text-2xl font-extrabold text-[#23272F] flex-1 text-center md:text-left">
              Discover new events, manage your own, and ignite connections with EventPilot.
            </div>
            <Link
              href="/events"
              className="bg-[#23272F] text-amber-300 text-lg font-bold mt-5 md:mt-0 px-8 py-3 rounded-2xl shadow hover:brightness-110 transition"
            >
              <FiCalendar className="inline mr-2 text-xl align-top" />
              Discover New Events
            </Link>
          </div>
        </div>
        <div className="bg-[#21242C] py-5 flex flex-col items-center border-t border-[#353942]">
          <div className="mb-2 font-semibold text-gray-400"> &copy; {new Date().getFullYear()} EventPilot - All Rights Reserved. </div> <div className="flex gap-2 text-xs text-gray-400"> <span className="text-green-400 font-semibold">Seamlessly powered by AWS</span> <span className="font-bold">|</span> <span className="text-blue-400">Cloud-native • Made with ❤️</span> </div>
        </div>
      </footer>
    </div>
  );
}
