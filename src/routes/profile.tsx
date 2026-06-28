import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../lib/supabase";


export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile" }] }),
  component: Profile,
});

function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [form, setForm] = useState({
  full_name: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
});

  useEffect(() => {
    async function loadProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  setUser(user);

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  setProfile(data);

  if (data) {
    setForm({
      full_name: data.full_name || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      pincode: data.pincode || "",
    });
  }
}

    loadProfile();
  }, []);

  if (!user) {
    return (
      <div className="container mx-auto min-h-[60vh] grid place-items-center text-center px-4">
        <div>
          <p className="text-muted-foreground">
            Please login to view your profile.
          </p>
          <Button asChild className="mt-4">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="grid gap-6">
        <section className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-bold mb-4">Personal Information</h2>

          <div className="grid gap-3 sm:grid-cols-2">
  <div>
    <Label>Name</Label>
    <Input
      value={form.full_name}
      onChange={(e) =>
        setForm({ ...form, full_name: e.target.value })
      }
    />
  </div>

  <div>
    <Label>Email</Label>
    <Input value={user.email || ""} readOnly />
  </div>

  <div className="sm:col-span-2">
    <Label>Phone</Label>
    <Input
      value={form.phone}
      onChange={(e) =>
        setForm({ ...form, phone: e.target.value })
      }
    />
  </div>
</div>

<Button
  className="mt-4"
  onClick={async () => {
    await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
      })
      .eq("id", user.id);

    alert("Profile updated!");
  }}
>
  Save Changes
</Button>
          
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-card">
  <h2 className="font-bold mb-4">Delivery Address</h2>

  <div className="space-y-3">
    <div>
      <Label>Address</Label>
      <Input
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />
    </div>

    <div>
      <Label>City</Label>
      <Input
        value={form.city}
        onChange={(e) =>
          setForm({ ...form, city: e.target.value })
        }
      />
    </div>

    <div>
      <Label>Pincode</Label>
      <Input
        value={form.pincode}
        onChange={(e) =>
          setForm({ ...form, pincode: e.target.value })
        }
      />
    </div>

    <Button
      onClick={async () => {
        await supabase
          .from("profiles")
          .update({
            address: form.address,
            city: form.city,
            pincode: form.pincode,
          })
          .eq("id", user.id);

        alert("Address saved!");
      }}
    >
      Save Address
    </Button>
  </div>
</section>
      </div>
    </div>
  );
}