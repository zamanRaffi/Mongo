"use client";
import { useState } from "react";
import { ShoppingBag, Users } from "lucide-react"; // Using Users icon for admin/manager context
import { useAuth } from "../../context/AuthContext"; // Assuming this context provides user data

export default function CreateManagerPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // --- Access Denied Check ---
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-4 sm:p-6">
        <div className="w-full max-w-md bg-red-50 border border-red-200 p-8 rounded-3xl text-center shadow-lg">
          <h1 className="text-3xl font-extrabold text-red-700 mb-2">Access Denied</h1>
          <p className="text-gray-600">You must be logged in as an administrator to access this page.</p>
        </div>
      </div>
    );
  }

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return; 
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          // Assuming user.token is available and needed for admin API calls
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ name, email, password, role: "manager" }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccessMessage("Manager account created successfully!");
        // Clear form fields on success
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.error || "Failed to create manager account.");
      }
    } catch (err) {
      setError("An unexpected error occurred during creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background matching the LoginPage light gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-4 sm:p-6">
      
      {/* Create Manager Card - MODERN GLASSMORHISM */}
      <div className="w-full max-w-md backdrop-blur-3xl bg-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 sm:p-10 border border-white/90">

        {/* Header */}
        <div className="text-center mb-10">
          <Users className="w-10 h-10 mx-auto text-blue-600 mb-2"/>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-wide">Create Manager</h1>
          <p className="text-gray-600 text-sm">
            Administrator panel: Register a new manager for the system.
          </p>
        </div>
        
        {/* Messages Display */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium" role="alert">
                {error}
            </div>
        )}
        
        {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium" role="alert">
                {successMessage}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Name Input */}
          <input
            type="text"
            placeholder="Manager Full Name"
            className="w-full px-5 py-3 rounded-xl bg-white/80 border border-blue-200/50 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 shadow-inner"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Manager Email Address"
            className="w-full px-5 py-3 rounded-xl bg-white/80 border border-blue-200/50 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 shadow-inner"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Initial Password"
            className="w-full px-5 py-3 rounded-xl bg-white/80 border border-blue-200/50 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition duration-300 shadow-inner"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-extrabold py-3 rounded-xl shadow-lg shadow-blue-500/50 transition transform tracking-wide mt-4
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed opacity-75' 
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01]'
              }`
            }
          >
            {loading ? 'CREATING...' : 'CREATE MANAGER'}
          </button>
        </form>
      </div>
    </div>
  );
}