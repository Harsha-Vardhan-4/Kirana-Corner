import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";




export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Login" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  
useEffect(() => {
  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      navigate({ to: "/admin/dashboard" });
    }
  }

  checkAdmin();
}, []);
  
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Login failed");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      toast.error("You are not an admin");
      return;
    }

    toast.success("Admin login successful");

    navigate({
      to: "/admin/dashboard",
    });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-emerald-50 via-background to-orange-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-soft animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">
            Please login with your admin credentials to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label>Admin Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Login to Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}