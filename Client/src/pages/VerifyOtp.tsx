import { useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e: any) => {
    e.preventDefault();

    const tempUser = JSON.parse(localStorage.getItem("tempUser") || "{}");

    try {
      // 🔥 verify OTP
      await axiosClient.post("/auth/verify-otp", {
        email: tempUser.email,
        otp: otp.trim(),
      });

      // ✅ AFTER success → register
      await axiosClient.post("/auth/register", tempUser);

      localStorage.removeItem("tempUser");

      alert("Account created ✅");

      navigate("/Home"); // 🔥 go to home
    } catch (err) {
      console.error(err);
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <h2>Enter OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtp;