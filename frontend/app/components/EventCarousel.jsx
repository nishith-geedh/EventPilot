import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";


// Example placeholder for analyticsImg
const analyticsImg = "https://via.placeholder.com/340x200?text=No+Image";

export default function EventCarousel({ events }) {
    const [carousel, setCarousel] = useState(0);

    // Auto-advance every 3 seconds
    useEffect(() => {
        if (events.length < 2) return;
        const interval = setInterval(() => {
            setCarousel((prev) => (prev === events.length - 1 ? 0 : prev + 1));
        }, 5000); // <-- 5000 ms means 5 seconds
        return () => clearInterval(interval);
    }, [events]);


    // Arrow navigation
    const prevEvent = () => {
        setCarousel((prev) => (prev === 0 ? events.length - 1 : prev - 1));
    };
    const nextEvent = () => {
        setCarousel((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    };

    if (!events || events.length === 0) return null;

    return (
        <div className="mx-auto mb-20 flex flex-col items-center w-full">
            {/* Blue header with extra spacing */}
            <h3 className="text-3xl font-bold mt-12 mb-12 text-center text-blue-400 drop-shadow">
                Upcoming Events
            </h3>
            <div className="relative w-full max-w-3xl mx-auto flex items-center">
                {/* Arrow - Previous (outside left, visually appealing) */}
                {/* <button
                    aria-label="Previous"
                    onClick={prevEvent}
                    className="absolute -left-10 top-1/2 -translate-y-1/2
    bg-blue-600 bg-opacity-70 text-white
    rounded-full shadow-lg w-12 h-12 flex items-center justify-center
    transition hover:scale-110 hover:bg-blue-700 z-20 border-2 border-blue-300"
                >
                    <FiChevronLeft size={32} />
                </button> */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={carousel}
                            initial={{ x: 120 * (carousel % 2 ? 1 : -1), opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 70, damping: 14 }}
                            className="bg-[#22252C] rounded-2xl border border-[#353942] shadow-xl flex flex-col md:flex-row items-center gap-8 px-6 py-10 relative min-h-[330px]"
                        >
                            <img
                                src={events[carousel].bannerUrl || analyticsImg}
                                alt={events[carousel].title}
                                width={340}
                                height={200}
                                style={{ width: 340, height: 200, objectFit: "cover" }}
                                className="rounded-xl object-cover shadow-md border-2 border-blue-300 flex-shrink-0"
                            />
                            <div className="flex-1 flex flex-col items-start justify-center min-w-[180px] max-w-md">
                                <div className="flex gap-2 text-base mb-2 text-blue-200">
                                    {events[carousel].date && (
                                        <span className="whitespace-nowrap text-sm">
                                            {events[carousel].date}
                                        </span>
                                    )}
                                </div>
                                <div className="text-3xl font-bold text-blue-500 mb-2 break-words line-clamp-2">
                                    {events[carousel].title}
                                </div>
                                <div className="text-gray-400 text-sm mb-4 break-words line-clamp-3">
                                    {events[carousel].description}
                                </div>
                                <Link
                                    href={`/events/${events[carousel].eventId}`}
                                    className="mt-1 text-lg font-bold px-6 py-2 rounded-lg bg-blue-500 text-white shadow transition hover:bg-blue-600 hover:text-amber-300"
                                >
                                    Register
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                {/* Arrow - Next (outside right, visually appealing) */}
                {/* <button
                    aria-label="Next"
                    onClick={nextEvent}
                    className="absolute -right-7 top-1/2 -translate-y-1/2
            bg-blue-500 text-white hover:bg-blue-700 hover:text-amber-400
            rounded-full shadow-md border border-blue-300
            w-11 h-11 flex items-center justify-center
            transition duration-200 hover:scale-110 z-20 opacity-80"
                    style={{ fontSize: "2rem" }}
                >
                    &gt;
                </button> */}
            </div>
        </div>
    );
}
