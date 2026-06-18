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
<<<<<<< HEAD
import AddProperty from "@/pages/AddProperty";
=======
import MapSearch from "@/pages/MapSearch";
import FavoritesPage from "@/pages/FavoritesPage";
>>>>>>> 6a735498c3f3b39d329445285c2f12b5a74b380a
import Messages from "@/pages/Messages";
import Admin from "@/pages/Admin";
import OwnerDashboard from "@/pages/OwnerDashboard";
import EditProperty from "@/pages/EditProperty";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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

        <Route
          path="/add-property"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-property/:id"
          element={
            <ProtectedRoute>
              <EditProperty />
            </ProtectedRoute>
          }
        />

        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};
