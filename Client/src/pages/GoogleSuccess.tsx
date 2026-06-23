import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
  const token = searchParams.get("token");
  const userData = searchParams.get("user");

  if (!token || !userData) {
    navigate("/login", { replace: true });
    return;
  }

  try {
    const user = JSON.parse(decodeURIComponent(userData));

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    window.dispatchEvent(new Event("google-login"));

    navigate(user.role === "admin" ? "/admin" : "/home", {
      replace: true,
    });
  } catch (err) {
    console.error(err);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  }
}, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h2 className="text-lg font-semibold">
        Signing you in...
      </h2>
    </div>
  );
};

export default GoogleSuccess;