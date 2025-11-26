"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleReset() {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success("Password reset link sent to your email!");
      setEmail("");
      // Optional: redirect to login after success
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 p-6">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 shadow-2xl rounded-2xl p-8 border border-white/30">

        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-white text-center mb-2">Whomo</h1>
        <p className="text-white/80 text-center mb-8">
          Forgot your password? Enter your email to reset it.
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Reset Button */}
        <button
          className="w-full bg-white text-blue-700 font-bold py-3 rounded-lg shadow-md hover:bg-gray-100 transition mb-4"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-white/40"></div>
          <span className="px-3 text-white/70 text-sm">or</span>
          <div className="flex-1 h-px bg-white/40"></div>
        </div>

        {/* Back to Login */}
        <button
          className="w-full bg-white/90 text-gray-800 font-semibold py-3 rounded-lg hover:bg-white transition"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}
