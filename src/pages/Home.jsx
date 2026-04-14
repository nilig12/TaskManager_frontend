import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-600">TaskManager</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
        
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          Manage Your Tasks <br /> Effortlessly
        </h2>
        <p className="text-gray-500 text-lg max-w-md mb-10">
          Stay organized, set priorities, and get things done. Your personal task manager — simple and fast.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-base transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 border border-gray-300 hover:border-indigo-400 text-gray-700 font-semibold rounded-xl text-base transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-10 pb-16 max-w-4xl mx-auto w-full">
        {[
          { icon: "📋", title: "Track Tasks", desc: "Create and manage all your tasks in one place." },
          { icon: "🎯", title: "Set Priorities", desc: "Mark tasks as low, medium, or high priority." },
          { icon: "📅", title: "Due Dates", desc: "Never miss a deadline with due date tracking." },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 pb-6">
        © {new Date().getFullYear()} TaskManager. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
