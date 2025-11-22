export default function Home() {
  return (
    <div className="flex items-center justify-center p-6 min-h-[80vh]">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Inventory Management
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to the Inventory Management System (DDMS). Manage your products efficiently and effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/signup"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-colors"
          >
            Signup
          </a>
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
