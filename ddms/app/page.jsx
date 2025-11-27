"use client";
import Link from "next/link";
import { Zap, ShoppingBag, TrendingUp, Grid, Truck, Layers, Barcode, CheckCircle, Mail, Phone, Globe, Instagram , Youtube, ChevronDown, Clock, DollarSign, RefreshCw, Warehouse, Facebook, X, Linkedin } from 'lucide-react';
import Footer from '../components/footer';
// Helper Component for Feature Cards (Optimized for density)
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
    <div className="p-3 bg-blue-50 rounded-lg inline-block mb-3">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// Helper Component for Integration Logos
const IntegrationLogo = ({ name, icon: Icon, colorClass }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center space-y-2 hover:shadow-md transition duration-300">
    <Icon className={`w-8 h-8 ${colorClass}`} />
    <span className="text-xs font-medium text-gray-600">{name}</span>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      
      {/* HEADER (Clean, Professional, Sticky) */}
      <header className="sticky top-0 z-50 p-4 max-w-full mx-auto backdrop-blur-md bg-white/95 border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
            <Warehouse className="w-6 h-6"/> Whomo Inventory
          </div>
          <nav className="hidden md:flex gap-8 items-center font-medium text-gray-700">
            <Link href="#features" className="hover:text-blue-600 transition duration-200">Features</Link>
            <Link href="#integrations" className="hover:text-blue-600 transition duration-200">Integrations</Link>
            <Link href="/pricing" className="hover:text-blue-600 transition duration-200">Pricing</Link>
            <Link href="#contact" className="hover:text-blue-600 transition duration-200">Support</Link>
          </nav>
          <div className="flex gap-4 items-center">
            <Link href="/login" passHref>
              <button className="text-blue-600 font-semibold hover:text-blue-800 transition duration-200 hidden sm:block">
                Login
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION (Focus on comprehensive solution) */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:py-32 border-b border-blue-100">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
          <div className="md:w-1/2 space-y-6 mt-12 md:mt-0 text-center md:text-left">
            <p className="text-lg font-semibold text-blue-600 uppercase tracking-widest">
              The Complete Inventory Management Software
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
              Control Inventory. <br/> Manage Orders. <br/> Grow Sales.
            </h1>
            <p className="text-gray-600 text-xl max-w-lg mx-auto md:mx-0">
              Whomo Inventory is a powerful, cloud-based platform that handles stock tracking, order fulfillment, and multi-channel synchronization, helping you save time and money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Link href="/trial" passHref>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white text-lg rounded-xl shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-[1.02] font-semibold">
                  Start Your 14-Day Free Trial
                </button>
              </Link>
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 text-lg rounded-xl transition duration-300 hover:bg-blue-50 font-semibold">
                See Live Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            {/* Placeholder for a detailed dashboard screenshot/illustration */}
            <div className="p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
              <img
                src="/zoho-inventory-dashboard-mockup.png" // Placeholder
                alt="Detailed Inventory Dashboard"
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID (High feature density) */}
      <section id="features" className="max-w-7xl mx-auto p-6 my-20">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800">
          Simplify Every Inventory Process
        </h2>
        <p className="text-center text-xl text-gray-500 mb-12">
          From tracking to reporting, Whomo gives you real-time control.
        </p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <FeatureCard 
            icon={<RefreshCw className="w-6 h-6 text-green-600"/>} 
            title="Real-Time Tracking" 
            description="Know your stock levels across all locations instantly to prevent stockouts and backorders."
          />

          <FeatureCard 
            icon={<Layers className="w-6 h-6 text-indigo-600"/>} 
            title="Multi-Channel Orders" 
            description="Manage sales orders from your website, Amazon, and eBay all from one centralized dashboard."
          />
          
          <FeatureCard 
            icon={<Truck className="w-6 h-6 text-orange-600"/>} 
            title="Shipping Integration" 
            description="Automate label generation and sync tracking details with major carriers like FedEx and USPS."
          />

          <FeatureCard 
            icon={<Barcode className="w-6 h-6 text-blue-600"/>} 
            title="Serial & Batch Tracking" 
            description="Track individual units or batches by serial number for complete visibility and compliance."
          />
          
          <FeatureCard 
            icon={<Warehouse className="w-6 h-6 text-teal-600"/>} 
            title="Multiple Warehouses" 
            description="Control inventory across multiple physical locations, transferring stock with ease."
          />
          
          <FeatureCard 
            icon={<DollarSign className="w-6 h-6 text-red-600"/>} 
            title="Landed Costs" 
            description="Accurately calculate true product costs by including shipping, duties, and handling fees."
          />

          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6 text-yellow-600"/>} 
            title="Demand Forecasting" 
            description="Use historical data and insights to predict future demand and set optimal reorder points."
          />

          <FeatureCard 
            icon={<CheckCircle className="w-6 h-6 text-purple-600"/>} 
            title="Inventory Audits" 
            description="Perform cycle counting and full stock takes quickly and accurately using mobile scanners."
          />
        </div>
      </section>

      {/* INTEGRATIONS SECTION (Crucial for a Zoho-like product) */}
      <section id="integrations" className="bg-gray-50 p-6 md:p-16 my-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800">
            Seamlessly Connect Your Ecosystem
          </h2>
          <p className="text-center text-xl text-gray-500 mb-12">
            Whomo works perfectly with the tools you already use every day.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            <IntegrationLogo name="Shopify" icon={ShoppingBag} colorClass="text-teal-500" />
            <IntegrationLogo name="Amazon" icon={Grid} colorClass="text-orange-500" />
            <IntegrationLogo name="QuickBooks" icon={Clock} colorClass="text-blue-500" /> 
            <IntegrationLogo name="eBay" icon={TrendingUp} colorClass="text-red-500" />
            <IntegrationLogo name="UPS" icon={Truck} colorClass="text-yellow-500" />
            <IntegrationLogo name="FedEx" icon={Truck} colorClass="text-indigo-500" />
          </div>
          
          <div className="text-center mt-10">
            <Link href="/integrations" passHref>
              <button className="text-blue-600 font-semibold text-lg hover:underline transition duration-300">
                View All 50+ Integrations &rarr;
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* CALL TO ACTION (Bottom of Page) */}
      <section className="max-w-4xl mx-auto p-6 text-center my-20">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Ready to Take Control of Your Stock?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of businesses that trust Whomo Inventory to optimize their operations and maximize profits.
        </p>
        <Link href="/signup" passHref>
          <button className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white text-xl rounded-xl shadow-2xl hover:bg-blue-700 transition duration-300 transform hover:scale-[1.05] font-bold">
            Get Started Today - It's Free!
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}