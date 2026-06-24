import React, { useState, useEffect } from "react";
import { Users, Home, DollarSign, BarChart3, Check, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { api } from "@/services/api";

type Property = {
  _id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  owner?: {
    name?: string;
    email?: string;
  };
  status: string;
};

const Admin = () => {
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await api.get<Property[]>("/admin/properties/pending");
      setPendingProperties(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load pending properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionId(id);

      await api.put(`/admin/properties/${id}/approve`, {});

      setPendingProperties((prev) => prev.filter((p) => p._id !== id));

      alert("Property approved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to approve property");
    } finally {
      setActionId(null);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectingId) return;

    if (!rejectReason || rejectReason.trim() === "") {
      alert("Rejection reason is required");
      return;
    }

    try {
      setActionId(rejectingId);

      await api.put(`/admin/properties/${rejectingId}/reject`, {
        reason: rejectReason.trim(),
      });

      setPendingProperties((prev) => prev.filter((p) => p._id !== rejectingId));

      setRejectModalOpen(false);
      setRejectingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to reject property");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Platform
          </p>
          <h1 className="font-heading text-3xl font-bold">Admin Panel</h1>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Pending", value: pendingProperties.length },
            { icon: Home, label: "Listings", value: pendingProperties.length },
            // {
            //   icon: DollarSign,
            //   label: "Pending value",
            //   value: `$${(
            //     pendingProperties.reduce((s, p) => s + p.price, 0) / 1000
            //   ).toFixed(0)}k`,
            // },
            // { icon: BarChart3, label: "Visits today", value: "1.2k" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-5 shadow-card">
              <s.icon className="mb-3 h-6 w-6 text-primary" />
              <p className="font-heading text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-10 rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 font-heading text-lg font-semibold">
            Pending Listings
          </h2>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : pendingProperties.length === 0 ? (
            <p className="text-muted-foreground">No pending listings 🎉</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Title</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Owner Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingProperties.map((p) => (
                    <tr key={p._id} className="border-b border-border/60">
                      <td className="py-3 font-medium">{p.title}</td>
                      <td className="capitalize">{p.type}</td>
                      <td>${p.price.toLocaleString()}</td>
                      <td className="text-muted-foreground">
                        {p.location || "No location"}
                      </td>
                      <td className="text-muted-foreground">
                        {p.owner?.name || "Unknown"}
                      </td>
                      <td className="text-muted-foreground">
                        {p.owner?.email || "No email"}
                      </td>

                      <td className="flex gap-2 py-3">
                        <Button
                          className="bg-green-600 text-white hover:bg-green-700"
                          size="sm"
                          disabled={actionId === p._id}
                          onClick={() => handleApprove(p._id)}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>

                        <Button
                          className="bg-red-600 text-white hover:bg-red-700"
                          size="sm"
                          disabled={actionId === p._id}
                          onClick={() => openRejectModal(p._id)}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <Modal
        show={rejectModalOpen}
        title="Rejection Reason"
        onClose={() => setRejectModalOpen(false)}
        onConfirm={confirmReject}
        confirmText="Reject Property"
      >
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason here..."
          className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          rows={1}
        />
      </Modal>
    </div>
  );
};

export default Admin;