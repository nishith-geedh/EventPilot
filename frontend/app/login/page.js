"use client"
import { signIn } from "next-auth/react"

export default function Login() {
  return (
    <div className="max-w-md mx-auto brutal-card bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Login / Signup</h1>
      <button onClick={() => signIn("cognito")} className="brutal-btn bg-blue-300 px-4 py-2">Continue with Cognito</button>
    </div>
  )
}
