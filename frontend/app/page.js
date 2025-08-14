import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y:0, opacity:1 }} className="p-8 brutal-card bg-white">
        <h1 className="text-4xl font-extrabold mb-4">Plan. Publish. Sell.</h1>
        <p className="mb-6">Create beautiful events, accept registrations, and issue QR tickets automatically.</p>
        <Link href="/events" className="brutal-btn bg-yellow-300 px-4 py-2 inline-block">Browse Events</Link>
      </motion.div>
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ delay: .1 }} className="p-8 brutal-card bg-white">
        <h2 className="text-2xl font-bold mb-2">For Organizers</h2>
        <p className="mb-4">Create and manage events. See analytics in real-time.</p>
        <Link href="/organizer" className="brutal-btn bg-green-300 px-4 py-2 inline-block">Open Dashboard</Link>
      </motion.div>
    </div>
  )
}
