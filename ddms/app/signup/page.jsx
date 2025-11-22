"use client";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    alert("Signup successful");
    window.location.href = "/login";
  }

  return (
    <div className="flex items-center justify-center p-6 min-h-[80vh]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 mx-4 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Signup for IMS
        </h1>
        <p className="text-gray-600 mb-6">
          Create an account to access the Inventory Management System.
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-green-600 text-white font-medium py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors"
            onClick={register}
          >
            Signup
          </button>
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
