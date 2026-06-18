import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axiosClient";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errorMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post("/auth/request-otp", { email });
      localStorage.setItem("resetEmail", email);
      toast({
        title: "OTP Sent Successfully",
        description: "Please check your email inbox for the verification code.",
      });
      navigate("/reset-password");
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Failed to send OTP",
        description: getErrorMessage(err, "Error sending OTP. Please try again."),
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
            <span className="font-heading text-2xl font-bold">Makany</span>
          </Link>
          <h1 className="mt-4 font-heading text-2xl font-bold">Forgot Password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email to receive a password reset OTP
          </p>
        </div>

        <div className="rounded-2xl bg-card p-8 shadow-card">
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email Address</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="mt-2 w-full gap-2" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
