import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/lib/errorMessage";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    if (!email) {
      alert("No email found");
      return;
    }

    try {
      await axiosClient.post("/auth/verify-otp", {
        email,
        otp: otp.trim(),
      });

      await axiosClient.post("/auth/reset-password", {
        email,
        password,
      });

      localStorage.removeItem("resetEmail");
      alert("Password reset successfully");
      navigate("/login");
    } catch (err: unknown) {
      console.error(err);
      alert(getErrorMessage(err, "Something went wrong"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleReset} className="flex w-80 flex-col gap-4">
        <h2 className="text-center text-xl font-bold">Reset Password</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="rounded border p-2"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border p-2"
          required
        />

        <button className="rounded bg-green-500 p-2 text-white">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
