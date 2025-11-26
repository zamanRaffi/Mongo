"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/context/AuthContext";
import {
  Home,
  Box,
  Tags,
  Users,
  Truck,
  DollarSign,
  FileText,
  UserCheck,
  BarChart2,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { name: "Products", href: "/products", icon: <Box size={20} /> },
    { name: "Categories", href: "/categories", icon: <Tags size={20} /> },
    { name: "Employees", href: "/employees", icon: <Users size={20} /> },
    { name: "Suppliers", href: "/suppliers", icon: <Truck size={20} /> },
    { name: "Sales", href: "/sales", icon: <DollarSign size={20} /> },
    { name: "Billing", href: "/billing", icon: <FileText size={20} /> },
    { name: "Customers", href: "/customers", icon: <UserCheck size={20} /> },
    { name: "Analytics", href: "/analytics", icon: <BarChart2 size={20} /> },
  ];

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.push("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <aside
      className={`min-h-screen p-6 bg-gradient-to-b from-blue-600 via-blue-500 to-indigo-700 text-white shadow-2xl border border-white/20 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64 rounded-2xl"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-8 flex items-center justify-center w-full p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
      >
        {collapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      {/* App Title */}
      {!collapsed && <h2 className="text-3xl font-extrabold mb-6 text-center">Whomo</h2>}

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
            >
              {link.icon}
              {!collapsed && <span className="font-medium">{link.name}</span>}
            </div>
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-white font-medium"
        >
          <LogOut size={20} />
          {!collapsed && "Logout"}
        </button>
      </nav>
    </aside>
  );
}
