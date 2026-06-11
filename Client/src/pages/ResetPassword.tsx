import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/lib/axiosClient";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: any) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    if (!email) {
      alert("No email found ❌");
      return;
    }

    try {
      // ✅ verify OTP
      await axiosClient.post("/auth/verify-otp", {
        email,
        otp: otp.trim(),
      });

      // ✅ reset password
      await axiosClient.post("/auth/reset-password", {
        email,
        password,
      });

      localStorage.removeItem("resetEmail");

      alert("Password reset successfully ✅");

      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleReset} className="flex flex-col gap-4 w-80">
        <h2 className="text-xl font-bold text-center">Reset Password</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button className="bg-green-500 text-white p-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;