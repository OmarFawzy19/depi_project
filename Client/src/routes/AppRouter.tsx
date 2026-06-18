import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import ForgotPassword from "@/pages/ForgetPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyOtp from "@/pages/VerifyOtp";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import MapSearch from "@/pages/MapSearch";
import FavoritesPage from "@/pages/FavoritesPage";
import Messages from "@/pages/Messages";
import Admin from "@/pages/Admin";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ DEFAULT PAGE */}
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ PROPERTY PAGES */}
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/map" element={<MapSearch />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ PROTECTED PAGES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};
