import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile" }] }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="container mx-auto min-h-[60vh] grid place-items-center text-center px-4">
        <div>
          <p className="text-muted-foreground">Please login to view your profile.</p>
          <Button asChild className="mt-4"><Link to="/login">Login</Link></Button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid gap-6">
        <section className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-bold mb-4">Personal Information</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Name</Label><Input defaultValue={user.name} /></div>
            <div><Label>Email</Label><Input defaultValue={user.email} /></div>
            <div className="sm:col-span-2"><Label>Phone</Label><Input defaultValue={user.phone} /></div>
          </div>
          <Button className="mt-4">Save Changes</Button>
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Saved Addresses</h2>
            <Button size="sm" variant="outline" className="gap-1"><Plus className="h-4 w-4" /> Add</Button>
          </div>
          <div className="space-y-3">
            {[
              { label: "Home", addr: "12-3-45, Main Road, Hyderabad — 500001" },
              { label: "Office", addr: "Tower B, HiTech City, Hyderabad — 500081" },
            ].map((a) => (
              <div key={a.label} className="flex gap-3 rounded-lg border p-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-medium text-sm">{a.label}</div>
                  <div className="text-sm text-muted-foreground">{a.addr}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
