"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function Header() {
  const { data: session, status } = useSession();

  const cognitoLogoutUrl =
    `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
    `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
    `&logout_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + "/login")}`;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = cognitoLogoutUrl;
  };

  // Base button style
  const btnBase =
    "brutal-btn px-5 py-2 rounded-xl font-semibold shadow-lg transition transform focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Unique colors for each button
  const btnEvents =
    btnBase +
    " bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white focus:ring-indigo-400";

  const btnOrganizer =
    btnBase +
    " bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white focus:ring-teal-400";

  const btnLogin =
    btnBase +
    " bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white focus:ring-pink-400";

  const btnLogout =
    btnBase +
    " bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white flex items-center gap-2 focus:ring-red-400";

  // User badge styling
  const userBadge =
    "flex items-center gap-2 font-semibold mr-3 bg-[#2e323a] px-4 py-1 rounded-full text-green-400 shadow-inner select-none";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#15181e] shadow flex justify-between items-center px-8 py-4">
      <Link
        href="/"
        className="text-2xl font-extrabold flex items-center gap-2 text-amber-400 tracking-wider select-none"
      >
        EventPilot
      </Link>
      <nav className="space-x-5 flex items-center text-gray-300">
        <Link href="/events" className={btnEvents}>
          Events
        </Link>
        <Link href="/organizer" className={btnOrganizer}>
          Organizer
        </Link>

        {status === "loading" && (
          <span className="px-4 py-1 rounded-full bg-gray-600 text-gray-200 font-semibold select-none">
            Loading...
          </span>
        )}

        {status === "unauthenticated" && (
          <button onClick={() => signIn("cognito")} className={btnLogin}>
            Login
          </button>
        )}

        {status === "authenticated" && (
          <>
            <span className={userBadge}>
              <FiUser size={20} />
              {session.user?.name || session.user?.email}
            </span>
            <button onClick={handleLogout} className={btnLogout} title="Logout">
              <FiLogOut size={20} />
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
