import "./globals.css"
import Link from "next/link"

export const metadata = { title: "EventPilot", description: "Serverless Event Platform" }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-brutal">
        <header className="p-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold">EventPilot</Link>
          <nav className="space-x-4">
            <Link href="/events">Events</Link>
            <Link href="/organizer">Organizer</Link>
            <Link href="/login" className="brutal-btn px-3 py-1 rounded bg-white">Login</Link>
          </nav>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  )
}
