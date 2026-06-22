import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Power,
  PowerOff,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/AuthContext";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent";

/* ─── Tab Navigation ────────────────────────────────────────────── */
const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "account", label: "Account", icon: Power },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ─── Profile Tab ───────────────────────────────────────────────── */
function ProfileTab({ user, onUserUpdate }: {
  user: { name: string; email: string; phone?: string };
  onUserUpdate: (updated: { name: string; email: string; phone?: string }) => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await userService.updateProfile({ name, email, phone });

      // Update localStorage user
      const storedUser = JSON.parse(localStorage.getItem("user") ?? "{}");
      const newUser = { ...storedUser, name: updated.name, email: updated.email, phone: updated.phone };
      localStorage.setItem("user", JSON.stringify(newUser));

      onUserUpdate({ name: updated.name, email: updated.email, phone: updated.phone });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      toast({ title: "Profile updated ✅" });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Failed to update profile";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-xl">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your personal details. These will be visible to other users.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-xl font-bold text-white shadow-glow">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-heading font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                  placeholder="+20 123 456 7890"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving} className="gap-2 rounded-xl">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : null}
                {saving ? "Saving..." : success ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Security Tab ──────────────────────────────────────────────── */
function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await userService.changePassword(currentPassword, newPassword);

      toast({ title: "Password changed ✅" });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Failed to change password";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-xl">
            <Lock className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Keep your account secure by using a strong password.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputCls}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputCls}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={saving} className="gap-2 rounded-xl">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Status Card */}
      <Card className="mt-6 border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-xl">
            <Shield className="h-5 w-5 text-primary" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Account Active</p>
              <p className="text-sm text-muted-foreground">
                Your account is in good standing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Account Tab (Danger Zone) ─────────────────────────────────── */
function AccountTab() {
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeactivate = async () => {
    if (!deactivatePassword) {
      toast({
        title: "Password required",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      await userService.deactivateAccount(deactivatePassword);

      toast({ title: "Account deactivated" });

      logout();
      navigate("/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Failed to deactivate";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) {
      toast({
        title: "Password required",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      await userService.deleteAccount(deletePassword);

      toast({ title: "Account deleted permanently" });

      logout();
      navigate("/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Failed to delete account";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Deactivate Account */}
      <Card className="border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-xl text-yellow-600">
            <PowerOff className="h-5 w-5" />
            Deactivate Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Temporarily disable your account. Your data will be preserved and
            you can reactivate at any time.
          </p>
        </CardHeader>

        <CardContent>
          {!showDeactivateConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeactivateConfirm(true)}
              className="gap-2 border-yellow-500/40 text-yellow-600 hover:bg-yellow-500/10"
            >
              <PowerOff className="h-4 w-4" />
              Deactivate Account
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-700">
                    Are you sure?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your account will be disabled and you won't be able to log
                    in until reactivated. Your properties and data will remain
                    safe.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Confirm your password
                </label>
                <input
                  type="password"
                  value={deactivatePassword}
                  onChange={(e) => setDeactivatePassword(e.target.value)}
                  className={inputCls}
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDeactivate}
                  disabled={processing}
                  className="gap-2 bg-yellow-600 hover:bg-yellow-700"
                >
                  {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirm Deactivation
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDeactivateConfirm(false);
                    setDeactivatePassword("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-xl text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Account Permanently
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            This action is irreversible. All your data including properties,
            favorites, and personal information will be permanently removed.
          </p>
        </CardHeader>

        <CardContent>
          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">
                    This cannot be undone!
                  </p>
                  <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                    <li>All your properties will be removed</li>
                    <li>Your favorites list will be deleted</li>
                    <li>Your personal data will be permanently erased</li>
                    <li>You will not be able to recover this account</li>
                  </ul>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className={inputCls}
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={processing || !deletePassword}
                  className="gap-2"
                >
                  {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete My Account Forever
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
const AccountSettings = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>(
    (searchParams.get("tab") as TabId) || "profile",
  );

  // Keep a local copy of user for optimistic updates
  const [localUser, setLocalUser] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  useEffect(() => {
    if (user) {
      setLocalUser({
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Settings
          </p>
          <h1 className="font-heading text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, security, and account preferences.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full shrink-0 lg:w-56"
          >
            <nav className="flex gap-1 lg:flex-col">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* Tab Content */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <ProfileTab
                  key="profile"
                  user={localUser}
                  onUserUpdate={setLocalUser}
                />
              )}
              {activeTab === "security" && <SecurityTab key="security" />}
              {activeTab === "account" && <AccountTab key="account" />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountSettings;
