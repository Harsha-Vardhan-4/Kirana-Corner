import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle, IndianRupee } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { salesData, monthlySales } from "@/lib/data";
import { formatINR } from "@/lib/store";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminGuard";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: async () => {
    await requireAdmin();
  },
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
  const [totalProducts, setTotalProducts] = useState(0);
const [totalOrders, setTotalOrders] = useState(0);
const [totalCustomers, setTotalCustomers] = useState(0);
const [totalRevenue, setTotalRevenue] = useState(0);

const [recentOrders, setRecentOrders] = useState<any[]>([]);
const [lowStock, setLowStock] = useState<any[]>([]);


const stats = [
  {
    label: "Total Products",
    value: totalProducts,
    icon: Package,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Total Orders",
    value: totalOrders,
    icon: ShoppingBag,
    color: "bg-accent/10 text-accent",
  },
  {
    label: "Total Customers",
    value: totalCustomers,
    icon: Users,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    label: "Total Revenue",
    value: formatINR(totalRevenue),
    icon: IndianRupee,
    color: "bg-success/10 text-success",
  },
  {
    label: "Low Stock Items",
    value: lowStock.length,
    icon: AlertTriangle,
    color: "bg-destructive/10 text-destructive",
  },
];

useEffect(() => {
  async function loadDashboard() {
    const [
      productsRes,
      ordersRes,
      customersRes,
      recentOrdersRes,
      lowStockRes,
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),

      supabase.from("orders").select("total_amount"),

      supabase.from("profiles").select("*", {
        count: "exact",
        head: true,
      }),

      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("products")
        .select("*")
        .lte("stock_quantity", 20)
        .order("stock_quantity"),
    ]);

    setTotalProducts(productsRes.count || 0);

    setTotalCustomers(customersRes.count || 0);

    setRecentOrders(recentOrdersRes.data || []);

    setLowStock(lowStockRes.data || []);

    const orders = ordersRes.data || [];

    setTotalOrders(orders.length);

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    setTotalRevenue(revenue);
  }

  loadDashboard();
}, []);

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
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
  <div>
    <div className="font-medium">
      {o.id.slice(0, 8)}
    </div>

    <div className="text-xs text-muted-foreground">
      {new Date(o.created_at).toLocaleDateString()}
    </div>
  </div>

  <div className="font-medium">
    {formatINR(Number(o.total_amount))}
  </div>

  <Badge>
    {o.status}
  </Badge>
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
                  <img src={p.image_url} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
                  <div className="truncate">{p.name}</div>
                </div>
                <Badge variant={p.stock_quantity === 0 ? "destructive" : "secondary"}>{p.stock_quantity} left</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
