import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  KeyRound,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errorMessage";
import { authService } from "@/services/authService";

interface TempUser {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
}

const LoginUnlockOtp = () => {
  const [otp, setOtp] = useState("");
const [loading, setLoading] = useState(false);

const navigate = useNavigate();
const { toast } = useToast();

const email = localStorage.getItem("unlockEmail") || "";

  const handleVerify = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);

  try {
    await authService.verifyUnlockOtp(email, otp);

    localStorage.removeItem("unlockEmail");

    toast({
      title: "Account unlocked",
      description: "You can now login normally.",
    });

    navigate("/login");
  } catch (err) {
    toast({
      title: "Verification failed",
      description: getErrorMessage(
        err,
        "Invalid or expired OTP."
      ),
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>

            <span className="font-heading text-2xl font-bold">
              Makany
            </span>
          </Link>

          <h1 className="mt-4 font-heading text-2xl font-bold">
            Unlock Account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Your account was locked after several failed login attempts. Enter the verification code sent to your email to unlock it immediately.
          </p>
        </div>

        <div className="rounded-2xl bg-card p-8 shadow-card">
          <form
            onSubmit={handleVerify}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                OTP Code
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                <KeyRound className="h-4 w-4 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 w-full gap-2"
              size="lg"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Verifying..."
                : "Unlock Account"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link
              to="/register"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUnlockOtp;