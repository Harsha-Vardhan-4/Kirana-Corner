import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/store";

export const Route = createFileRoute("/orders/")({
  component: Orders,
});

const statusColor: Record<string, string> = {
  pending: "bg-muted text-foreground",
  delivered: "bg-success text-success-foreground",
  packed: "bg-chart-3 text-white",
  confirmed: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            product_id,
            quantity,
            price,
            products (name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
    }

    loadOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        My Orders
      </h1>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            No orders yet.
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl border bg-card p-4 shadow-card flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <div className="text-xs text-muted-foreground">
                  {o.order_items?.[0]?.products?.name ? o.order_items[0].products.name : `Order #${o.id.slice(0, 8)}`}
                </div>

                <div className="font-semibold">
                  {formatINR(Number(o.total_amount))}
                </div>

                <div className="text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()}
                </div>
              </div>

              <Badge className={statusColor[o.status] || ""}>
                {o.status}
              </Badge>

              <Button asChild variant="outline" size="sm">
                <Link
                  to="/orders/$id"
                  params={{ id: o.id }}
                >
                  View Details
                </Link>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}