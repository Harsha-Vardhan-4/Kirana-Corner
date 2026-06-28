import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatINR } from "@/lib/store";

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetails,
});

function OrderDetails() {
  const { id } = Route.useParams();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadOrder() {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      setOrder(orderData);

      const { data: itemData } = await supabase
        .from("order_items")
        .select(`
          *,
          products (
            name,
            image_url
          )
        `)
        .eq("order_id", id);

      setItems(itemData || []);
    }

    loadOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="container mx-auto p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        Order Details
      </h1>

      <div className="rounded-xl border p-5 mb-6">
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>

        <p>
          <strong>Status:</strong> {order.status}
        </p>

        <p>
          <strong>Payment:</strong> {order.payment_method}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          {formatINR(Number(order.total_amount))}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border rounded-xl p-4"
          >
            <img
              src={item.products?.image_url}
              alt={item.products?.name}
              className="w-20 h-20 rounded-lg object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {item.products?.name}
              </h3>

              <p>Quantity: {item.quantity}</p>

              <p>
                Price: {formatINR(Number(item.price))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}