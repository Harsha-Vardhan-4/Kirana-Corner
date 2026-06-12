import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, formatINR } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Sri Lakshmi Kirana" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total } = useCart();
  const delivery = total > 0 && total < 499 ? 40 : 0;
  const grand = total + delivery;

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground mt-2">Add some products to get started.</p>
        <Button asChild className="mt-6"><Link to="/products">Shop Now</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Cart ({items.length})</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-3 rounded-xl border bg-card p-3 shadow-card">
              <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <Link to="/products/$id" params={{ id: product.id }} className="line-clamp-2 text-sm font-medium hover:text-primary">{product.name}</Link>
                <div className="text-xs text-muted-foreground">{product.unit}</div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center rounded-lg border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="grid h-8 w-8 place-items-center hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <div className="w-8 text-center text-sm">{qty}</div>
                    <button onClick={() => setQty(product.id, qty + 1)} className="grid h-8 w-8 place-items-center hover:bg-muted"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="font-bold">{formatINR(product.price * qty)}</div>
                </div>
              </div>
              <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <aside className="rounded-xl border bg-card p-5 shadow-card h-fit sticky top-20">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(total)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{delivery === 0 ? "FREE" : formatINR(delivery)}</span></div>
            <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold"><span>Total</span><span>{formatINR(grand)}</span></div>
          </div>
          <Button asChild className="w-full mt-4"><Link to="/checkout">Proceed to Checkout</Link></Button>
          {delivery > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">Add {formatINR(499 - total)} more for FREE delivery</p>
          )}
        </aside>
      </div>
    </div>
  );
}
