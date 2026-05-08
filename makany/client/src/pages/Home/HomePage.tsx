import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const HomePage = () => (
  <section className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 p-10 text-white">
    <h1 className="text-4xl font-bold">Find Your Next Home</h1>
    <p className="mt-3 max-w-2xl text-indigo-100">A scalable React architecture with API services, context-driven auth, and reusable UI components.</p>
    <Link to="/properties" className="mt-6 inline-block"><Button>Browse Properties</Button></Link>
  </section>
);

export default HomePage;
