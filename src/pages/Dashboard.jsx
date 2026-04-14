import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllTasks } from "../features/task/taskSlice";
import Navbar from "../components/Navbar";
import { ListTodo, Clock, CheckCircle2, Plus, ClipboardList, ArrowRight } from "lucide-react";

const StatCard = ({ value, label, color, icon, bg }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 shadow-sm border border-white/60 ${bg} group hover:scale-105 transition-transform duration-200 cursor-pointer`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
        <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
      </div>
      <div className={`${color} opacity-80`}>{icon}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 px-4 pb-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 mb-8 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
            <h2 className="text-2xl font-extrabold text-white">{user?.name || "User"}</h2>
            <p className="text-indigo-200 text-sm mt-1">Here's your task overview for today</p>
          </div>
        
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div onClick={() => navigate("/tasks")}>
            <StatCard value={total} label="Total Tasks" color="text-indigo-600" icon={<ListTodo size={32} />} bg="bg-white" />
          </div>
          <div onClick={() => navigate("/tasks?status=pending")}>
            <StatCard value={pending} label="Pending" color="text-orange-500" icon={<Clock size={32} />} bg="bg-white" />
          </div>
          <div onClick={() => navigate("/tasks?status=completed")}>
            <StatCard value={completed} label="Completed" color="text-green-500" icon={<CheckCircle2 size={32} />} bg="bg-white" />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div
            onClick={() => navigate("/create-task")}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg hover:border-indigo-200 transition-all duration-200 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-200">
              <Plus size={24} className="text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">Add New Task</h3>
            <p className="text-sm text-gray-400 mt-1">Create a new task to your list</p>
            <div className="mt-4 flex items-center gap-1 text-indigo-500 text-xs font-semibold opacity-0 group-hover:opacity-100 transition">
              Get started <ArrowRight size={12} />
            </div>
          </div>

          <div
            onClick={() => navigate("/tasks")}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg hover:border-purple-200 transition-all duration-200 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-200">
              <ClipboardList size={24} className="text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition">View All Tasks</h3>
            <p className="text-sm text-gray-400 mt-1">View, edit, filter and manage tasks</p>
            <div className="mt-4 flex items-center gap-1 text-purple-500 text-xs font-semibold opacity-0 group-hover:opacity-100 transition">
              Browse tasks <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
