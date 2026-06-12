import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { placeholderOrders } from "@/lib/data";
import { formatINR } from "@/lib/store";
import { toast } from "sonner";

const statuses = ["Pending", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"];
const statusColor: Record<string, string> = {
  Delivered: "bg-success text-success-foreground",
  "Out for Delivery": "bg-accent text-accent-foreground",
  Packed: "bg-chart-3 text-white",
  Confirmed: "bg-primary text-primary-foreground",
  Pending: "bg-muted text-foreground",
  Cancelled: "bg-destructive text-destructive-foreground",
};

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders" }] }),
  component: () => (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-1">Order Management</h1>
      <p className="text-sm text-muted-foreground mb-6">Track and update customer orders</p>
      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3 hidden md:table-cell">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {placeholderOrders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3 hidden md:table-cell">{o.date}</td>
                <td className="p-3 font-medium">{formatINR(o.total)}</td>
                <td className="p-3"><Badge className={statusColor[o.status]}>{o.status}</Badge></td>
                <td className="p-3">
                  <Select defaultValue={o.status} onValueChange={() => toast.success("Status updated")}>
                    <SelectTrigger className="w-40 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  ),
});
