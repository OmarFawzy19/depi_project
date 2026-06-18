import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/lib/errorMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axiosClient.post("/auth/request-otp", { email });
      localStorage.setItem("resetEmail", email);
      alert("OTP sent to your email");
      navigate("/reset-password");
    } catch (err: unknown) {
      console.error(err);
      alert(getErrorMessage(err, "Error sending OTP"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSendOtp} className="flex w-80 flex-col gap-4">
        <h2 className="text-center text-xl font-bold">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border p-2"
          required
        />

        <button className="rounded bg-blue-500 p-2 text-white">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
