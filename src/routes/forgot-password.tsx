import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password" }] }),
  component: () => (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-soft animate-fade-in">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">We'll email you a reset link</p>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent to your email"); }} className="space-y-4">
          <div><Label>Email</Label><Input type="email" required /></div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  ),
});
