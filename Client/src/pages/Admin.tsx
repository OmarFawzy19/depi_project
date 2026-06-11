import { Trash2, Users, Home, DollarSign, BarChart3 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { useState } from "react";

const fakeUsers = [
  { id: "u1", name: "Alex Carter", email: "alex@makany.app", role: "buyer" },
  { id: "u2", name: "Sara Mohamed", email: "sara@makany.app", role: "owner" },
  { id: "u3", name: "Khaled Youssef", email: "khaled@makany.app", role: "owner" },
  { id: "u4", name: "Layla Ibrahim", email: "layla@makany.app", role: "buyer" },
];

const Admin = () => {
  const { properties: allProperties } = useProperties();
  const [list, setList] = useState(allProperties);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Platform</p>
          <h1 className="font-heading text-3xl font-bold">Admin panel</h1>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Users", value: fakeUsers.length },
            { icon: Home, label: "Listings", value: list.length },
            { icon: DollarSign, label: "Total value", value: `$${(list.reduce((s, p) => s + p.price, 0) / 1000).toFixed(0)}k` },
            { icon: BarChart3, label: "Visits today", value: "1.2k" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-5 shadow-card">
              <s.icon className="mb-3 h-6 w-6 text-primary" />
              <p className="font-heading text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-10 rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 font-heading text-lg font-semibold">Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Title</th><th>Type</th><th>Price</th><th>Location</th><th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="py-3 font-medium">{p.title}</td>
                    <td className="capitalize">{p.type}</td>
                    <td>${p.price.toLocaleString()}</td>
                    <td className="text-muted-foreground">{p.location}</td>
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setList((prev) => prev.filter((x) => x.id !== p.id))}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 font-heading text-lg font-semibold">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Name</th><th>Email</th><th>Role</th>
                </tr>
              </thead>
              <tbody>
                {fakeUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border/60">
                    <td className="py-3 font-medium">{u.name}</td>
                    <td className="text-muted-foreground">{u.email}</td>
                    <td className="capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;