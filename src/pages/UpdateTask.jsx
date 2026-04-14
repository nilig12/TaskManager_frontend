import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateTask, resetTaskState } from "../features/task/taskSlice";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const UpdateTask = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tasks, isError, message } = useSelector((state) => state.task);

  // find task by id
  const task = tasks.find((t) => t._id === id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetTaskState());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "",
        priority: task.priority || "",
        dueDate: task.dueDate?.slice(0, 10) || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateTask({ id, data: formData }));
    toast.success("Task updated successfully!");
    navigate("/tasks");
  };

  if (!task) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Task not found</p>
    </div>
  );

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const labelClass = "block text-sm font-semibold text-gray-600 mb-1";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar backTo="/tasks" backLabel="All Tasks" />

      <div className="max-w-xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Update Task</h2>
          <p className="text-gray-400 text-sm mb-6">Edit the task details below</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows={3} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className={inputClass}>
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className={inputClass} />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Update Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
