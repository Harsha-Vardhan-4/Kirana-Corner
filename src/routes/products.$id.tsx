import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { categories } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { useCart, formatINR } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
if (!product) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 w-24 rounded bg-muted animate-pulse" />
          <div className="h-10 w-72 rounded bg-muted animate-pulse" />
          <div className="h-8 w-32 rounded bg-muted animate-pulse" />
          <div className="h-24 w-full rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
  const cat = categories.find((c) => c.id === product?.category_id);
  const inStock = product?.stock_quantity > 0;

  useEffect(() => {
  async function loadProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return;

    setProduct(data);
    console.log("PRODUCT FROM DB:", data);

    const { data: relatedProducts } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", data.category_id)
      .neq("id", data.id)
      .limit(4);

    setRelated(relatedProducts || []);
  }

  loadProduct();
}, [id]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border bg-muted aspect-square">
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-muted aspect-square cursor-pointer hover:border-primary">
                <img src={product.image_url} alt="" className="h-full w-full object-cover opacity-90" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {cat && <Badge variant="secondary">{cat.icon} {cat.name}</Badge>}
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <div className="text-sm text-muted-foreground">{product.unit}</div>

          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold">{formatINR(product.price)}</div>
            {product.mrp && (
              <>
                <div className="text-lg text-muted-foreground line-through">{formatINR(product.mrp)}</div>
                <Badge className="bg-success text-success-foreground">{Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF</Badge>
              </>
            )}
          </div>

          <div>
            {inStock ? (
              <Badge className="bg-success text-success-foreground">In Stock ({product.stock_quantity} available)</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center rounded-lg border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center hover:bg-muted"><Minus className="h-4 w-4" /></button>
              <div className="w-10 text-center font-medium">{qty}</div>
              <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center hover:bg-muted"><Plus className="h-4 w-4" /></button>
            </div>
            <Button
  size="lg"
  disabled={!inStock || product.stock_quantity <= 0}
  className="flex-1 gap-2"
  onClick={() => {
    if (product.stock_quantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    add(product, qty);
    toast.success(`Added ${qty} × ${product.name}`);
  }}
>
  <ShoppingCart className="h-4 w-4" />
  {product.stock_quantity <= 0
    ? "Out of Stock"
    : "Add to Cart"}
</Button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="flex flex-col items-center gap-1 rounded-lg border p-3 text-center text-xs">
              <Truck className="h-5 w-5 text-primary" /> Fast Delivery
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg border p-3 text-center text-xs">
              <ShieldCheck className="h-5 w-5 text-primary" /> Quality Assured
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg border p-3 text-center text-xs">
              <RefreshCw className="h-5 w-5 text-primary" /> Easy Returns
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
