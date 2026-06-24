import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import ForgotPassword from "@/pages/ForgetPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyOtp from "@/pages/VerifyOtp";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import MapSearch from "@/pages/MapSearch";
import FavoritesPage from "@/pages/FavoritesPage";
import Admin from "@/pages/Admin";
import MyProperties from "@/pages/MyProperties";
import EditProperty from "@/pages/EditProperty";
import AddProperty from "@/pages/AddProperty";
import AccountSettings from "@/pages/AccountSettings";
import GoogleSuccess from "@/pages/GoogleSuccess";
import AdminUsers from "@/pages/AdminUsers";
import { ChatWidget } from "@/components/ChatWidget";
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
            <RoleRoute allowedRoles={["user", "admin", "seeker", "owner"]}>
              <FavoritesPage />
            </RoleRoute>
          }
        />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route
          path="/add-property"
          element={
            <RoleRoute allowedRoles={["user", "admin", "seeker", "owner"]}>
              <AddProperty />
            </RoleRoute>
          }
        />

        <Route
          path="/my-properties"
          element={
            <RoleRoute allowedRoles={["user", "admin", "seeker", "owner"]}>
              <MyProperties />
            </RoleRoute>
          }
        />

        <Route
          path="/edit-property/:id"
          element={
            <RoleRoute allowedRoles={["user", "admin", "seeker", "owner"]}>
              <EditProperty />
            </RoleRoute>
          }
        />

        <Route
          path="/account-settings"
          element={
            <RoleRoute allowedRoles={["user", "admin", "seeker", "owner"]}>
              <AccountSettings />
            </RoleRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Admin />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </RoleRoute>
          }
        />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  );
};
