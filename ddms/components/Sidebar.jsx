"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/context/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false); // immediately hide sidebar
      router.push("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <aside className="w-56 bg-white text-black h-screen p-4 shadow">
      <h2 className="text-xl font-bold mb-4">IMS</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard">
          <span className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</span>
        </Link>
        <Link href="/products">
          <span className="block px-3 py-2 rounded hover:bg-gray-100">Products</span>
        </Link>
        <Link href="/categories">
          <span className="block px-3 py-2 rounded hover:bg-gray-100">Categories</span>
        </Link>
        <Link href="/employees">
          <span className="block px-3 py-2 rounded hover:bg-gray-100">Employees</span>
        </Link>
        <Link href="/suppliers">
          <span className="block px-3 py-2 rounded hover:bg-gray-100">Suppliers</span>
        </Link>
        <Link href="/sales">
          <span className="block px-3 py-2 rounded hover:bg-gray-100">Sales</span>
        </Link>
        <Link href="/billing">
          <span className="block px-3 py-2 rounded hover:bg-gray-100">Billing</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-left px-3 py-2 rounded hover:bg-gray-100 mt-4"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
