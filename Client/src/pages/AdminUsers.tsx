import { useEffect, useState } from "react";
import { Users, Pause, Play, Trash2, Home } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "deactivated";
  propertiesCount: number;
  createdAt: string;
};

type ConfirmAction = "pause" | "remove" | null;

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get<AdminUser[]>("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openConfirm = (action: ConfirmAction, id: string) => {
    setConfirmAction(action);
    setConfirmTargetId(id);
    setConfirmOpen(true);
  };

  const handlePause = async (id: string) => {
    try {
      setActionId(id);
      await api.put(`/admin/users/${id}/pause`, {});
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, status: "deactivated" } : user,
        ),
      );
      toast({ title: "User paused successfully", variant: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to pause user", variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      setActionId(id);
      await api.put(`/admin/users/${id}/activate`, {});
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, status: "active" } : user,
        ),
      );
      toast({ title: "User activated successfully", variant: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to activate user", variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      setActionId(id);
      await api.del(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast({ title: "User removed successfully", variant: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "User must be paused before removing", variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const handleConfirm = () => {
    if (!confirmTargetId) return;

    if (confirmAction === "pause") {
      handlePause(confirmTargetId);
    } else if (confirmAction === "remove") {
      handleRemove(confirmTargetId);
    }

    setConfirmOpen(false);
    setConfirmAction(null);
    setConfirmTargetId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Admin
          </p>

          <h1 className="font-heading text-3xl font-bold">Users</h1>

          <p className="text-muted-foreground">
            Manage users, pause accounts, and remove inactive users.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-card p-5 shadow-card">
            <Users className="mb-3 h-6 w-6 text-primary" />
            <p className="font-heading text-2xl font-bold">{users.length}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>

          <div className="rounded-2xl bg-card p-5 shadow-card">
            <Play className="mb-3 h-6 w-6 text-green-500" />
            <p className="font-heading text-2xl font-bold">
              {users.filter((u) => u.status === "active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>

          <div className="rounded-2xl bg-card p-5 shadow-card">
            <Pause className="mb-3 h-6 w-6 text-red-500" />
            <p className="font-heading text-2xl font-bold">
              {users.filter((u) => u.status === "deactivated").length}
            </p>
            <p className="text-sm text-muted-foreground">Paused Users</p>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 font-heading text-lg font-semibold">All Users</h2>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Properties</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-border/60">
                      <td className="py-4">
                        <div className="font-semibold">{user.name}</div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Home className="h-3 w-3" />
                          {user.propertiesCount} properties
                        </div>
                      </td>

                      <td className="text-muted-foreground">{user.email}</td>

                      <td className="text-muted-foreground">
                        {user.phone || "No phone"}
                      </td>

                      <td className="font-semibold">{user.propertiesCount}</td>

                      <td>
                        <span
                          className={
                            user.status === "active"
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                              : "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                          }
                        >
                          {user.status === "active" ? "Active" : "Paused"}
                        </span>
                      </td>

                      <td className="flex gap-2 py-4">
                        {user.status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionId === user._id}
                            onClick={() => openConfirm("pause", user._id)}
                          >
                            <Pause className="mr-1 h-4 w-4" />
                            Pause
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-700"
                            disabled={actionId === user._id}
                            onClick={() => handleActivate(user._id)}
                          >
                            <Play className="mr-1 h-4 w-4" />
                            Activate
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={
                            actionId === user._id ||
                            user.status !== "deactivated"
                          }
                          onClick={() => openConfirm("remove", user._id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
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
        show={confirmOpen}
        title={confirmAction === "pause" ? "Pause User" : "Remove User"}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        confirmText={confirmAction === "pause" ? "Pause" : "Remove"}
      >
        <p className="text-sm text-muted-foreground">
          {confirmAction === "pause"
            ? "Are you sure you want to pause this user?"
            : "This will remove the user and all related properties. Continue?"}
        </p>
      </Modal>
    </div>
  );
};

export default AdminUsers;