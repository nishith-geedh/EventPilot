"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.groups?.includes("organizer")) {
        router.replace("/organizer");
      } else {
        router.replace("/"); // Redirect attendees or other roles to homepage
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181B23] to-[#23272F]">
        <p className="text-gray-400 text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181B23] to-[#23272F] p-6">
        <div className="max-w-md w-full bg-[#23272F] p-8 rounded-3xl shadow-lg border border-[#353942] text-gray-100 text-center">
          <h1 className="text-3xl font-extrabold mb-6 text-amber-400">Login / Signup</h1>
          <button
            onClick={() => signIn("cognito")}
            className="brutal-btn bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg px-6 py-3 shadow transition"
          >
            Continue with Cognito
          </button>
        </div>
      </div>
    );
  }

  // While redirecting or unexpected states, render nothing
  return null;
}
