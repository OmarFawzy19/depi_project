import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/lib/errorMessage";
import { MapPin, KeyRound, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    if (!email) {
      toast({
        title: "Reset failed",
        description:
          "No reset request session found. Please request OTP again.",
        variant: "destructive",
      });

      navigate("/forgot-password");
      return;
    }

    setLoading(true);

    try {
      // Verify OTP
      await authService.verifyOtp(email, otp.trim());

      // Reset password
      await authService.resetPassword(email, password);

      localStorage.removeItem("resetEmail");

      toast({
        title: "Password Reset Successful",
        description:
          "Your password has been changed. You can now log in.",
      });

      navigate("/login");
    } catch (err: unknown) {
      console.error(err);

      toast({
        title: "Reset failed",
        description: getErrorMessage(
          err,
          "Something went wrong. Please check your OTP and try again."
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
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>

            <span className="font-heading text-2xl font-bold">
              Makany
            </span>
          </Link>

          <h1 className="mt-4 font-heading text-2xl font-bold">
            Reset Password
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter the OTP sent to your email and your new password
          </p>
        </div>

        <div className="rounded-2xl bg-card p-8 shadow-card">
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                OTP Code
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                <KeyRound className="h-4 w-4 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                New Password
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                <Lock className="h-4 w-4 text-muted-foreground" />

                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link
              to="/forgot-password"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Request a new code
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;