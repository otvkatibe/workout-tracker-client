import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import WorkoutPage from "../pages/WorkoutPage";
import AddWorkout from "./AddWorkoutForm";
import ManageWorkouts from "../pages/ManageWorkouts";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <WorkoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-workout"
        element={
          <ProtectedRoute>
            <AddWorkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-workouts"
        element={
          <ProtectedRoute>
            <ManageWorkouts />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}