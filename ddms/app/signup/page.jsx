"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react"; // Added ShoppingBag for branding consistency
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  // Add state for managing potential error and success messages (replacing alert)
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const router = useRouter();

  async function register() {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return; 
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Signup failed. Please try again.");
      return;
    }

    setSuccessMessage("Signup successful! Redirecting to login...");
    // Redirect after a small delay to allow the user to see the success message
    setTimeout(() => {
      router.push("/login");
    }, 1500); 
  }

  return (
    // Background matching the LoginPage light gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-4 sm:p-6">
      
      {/* Sign Up Card - MODERN GLASSMORHISM */}
      <div className="w-full max-w-md backdrop-blur-3xl bg-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 sm:p-10 border border-white/90 transform transition duration-500 hover:shadow-xl">

        {/* App Title and Branding */}
        <div className="text-center mb-10">
          <ShoppingBag className="w-10 h-10 mx-auto text-blue-600 mb-2"/>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-wide">Whomo</h1>
          <p className="text-gray-600 text-sm">
            Create a new account to access your inventory.
          </p>
        </div>
        
        {/* Error Message Display */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium" role="alert">
                {error}
            </div>
        )}
        
        {/* Success Message Display */}
        {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium" role="alert">
                {successMessage}
            </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Name Input - Glassmorphism style */}
          <input
            type="text"
            placeholder="Name"
            className="w-full px-5 py-3 rounded-xl bg-white/80 border border-blue-200/50 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 shadow-inner"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email Input - Glassmorphism style */}
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-5 py-3 rounded-xl bg-white/80 border border-blue-200/50 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 shadow-inner"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input - Glassmorphism style */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full px-5 py-3 rounded-xl bg-white/80 border border-blue-200/50 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 transition duration-200"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Signup Button - Strong Blue Accent */}
          <button
            className="w-full bg-blue-600 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition transform hover:scale-[1.01] mb-6 tracking-wide mt-4"
            onClick={register}
          >
            SIGN UP
          </button>

          {/* Divider */}
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm font-light">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Signup */}
          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl shadow-sm hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

        {/* Login link */}
        <p className="text-center text-gray-700 mt-8">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 font-bold hover:text-blue-800 transition"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}