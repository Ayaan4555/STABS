import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import { Box, Heading } from "@chakra-ui/react";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box >
      {/* <Heading textAlign="center" mb={6}>
        Student-Teacher Booking System
      </Heading> */}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Dashboard route - protected by role */}
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Placeholder route after login */}
        <Route
          path="/dashboard"
          element={
            user ? <div>Welcome, {user.name}</div> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/student"
          element={
            user && user.role === "student" ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/teacher"
          element={
            user?.role === "teacher" ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
