"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react"; // Imported ShoppingBag for branding
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  // Add state for managing potential error messages
  const [error, setError] = useState(null);

  const router = useRouter();
   const { setUser } = useAuth();

  // Load saved email from localStorage if Remember Me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  async function handleLogin() {
    setError(null); // Clear previous errors
    if (!email || !password) {
      setError("Please fill in both email and password.");
      // Using a custom message box or alert replacement instead of native alert()
      // Since we can't use alert, we rely on the state-based error message display below.
      return; 
    }

    // This block is left in place, assuming it connects to your Next.js API route
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login failed. Please check your credentials.");
      return;
    }

    // Save email if Remember Me is checked
    if (remember) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Use router.push instead of window.location.href for Next.js best practice
     setUser(data.user);
    router.push("/dashboard"); 
  }

  function handleForgotPassword() {
    router.push("/forgot");
  }


  return (
    // Background remains light and airy
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-4 sm:p-6">
      
      {/* Login Card - MODERN GLASSMORHISM */}
      <div className="w-full max-w-md backdrop-blur-3xl bg-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 sm:p-10 border border-white/90 transform transition duration-500 hover:shadow-xl">

        {/* App Title and Branding */}
        <div className="text-center mb-10">
          <ShoppingBag className="w-10 h-10 mx-auto text-blue-600 mb-2"/>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-wide">Whomo</h1>
          <p className="text-gray-600 text-sm">
            Welcome back! Log in to access your inventory.
          </p>
        </div>
        
        {/* Error Message Display */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium" role="alert">
                {error}
            </div>
        )}

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email address"
            // Input styling updated for Glassmorphism
            className="w-full px-5 py-3 rounded-xl bg-white/80 border border-blue-200/50 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 shadow-inner"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            // Input styling updated for Glassmorphism
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

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between mb-8">
          <label className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-600 bg-white border-gray-400 rounded focus:ring-blue-500"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Remember me
          </label>

          <button
            onClick={handleForgotPassword}
            className="text-blue-600 hover:text-blue-800 transition font-medium text-sm"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button - Strong Blue Accent */}
        <button
          className="w-full bg-blue-600 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition transform hover:scale-[1.01] mb-6 tracking-wide"
          onClick={handleLogin}
        >
          LOG IN
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm font-light">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl shadow-sm hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Signup */}
        <p className="text-center text-gray-700 mt-8">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-bold hover:text-blue-800 transition">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}