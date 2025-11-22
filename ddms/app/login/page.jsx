"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    window.location.href = "/dashboard";
  }

  return (
    <div className="flex items-center justify-center p-6 min-h-[80vh]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Login to 
        </h1>
        <p className="text-gray-600 mb-6">
          Enter your credentials to access the Inventory Management System.
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-green-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
