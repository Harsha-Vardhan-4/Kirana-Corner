import { redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export async function requireAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect({
      to: "/admin",
    });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();


  if (profile?.role !== "admin") {
    throw redirect({
      to: "/",
    });
  }

  return user;
}