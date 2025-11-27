"use client";

import EditionSelectorDark from "./EditionSelectorDark";
import { Linkedin, Instagram, Youtube, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d0f12] border-t border-[#1c1e22]  text-[13px] text-gray-400">
      <div className="max-w-[1200px] mx-auto px-6 py-14">

        {/* ----- TOP GRID (Dark Zoho Style) ----- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12">

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4 text-[12px] tracking-wide">PRODUCT</h4>
            <ul className="space-y-[6px]">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Integrations</li>
              <li className="hover:text-white cursor-pointer">Mobile App</li>
              <li className="hover:text-white cursor-pointer">Inventory Control</li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4 text-[12px] tracking-wide">LEARN</h4>
            <ul className="space-y-[6px]">
              <li className="hover:text-white cursor-pointer">Help Documentation</li>
              <li className="hover:text-white cursor-pointer">Video Tutorials</li>
              <li className="hover:text-white cursor-pointer">Webinars</li>
              <li className="hover:text-white cursor-pointer">User Guide</li>
              <li className="hover:text-white cursor-pointer">API Developers</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4 text-[12px] tracking-wide">COMPANY</h4>
            <ul className="space-y-[6px]">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Press</li>
              <li className="hover:text-white cursor-pointer">Partners</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4 text-[12px] tracking-wide">RESOURCES</h4>
            <ul className="space-y-[6px]">
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Case Studies</li>
              <li className="hover:text-white cursor-pointer">Community</li>
              <li className="hover:text-white cursor-pointer">Status Page</li>
              <li className="hover:text-white cursor-pointer">Support Portal</li>
            </ul>
          </div>

          {/* Region selector */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4 text-[12px] tracking-wide">SELECT REGION</h4>
            <EditionSelectorDark />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1c1e22] my-10"></div>

        {/* ----- BOTTOM BAR ----- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

          {/* Left - Legal */}
          <div className="flex flex-wrap gap-4 text-[12px] text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer">Security</span>
            <span>·</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-gray-300 cursor-pointer">Cookie Policy</span>
            <span>·</span>
            <span className="hover:text-gray-300 cursor-pointer">Sitemap</span>
          </div>

          {/* Right - Social */}
          <div className="flex gap-5">
            <Linkedin className="w-[18px] h-[18px] text-gray-500 hover:text-[#0A66C2] cursor-pointer" />
            <Instagram className="w-[18px] h-[18px] text-gray-500 hover:text-[#DD2A7B] cursor-pointer" />
            <Youtube className="w-[18px] h-[18px] text-gray-500 hover:text-[#FF0000] cursor-pointer" />
            <X className="w-[18px] h-[18px] text-gray-500 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-[11px] text-gray-500 mt-10">
          © 2025 Whomo Inventory · All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
