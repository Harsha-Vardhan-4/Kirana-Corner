import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { useCart, formatINR } from "@/lib/store";
import { toast } from "sonner";


export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const inStock = product.stock_quantity > 0;
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all hover:shadow-soft hover:-translate-y-0.5">
      <Link to="/products/$id" params={{ id: product.id }} className="relative block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url ?? ""}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground">{discount}% OFF</Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
        <button className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100" aria-label="Wishlist">
          <Heart className="h-4 w-4" />
        </button>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="text-xs text-muted-foreground">{product.unit}</div>
        <Link to="/products/$id" params={{ id: product.id }} className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between pt-1">
          <div>
            <div className="text-base font-bold text-foreground">{formatINR(product.price)}</div>
            {product.mrp && <div className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</div>}
          </div>
          <Button
            size="sm"
            disabled={!inStock}
            onClick={(e) => { e.preventDefault(); add(product); toast.success(`${product.name} added`); }}
            className="gap-1"
          >
            <ShoppingCart className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
