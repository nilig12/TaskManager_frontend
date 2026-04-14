import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { ChevronDown, User, Mail, ShieldCheck, LogOut, ArrowLeft } from "lucide-react";

const Navbar = ({ backTo, backLabel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showProfile, setShowProfile] = useState(false);
  const popupRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-3 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate("/dashboard")}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
          <span className="text-white text-xs font-bold">TM</span>
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition">
          TaskManager
        </span>
      </div>

      <div className="flex items-center gap-3">
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            <ArrowLeft size={15} /> {backLabel}
          </button>
        )}

        {user && (
          <div className="relative" ref={popupRef}>
            {/* Avatar Button */}
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 bg-white group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition">
                {user.name?.split(" ")[0]}
              </span>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Popup */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                {/* Header gradient */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-lg font-bold border-2 border-white/40">
                    {initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-indigo-200 text-xs mt-0.5">{user.email}</p>
                  </div>
                </div>

                {/* Info rows */}
                <div className="px-5 py-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={15} className="text-indigo-400" />
                    <span className="font-medium">Name:</span>
                    <span className="text-gray-800">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={15} className="text-indigo-400" />
                    <span className="font-medium">Email:</span>
                    <span className="text-gray-800">{user.email}</span>
                  </div>
                  {user.role && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ShieldCheck size={15} className="text-indigo-400" />
                      <span className="font-medium">Role:</span>
                      <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                        {user.role}
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-5 pb-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 shadow hover:shadow-md"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
