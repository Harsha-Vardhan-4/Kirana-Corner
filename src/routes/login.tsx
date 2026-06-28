import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Kirana Corner" }] }),
  component: Login,
});

function Login() {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-soft animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground font-bold text-xl shadow-soft">SL</div>
          <h1 className="mt-4 text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Login to continue shopping</p>
        </div>
        <form onSubmit={async (e) => {
  e.preventDefault();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success("Login successful");
  navigate({ to: "/" });
}} className="space-y-4">
          <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          <div><Label>Password</Label><Input
  type="password"
  required
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="••••••••"
/></div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
        </p>
        <div className="mt-6 border-t pt-4 text-center">
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">Admin login →</Link>
        </div>
      </div>
    </div>
  );
}
