import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart, formatINR } from "@/lib/store";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";


export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Kirana Corner" }] }),
  component: Checkout,
});



function Checkout() {
  const [profile, setProfile] = useState<any>(null);
  const { items, total, clear } = useCart();
  const [payment, setPayment] = useState("cod");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const grand = total + (total < 499 ? 40 : 0);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    }

    loadProfile();
  }, []);

  const place = async (e: React.FormEvent) => {
    e.preventDefault();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error("Please login first");
    return;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: grand,
      payment_method: payment,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    console.error(orderError);
    toast.error("Failed to place order");
    return;
  }

  const orderItems = items.map(({ product, qty }) => ({
    order_id: order.id,
    product_id: product.id,
    quantity: qty,
    price: product.price,
  }));

  const { error: itemError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemError) {
    console.error(itemError);
    toast.error("Failed to save order items");
    return;
  }

  // Check stock and reduce inventory
for (const item of items) {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, stock_quantity")
    .eq("id", item.product.id)
    .single();

  if (productError || !product) {
    toast.error(`Product not found: ${item.product.name}`);
    return;
  }

  if (product.stock_quantity < item.qty) {
    toast.error(
      `${item.product.name} only has ${product.stock_quantity} items left`
    );
    return;
  }

  const newStock = product.stock_quantity - item.qty;

  const { error: updateError } = await supabase
    .from("products")
    .update({
      stock_quantity: newStock,
      stock_status:
        newStock <= 0 ? "out_of_stock" : "in_stock",
    })
    .eq("id", product.id);

  if (updateError) {
    console.error(updateError);
    toast.error("Failed to update inventory");
    return;
  }
}

  setDone(true);
  clear();
  toast.success("Order placed successfully!");

  setTimeout(() => {
    navigate({ to: "/orders" });
  }, 1800);
};

  if (done) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center px-4 animate-fade-in">
        <CheckCircle2 className="h-20 w-20 text-success mb-4" />
        <h2 className="text-2xl font-bold">Order Confirmed!</h2>
        <p className="text-muted-foreground mt-2">Redirecting to your orders…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={place} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="font-bold mb-4">Delivery Address</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Full Name</Label><Input required value={profile?.full_name || ""} readOnly /></div>
              <div><Label>Phone</Label><Input required value={profile?.phone || ""} readOnly /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input required value={profile?.address || ""} readOnly /></div>
              <div><Label>City</Label><Input required value={profile?.city || ""} readOnly /></div>
              <div><Label>Pincode</Label><Input required value={profile?.pincode || ""} readOnly /></div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="font-bold mb-4">Payment Method</h2>
            <RadioGroup value={payment} onValueChange={setPayment} className="space-y-2">
              {[
                { v: "cod", l: "Cash on Delivery" },
                { v: "upi", l: "UPI" },
                { v: "credit", l: "Credit Card" },
                { v: "debit", l: "Debit Card" },
              ].map((o) => (
                <label key={o.v} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted">
                  <RadioGroupItem value={o.v} id={o.v} />
                  <Label htmlFor={o.v} className="cursor-pointer">{o.l}</Label>
                </label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <aside className="rounded-xl border bg-card p-5 shadow-card h-fit sticky top-20">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm max-h-60 overflow-y-auto mb-3">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between gap-2">
                <span className="line-clamp-1">{qty} × {product.name}</span>
                <span className="shrink-0">{formatINR(product.price * qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(total)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{total >= 499 ? "FREE" : formatINR(40)}</span></div>
            <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold"><span>Total</span><span>{formatINR(grand)}</span></div>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={items.length === 0}>Place Order</Button>
        </aside>
      </form>
    </div>
  );
}
