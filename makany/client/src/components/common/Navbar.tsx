import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="border-b bg-white/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-700">Makany</Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          {["/", "/properties", "/dashboard"].map((path) => (
            <NavLink key={path} to={path} className={({ isActive }) => (isActive ? "text-indigo-600" : "text-slate-700")}>
              {path === "/" ? "Home" : path.replace("/", "").replace(/^./, (s) => s.toUpperCase())}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-slate-500 md:block">{user?.name}</span>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <NavLink to="/login" className="text-slate-700">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
