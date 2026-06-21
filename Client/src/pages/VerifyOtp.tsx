import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errorMessage";
import { authService } from "@/services/authService";

interface TempUser {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tempUser = JSON.parse(
      localStorage.getItem("tempUser") || "{}"
    ) as TempUser;

    if (!tempUser.email) {
      toast({
        title: "Verification session not found",
        description:
          "No pending account details found. Please sign up again.",
        variant: "destructive",
      });

      navigate("/register");
      return;
    }

    setLoading(true);

    try {
      // Verify OTP
      await authService.verifyOtp(
        tempUser.email,
        otp.trim()
      );

      // Register user
      await authService.register(
        tempUser.name ?? "",
        tempUser.email,
        tempUser.password ?? ""
      );

      localStorage.removeItem("tempUser");

      toast({
        title: "Account Created Successfully",
        description: "Welcome to Makany!",
      });

      navigate("/home");
    } catch (err: unknown) {
      console.error(err);

      toast({
        title: "Verification failed",
        description: getErrorMessage(
          err,
          "Invalid OTP code. Please try again."
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
            Enter OTP
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Please verify your account by entering the code sent to your
            email
          </p>
        </div>

        <div className="rounded-2xl bg-card p-8 shadow-card">
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
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
                : "Verify OTP & Register"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link
              to="/register"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
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

export default VerifyOtp;