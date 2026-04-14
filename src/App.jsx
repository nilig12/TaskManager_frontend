import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
import AllTask from "./pages/AllTask";
import UpdateTask from "./pages/UpdateTask";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-task" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><AllTask /></ProtectedRoute>} />
        <Route path="/update-task/:id" element={<ProtectedRoute><UpdateTask /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
