import { createFileRoute } from "@tanstack/react-router";
import { Brain, AlertTriangle, TrendingUp, TrendingDown, Package } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";
import { requireAdmin } from "@/lib/adminGuard";

export const Route = createFileRoute("/admin/ai-insights")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  head: () => ({ meta: [{ title: "AI Insights" }] }),
  component: () => {
    const lowStock = products.filter((p) => p.stock < 20).slice(0, 5);
    const fastMoving = products.filter((p) => p.bestSeller).slice(0, 5);
    const slowMoving = products.slice(15, 20);
    const restock = products.filter((p) => p.stock < 50).slice(0, 5);
    const sections = [
      { title: "Low Stock Alerts", icon: AlertTriangle, color: "text-destructive bg-destructive/10", items: lowStock, badge: (p: any) => `${p.stock} left` },
      { title: "Fast Selling Products", icon: TrendingUp, color: "text-success bg-success/10", items: fastMoving, badge: () => "🔥 Trending" },
      { title: "Slow Moving Products", icon: TrendingDown, color: "text-warning-foreground bg-warning/20", items: slowMoving, badge: () => "Slow" },
      { title: "Suggested Restocking", icon: Package, color: "text-primary bg-primary/10", items: restock, badge: (p: any) => `Order ${100 - p.stock}` },
    ];
    return (
      <AdminLayout>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold">AI Inventory Insights</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Smart recommendations to optimize your inventory</p>
        <div className="grid md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className={`grid h-9 w-9 place-items-center rounded-lg ${s.color}`}><s.icon className="h-5 w-5" /></div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <div className="space-y-2">
                {s.items.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg border p-2 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={p.image} alt="" className="h-9 w-9 rounded object-cover shrink-0" />
                      <div className="truncate">{p.name}</div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">{s.badge(p)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  },
});
