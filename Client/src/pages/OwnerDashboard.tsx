import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyGrid } from "@/components/PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
import { Plus, Home, Eye, MessageSquare } from "lucide-react";

const OwnerDashboard = () => {
  const { properties, loading } = useProperties();
  const mine = properties.slice(0, 3);

  const stats = [
    { icon: Home, label: "My listings", value: mine.length },
    { icon: Eye, label: "Total views", value: "1,284" },
    { icon: MessageSquare, label: "Inquiries", value: 12 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings and inquiries</p>
          </div>
          <Link to="/add-property">
            <Button><Plus className="h-4 w-4" /> Add Property</Button>
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 font-heading text-xl font-bold">My listings</h2>
        <PropertyGrid properties={mine} loading={loading} emptyMessage="You haven't listed any properties yet." />
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;