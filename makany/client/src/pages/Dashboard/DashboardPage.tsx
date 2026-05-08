import PropertiesPage from "../Properties/PropertiesPage";

const DashboardPage = () => (
  <section className="space-y-4">
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <p className="text-slate-600">Track your latest properties and API-backed insights.</p>
    <PropertiesPage />
  </section>
);

export default DashboardPage;
