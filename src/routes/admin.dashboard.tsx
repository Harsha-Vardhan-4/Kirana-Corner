import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle, IndianRupee } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { products, placeholderOrders, salesData, monthlySales } from "@/lib/data";
import { formatINR } from "@/lib/store";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard" }] }),
  component: Dashboard,
});

const statusColor: Record<string, string> = {
  Delivered: "bg-success text-success-foreground",
  "Out for Delivery": "bg-accent text-accent-foreground",
  Packed: "bg-chart-3 text-white",
  Confirmed: "bg-primary text-primary-foreground",
  Pending: "bg-muted text-foreground",
};

function Dashboard() {
  const lowStock = products.filter((p) => p.stock < 20);
  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "Total Orders", value: 142, icon: ShoppingBag, color: "bg-accent/10 text-accent" },
    { label: "Total Customers", value: 86, icon: Users, color: "bg-chart-3/10 text-chart-3" },
    { label: "Total Revenue", value: formatINR(478000), icon: IndianRupee, color: "bg-success/10 text-success" },
    { label: "Monthly Sales", value: formatINR(478000), icon: TrendingUp, color: "bg-warning/20 text-warning-foreground" },
    { label: "Low Stock Items", value: lowStock.length, icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">Overview of your store performance</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-card hover-lift">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <div className="mt-3 text-xl md:text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-8">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">Daily Sales (This Week)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="oklch(0.58 0.16 145)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">Monthly Sales</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="sales" fill="oklch(0.72 0.18 55)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-2">
            {placeholderOrders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-xs text-muted-foreground">{o.customer}</div>
                </div>
                <div className="font-medium">{formatINR(o.total)}</div>
                <Badge className={statusColor[o.status]}>{o.status}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">Low Inventory</h3>
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={p.image} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
                  <div className="truncate">{p.name}</div>
                </div>
                <Badge variant={p.stock === 0 ? "destructive" : "secondary"}>{p.stock} left</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
