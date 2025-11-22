"use client";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

async function requireAuth(){
  if (typeof window === 'undefined') return;
  const pathname = window.location.pathname;
  const publicPaths = ['/','/login','/signup'];
  if (publicPaths.includes(pathname)) return;

  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      window.location.href = '/login';
    }
  } catch (e) {
    window.location.href = '/login';
  }
}

export default function RootLayout({ children }) {
  useEffect(() => {
    requireAuth();
  }, []);

  return (
    <html lang="en">
      <body className="flex bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}

