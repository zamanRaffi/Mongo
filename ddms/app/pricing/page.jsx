import { CheckCircle } from "lucide-react";
import Footer from "../../components/footer";

export default function PricingPage() {
  return (
    <div>
       <div className="py-20 px-20 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 ">

      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-gray-600 mt-4 text-lg">Flexible plans built for businesses of all sizes.</p>
      </div>

      {/* PRICING GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">


        {/* FREE PLAN */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition duration-300 text-black">
          <h3 className="text-xl font-semibold mb-3">Free</h3>
          <p className="text-4xl font-bold mb-2">$0<span className="text-lg text-gray-500">/mo</span></p>
          <p className="text-gray-500 mb-6">Best for new users exploring our platform.</p>

          <ul className="space-y-3 mb-6 text-sm">
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> Up to 50 Orders / Month</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> 1 Warehouse</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> Basic Integrations</li>
          </ul>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">Start Free</button>
        </div>


        {/* STANDARD PLAN */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-600 p-8 hover:shadow-2xl scale-[1.02] text-black">
          <span className="inline-block px-4 py-1 bg-blue-600 text-white text-xs rounded-full mb-4">POPULAR</span>
          <h3 className="text-xl font-semibold mb-3">Standard</h3>
          <p className="text-4xl font-bold mb-2">$29<span className="text-lg text-gray-500">/mo</span></p>
          <p className="text-gray-500 mb-6">Great for growing businesses.</p>

          <ul className="space-y-3 mb-6 text-sm">
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> 1000 Orders / Month</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> 3 Warehouses</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> All Integrations</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> Basic Automation</li>
          </ul>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">Buy Now</button>
        </div>


        {/* PROFESSIONAL PLAN */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition duration-300 text-black">
          <h3 className="text-xl font-semibold mb-3">Professional</h3>
          <p className="text-4xl font-bold mb-2">$79<span className="text-lg text-gray-500">/mo</span></p>
          <p className="text-gray-500 mb-6">Advanced workflows for scaling teams.</p>

          <ul className="space-y-3 mb-6 text-sm">
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> Unlimited Orders</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> Unlimited Warehouses</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> Priority Support</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> Workflow Automation</li>
          </ul>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">Get Started</button>
        </div>

      </div>
    </div>
    <Footer />
    </div>
   
    
  );
}
