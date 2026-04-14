import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTask, resetTaskState } from "../features/task/taskSlice";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const CreateTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, createSuccess, message } = useSelector(
    (state) => state.task,
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    dueDate: "",
  });

  const { title, description, status, priority, dueDate } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createTask({
        title,
        description,
        status,
        priority,
        dueDate,
      }),
    );
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetTaskState());
    }
    if (createSuccess) {
      toast.success("Task created successfully!");
      navigate("/tasks");
    }
  }, [isError, createSuccess, message, navigate, dispatch]);

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const labelClass = "block text-sm font-semibold text-gray-600 mb-1";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar backTo="/dashboard" backLabel="Dashboard" />

      <div className="max-w-xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Task</h2>
          <p className="text-gray-400 text-sm mb-6">Fill in the details below</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" name="title" value={title} onChange={onChange} required className={inputClass} placeholder="Task title" />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={description} onChange={onChange} rows={3} className={inputClass} placeholder="Task description" />
            </div>

            <div>
              <label className={labelClass}>Priority</label>
              <select name="priority" value={priority} onChange={onChange} className={inputClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" name="dueDate" value={dueDate} onChange={onChange} min={new Date().toISOString().split('T')[0]} className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-2 rounded-lg transition"
            >
              ← Back to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
