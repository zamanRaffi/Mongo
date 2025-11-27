"use client";

import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { Zap, ShoppingBag, TrendingUp, Grid, Facebook, Twitter, Linkedin, X} from 'lucide-react'; // Importing icons for features

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 text-gray-900 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-10 p-4 max-w-7xl mx-auto backdrop-blur-xl bg-white/70 rounded-b-2xl shadow-lg transition duration-500 hover:shadow-xl">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-3xl font-extrabold text-blue-600 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6"/> Whomo
          </div>
          <nav className="hidden md:flex gap-8 items-center font-medium">
            <button
              onClick={() => {
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-gray-700 hover:text-blue-600 transition duration-300 relative group"
            >
              About
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={() => {
                document.getElementById("feature")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-gray-700 hover:text-blue-600 transition duration-300 relative group"
            >
              Features
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-gray-700 hover:text-blue-600 transition duration-300 relative group"
            >
              Contact
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <Link href="/login" passHref>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                Login
              </button>
            </Link>
          </nav>
          {/* Mobile Menu Placeholder - For a full solution, you'd add a hamburger menu here */}
          <div className="md:hidden">
            <Link href="/login" passHref>
              <button className="text-blue-600 font-semibold">Login</button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto p-6 md:py-32">
        <div className="md:w-1/2 space-y-8 mt-12 md:mt-0 text-center md:text-left animate-slideInLeft">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Inventory Management Reimagined
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Smart Inventory, <br className="hidden md:inline"/> Smarter Decisions
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
            Track products, organize categories, monitor sales, and leverage **AI-powered insights** to grow your business effortlessly.
          </p>
          <Link href="/dashboard" passHref>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition duration-300 transform hover:scale-[1.02] font-semibold animate-bounceOnce">
              <Zap className="w-5 h-5"/> Start Managing Now
            </button>
          </Link>
        </div>
        <div className="md:w-1/2 animate-slideInRight">
          {/* Using a more modern placeholder/illustration style */}
          <div className="p-8 bg-white/70 rounded-3xl shadow-2xl">
            <img
              src="/hero-image.png"
              alt="Inventory Management Dashboard Illustration"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section id="feature" className="max-w-7xl mx-auto p-6 my-24">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <FeatureCard 
            icon={<ShoppingBag className="w-8 h-8 text-blue-600"/>} 
            title="Manage Products" 
            description="Quickly add, edit, and remove products with a streamlined, intuitive interface. Keep track of stock in real-time."
          />

          <FeatureCard 
            icon={<TrendingUp className="w-8 h-8 text-indigo-600"/>} 
            title="Track Sales & Analytics" 
            description="View detailed sales analytics and inventory turnover to forecast demand and optimize purchasing."
          />
          
          <FeatureCard 
            icon={<Grid className="w-8 h-8 text-teal-600"/>} 
            title="Organize Categories" 
            description="Structure your entire inventory with easy-to-manage categories and tags for quick access and reporting."
          />
        </div>
      </section>

      {/* ABOUT SECTION - More emphasis and space */}
      <section id="about" className="max-w-5xl mx-auto p-6 my-20 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-100 animate-fadeIn">
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-700">The Whomo Difference</h2>
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="text-5xl font-extrabold text-blue-500 opacity-70">
            <Zap className="w-12 h-12"/> AI
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            Whomo is designed for small to medium businesses looking for an edge. Our platform doesn't just manage data; it provides **AI-powered insights** to predict stockouts, suggest optimal reorder points, and analyze sales trends. Simplify operations and make data-driven decisions faster than ever.
          </p>
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer id="contact" className="bg-gray-900 text-white p-12 mt-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-gray-700 pb-10 mb-10">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Whomo IMS</h3>
            <p className="text-gray-400">Efficient inventory management powered by AI for modern businesses.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-blue-500/50 pb-2">Quick Links</h3>
            <ul className="space-y-2">
  <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
  <li><button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="hover:text-blue-400 transition"
      >About</button></li>
  <li>
    <Link href="/login" className="hover:text-blue-400 transition">Login</Link>
  </li>
</ul>

          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-blue-500/50 pb-2">Get In Touch</h3>
            <p className="text-gray-400 mb-2">Email: <a href="mailto:support@whomo.com" className="hover:text-blue-400">support@whomo.com</a></p>
            <p className="text-gray-400">Phone: <span className="text-white">+123 456 7890</span></p>
          </div>
          
          <div>
  <h3 className="text-xl font-semibold mb-4 border-b border-blue-500/50 pb-2">Connect</h3>
  <div className="flex gap-4"> {/* Removed text-2xl, sizing icons explicitly */}
    {/* Facebook */}
    <Link 
      href="#" 
      className="hover:text-blue-400 transition"
      aria-label="Follow us on Facebook" // Added for accessibility
    >
      <Facebook className="w-6 h-6" /> 
    </Link>
    
    {/* Twitter */}
    <Link 
      href="#" 
      className="hover:text-blue-400 transition"
      aria-label="Follow us on Twitter"
    >
      <Twitter className="w-6 h-6" /> 
    </Link>
    
    {/* LinkedIn */}
    <Link 
      href="#" 
      className="hover:text-blue-400 transition"
      aria-label="Connect with us on LinkedIn"
    >
      <Linkedin className="w-6 h-6" /> 
    </Link>

      <Link 
      href="#" 
      className="hover:text-blue-400 transition"
      aria-label="Follow us on Twitter"
    >
      <X className="w-6 h-6" /> 
    </Link>
  </div>
</div>
        </div>
        <p className="text-center text-gray-500 mt-8 text-sm">© 2025 Whomo IMS. All rights reserved.</p>
      </footer>

      {/* Additional Components (defined outside the main export for clarity) */}
      <style jsx global>{`
        /* Custom Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        /* Apply animations (using Tailwind utility for stagger where needed) */
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        .animate-bounceOnce { animation: bounceOnce 0.6s ease-in-out; }
      `}</style>
    </div>
  );
}

// Helper Component for Feature Cards (Better UI encapsulation)
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition duration-500 border-t-4 border-blue-500/70 transform group">
    <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4 transition duration-300 group-hover:bg-blue-100">
      {icon}
    </div>
    <h3 className="text-xl font-extrabold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);