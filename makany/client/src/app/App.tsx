import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import AppRoutes from "./routes";

const App = () => (
  <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <AppRoutes />
    </main>
    <Footer />
  </div>
);

export default App;
