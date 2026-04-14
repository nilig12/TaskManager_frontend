import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteTask, getAllTasks, updateTask, resetTaskState } from "../features/task/taskSlice";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { Plus, Search, Pencil, Trash2, Calendar, CheckCircle2, Clock, ArrowLeft } from "lucide-react";

const priorityColor = {
  high: "bg-red-100 text-red-600",
  medium: "bg-yellow-100 text-yellow-600",
  low: "bg-green-100 text-green-600",
};

const statusColor = {
  pending: "bg-orange-100 text-orange-600",
  completed: "bg-green-100 text-green-600",
};

const AllTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, tasks, isError, message } = useSelector((state) => state.task);

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [statusModal, setStatusModal] = useState({ open: false, task: null });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    if (status === "pending" || status === "completed") setFilterStatus(status);
  }, [location.search]);

  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  // Search + Filter logic (frontend only)
  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || task.status === filterStatus;
    const matchPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const openDeleteModal = (id, title) => setDeleteModal({ open: true, id, title });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null, title: "" });

  const confirmDelete = () => {
    dispatch(deleteTask(deleteModal.id))
      .unwrap()
      .then(() => toast.success("Task deleted successfully!"))
      .catch(() => toast.error("Failed to delete task."));
    closeDeleteModal();
  };

  const handleMarkComplete = (task) => setStatusModal({ open: true, task });

  const confirmStatusChange = () => {
    const task = statusModal.task;
    const newStatus = task.status === "completed" ? "pending" : "completed";
    dispatch(updateTask({ id: task._id, data: { ...task, status: newStatus } }))
      .unwrap()
      .then(() => toast.success(`Task marked as ${newStatus}!`))
      .catch(() => toast.error("Failed to update task."));
    setStatusModal({ open: false, task: null });
  };

  const inputClass = "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-500 text-lg">Loading Tasks...</p>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-red-500 text-lg">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar backTo="/dashboard" backLabel="Dashboard" />

      <div className="max-w-3xl mx-auto mt-10 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Tasks</h2>
          <button
            onClick={() => navigate("/create-task")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            <Plus size={16} /> New Task
          </button>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} flex-1 w-full pl-9`}
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputClass}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className={inputClass}>
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Task count */}
        <p className="text-sm text-gray-400 mb-3">{filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found</p>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 mb-4">No tasks found. Create one!</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-2 rounded-lg transition text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white rounded-2xl shadow p-5 mb-4 flex justify-between items-start transition ${task.status === "completed" ? "opacity-70" : ""}`}
            >
              <div className="flex items-start gap-3 flex-1 pr-4">
                <div>
                  <h3 className={`text-base font-semibold ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[task.status] || "bg-gray-100 text-gray-600"}`}>
                      {task.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColor[task.priority] || "bg-gray-100 text-gray-600"}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                        <Calendar size={11} /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Toggle Switch */}
                <button
                  onClick={() => handleMarkComplete(task)}
                  title={task.status === "completed" ? "Mark as Pending" : "Mark as Completed"}
                  className={`relative inline-flex w-11 h-6 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    task.status === "completed" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                      task.status === "completed" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <button
                  onClick={() => navigate(`/update-task/${task._id}`)}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 text-sm px-3 py-1.5 rounded-lg transition"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => openDeleteModal(task._id, task.title)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 text-sm px-3 py-1.5 rounded-lg transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Back to Dashboard */}
        {tasks.length > 0 && (
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-2 mb-8 flex items-center justify-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-2 rounded-lg transition text-sm"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
        )}
      </div>

      {/* Status Change Confirmation Modal */}
      {statusModal.open && statusModal.task && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className={`rounded-full p-4 mb-4 ${
                statusModal.task.status === "completed" ? "bg-orange-100" : "bg-green-100"
              }`}>
                {statusModal.task.status === "completed"
                  ? <Clock className="w-8 h-8 text-orange-500" />
                  : <CheckCircle2 className="w-8 h-8 text-green-500" />
                }
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {statusModal.task.status === "completed" ? "Mark as Pending?" : "Mark as Completed?"}
              </h3>
              <p className="text-sm text-gray-500 mb-1 mt-1">
                <span className="font-semibold text-gray-700">"{statusModal.task.title}"</span>
              </p>
              <p className="text-sm text-gray-400 mb-6">
                {statusModal.task.status === "completed"
                  ? "This will move the task back to pending."
                  : "This will mark the task as completed."}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setStatusModal({ open: false, task: null })}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition shadow hover:shadow-md ${
                    statusModal.task.status === "completed"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {statusModal.task.status === "completed" ? "Mark Pending" : "Mark Complete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 rounded-full p-4 mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Task</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-700">"{deleteModal.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTask;
