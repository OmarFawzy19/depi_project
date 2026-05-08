import { Link } from "react-router-dom";

const NotFound = () => <div className="py-16 text-center">
  <h1 className="text-4xl font-bold">404</h1>
  <p className="mt-2 text-slate-600">Page not found.</p>
  <Link to="/" className="mt-4 inline-block text-indigo-600">Go Home</Link>
</div>;

export default NotFound;
