import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { monthlySales, salesData, products } from "@/lib/data";
import { formatINR } from "@/lib/store";

export const Route = createFileRoute("/admin/sales")({
  head: () => ({ meta: [{ title: "Sales Dashboard" }] }),
  component: () => {
    const bestSellers = products.filter((p) => p.bestSeller);
    const cards = [
      { label: "Daily Revenue", value: formatINR(22100) },
      { label: "Weekly Revenue", value: formatINR(134200) },
      { label: "Monthly Revenue", value: formatINR(478000) },
    ];
    return (
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-1">Sales Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">Revenue analytics & best sellers</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border bg-gradient-hero p-5 text-primary-foreground shadow-soft">
              <div className="text-xs opacity-90">{c.label}</div>
              <div className="text-3xl font-bold mt-1">{c.value}</div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <h3 className="font-semibold mb-4">Daily Sales Trend</h3>
            <div className="h-64"><ResponsiveContainer>
              <AreaChart data={salesData}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.58 0.16 145)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.58 0.16 145)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
                <Area type="monotone" dataKey="sales" stroke="oklch(0.58 0.16 145)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer></div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <h3 className="font-semibold mb-4">Monthly Revenue</h3>
            <div className="h-64"><ResponsiveContainer>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
                <Bar dataKey="sales" fill="oklch(0.72 0.18 55)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer></div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">Best Selling Products</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {bestSellers.map((p) => (
              <div key={p.id} className="flex gap-2 rounded-lg border p-3">
                <img src={p.image} alt="" className="h-12 w-12 rounded object-cover" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{formatINR(p.price)} • {Math.floor(Math.random() * 80) + 20} sold</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  },
});
