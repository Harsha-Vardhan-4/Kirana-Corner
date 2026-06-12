import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Login" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-emerald-50 via-background to-orange-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-soft animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Sri Lakshmi Narasimha Store</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/admin/dashboard" }); }} className="space-y-4">
          <div><Label>Admin Email</Label><Input type="email" required defaultValue="admin@srilakshmi.com" /></div>
          <div><Label>Password</Label><Input type="password" required defaultValue="••••••••" /></div>
          <Button type="submit" className="w-full">Login to Dashboard</Button>
        </form>
      </div>
    </div>
  );
}
