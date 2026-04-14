import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authService = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (authService.isError && authService.message) {
      toast.error(authService.message);
      dispatch(reset());
    }
    if (authService.isSuccess) {
      toast.success("Login successful!");
      navigate("/dashboard");
      dispatch(reset());
    }
  }, [authService.isError, authService.isSuccess, authService.message, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-3">
            <span className="text-white font-bold text-lg">TM</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your TaskManager account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="text"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 transition"
              />
            </div>

            <button
              type="submit"
              disabled={authService.isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow hover:shadow-md disabled:opacity-60"
            >
              {authService.isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-600 font-semibold hover:underline">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
