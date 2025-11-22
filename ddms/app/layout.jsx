"use client";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";

function LayoutContent({ children }) {
  const { isAuthenticated, loading } = useAuth();

  return (
    <body className="flex bg-gray-100">
      {loading ? (
        <div className="flex-1 p-6">Loading...</div>
      ) : (
        <>
          {isAuthenticated && <Sidebar />}
          <main className="flex-1 p-6">{children}</main>
        </>
      )}
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </html>
  );
}
