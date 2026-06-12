import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { placeholderOrders } from "@/lib/data";
import { formatINR } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders" }] }),
  component: Orders,
});

const statusColor: Record<string, string> = {
  Delivered: "bg-success text-success-foreground",
  "Out for Delivery": "bg-accent text-accent-foreground",
  Packed: "bg-chart-3 text-white",
  Confirmed: "bg-primary text-primary-foreground",
  Pending: "bg-muted text-foreground",
  Cancelled: "bg-destructive text-destructive-foreground",
};

function Orders() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-3">
        {placeholderOrders.map((o) => (
          <div key={o.id} className="rounded-xl border bg-card p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">Order #{o.id}</div>
              <div className="font-semibold">{o.items} items • {formatINR(o.total)}</div>
              <div className="text-xs text-muted-foreground">Placed on {o.date}</div>
            </div>
            <Badge className={statusColor[o.status]}>{o.status}</Badge>
            <Button asChild variant="outline" size="sm"><Link to="/">View Details</Link></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
