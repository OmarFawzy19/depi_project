import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/lib/axiosClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e: any) => {
    e.preventDefault();

    try {
      await axiosClient.post("/auth/request-otp", { email });

      localStorage.setItem("resetEmail", email);

      alert("OTP sent to your email 📩");

      navigate("/reset-password");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error sending OTP ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSendOtp} className="flex flex-col gap-4 w-80">
        <h2 className="text-xl font-bold text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button className="bg-blue-500 text-white p-2 rounded">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;