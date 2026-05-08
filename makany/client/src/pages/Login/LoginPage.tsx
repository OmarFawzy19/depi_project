import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("demo@makany.app");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate((location.state as { from?: string })?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm">
    <h2 className="text-2xl font-semibold">Login</h2>
    <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
    <input type="password" className="w-full rounded border p-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
    {error && <p className="text-sm text-red-600">{error}</p>}
    <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
  </form>;
};

export default LoginPage;
