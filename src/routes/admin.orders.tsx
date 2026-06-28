import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/store";
import { toast } from "sonner";
import { requireAdmin } from "@/lib/adminGuard";


export const Route = createFileRoute("/admin/orders")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  head: () => ({ meta: [{ title: "Orders" }] }),
  component: OrdersPage,
});

const statuses = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const statusColor: Record<string, string> = {
  pending: "bg-muted text-foreground",
  confirmed: "bg-primary text-primary-foreground",
  packed: "bg-chart-3 text-white",
  out_for_delivery: "bg-accent text-accent-foreground",
  delivered: "bg-success text-success-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const { data, error } = await supabase
  .from("orders")
  .select(`
    *,
    profiles (
      full_name,
      phone,
      address,
      city,
      pincode
    )
  `)
  .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
    );

    toast.success("Order status updated");
  }
  if (loading) {
  return (
    <div className="p-6">
      <div className="h-96 rounded-xl bg-muted animate-pulse" />
    </div>
  );
}
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-1">
        Order Management
      </h1>

      <p className="text-sm text-muted-foreground mb-6">
        Track and update customer orders
      </p>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">
                  {o.id.slice(0, 8)}
                </td>

                <td className="p-3">
                  {o.profiles?.full_name || "Unknown"}
                </td>

                <td className="p-3">
                  {o.profiles?.phone || "-"}
                </td>

                <td className="p-3">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>

                <td className="p-3 font-medium">
                  {formatINR(Number(o.total_amount))}
                </td>

                <td className="p-3">
                  <Badge className={statusColor[o.status]}>
                    {o.status}
                  </Badge>
                </td>

                <td className="p-3">
                  <Select
                    value={o.status}
                    onValueChange={(value) =>
                      updateStatus(o.id, value)
                    }
                  >
                    <SelectTrigger className="w-44 h-8">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}