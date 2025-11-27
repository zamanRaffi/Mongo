"use client";

import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

export default function EditionSelectorDark() {
  const [open, setOpen] = useState(false);
  const [edition, setEdition] = useState("Global");

  const regions = [
    "Global",
    "Bangladesh",
    "United States",
    "United Kingdom",
    "India",
    "Canada",
    "Australia",
    "United Arab Emirates",
    "Saudi Arabia",
    "South Africa",
    "Germany",
    "Singapore",
    "Qatar",
    "Oman",
    "Kuwait",
    "Bahrain",
    "Egypt",
    "Nigeria",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Sweden",
    "Switzerland",
    "Japan",
    "China",
    "Brazil",
    "Mexico",
    "PAKISTAN",
    "Sri Lanka",
    "Nepal"

  ];

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-40 border border-[#2a2d32] bg-[#1a1c1f] px-3 py-2 rounded-md 
                   text-[13px] flex items-center justify-between text-gray-300 
                   hover:bg-[#22252a] transition"
      >
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          {edition}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-40 bg-[#1a1c1f] border border-[#2a2d32] 
                        rounded-md shadow-lg z-20">
          <ul className="max-h-60 overflow-y-auto text-[13px]">
            {regions.map((region) => (
              <li
                key={region}
                onClick={() => {
                  setEdition(region);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-[#2a2d32] text-gray-300 ${
                  edition === region
                    ? "bg-[#202327] text-blue-400 font-semibold"
                    : ""
                }`}
              >
                {region}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
