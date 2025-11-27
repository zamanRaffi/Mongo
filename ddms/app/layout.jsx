"use client"; // Important: must be client component
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "../components/Sidebar";
import "./globals.css";

function LayoutWrapper({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // wait for auth check
  if (!user) return <>{children}</>; // no sidebar if not logged in

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-50">
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
