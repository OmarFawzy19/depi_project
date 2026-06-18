import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/lib/axiosClient";

interface TempUser {
  email?: string;
  [key: string]: unknown;
}

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tempUser = JSON.parse(localStorage.getItem("tempUser") || "{}") as TempUser;

    if (!tempUser.email) {
      alert("No pending account found");
      return;
    }

    try {
      await axiosClient.post("/auth/verify-otp", {
        email: tempUser.email,
        otp: otp.trim(),
      });

      await axiosClient.post("/auth/register", tempUser);

      localStorage.removeItem("tempUser");
      alert("Account created");
      navigate("/home");
    } catch (err: unknown) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
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
