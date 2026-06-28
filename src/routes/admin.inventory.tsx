import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { requireAdmin } from "@/lib/adminGuard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/inventory")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  head: () => ({ meta: [{ title: "Inventory" }] }),
  component: Inventory,
});

function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [updatedStock, setUpdatedStock] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {

    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
      toast.error("Failed to load products");
      return;
    }

    const productsData = data || [];
    setProducts(productsData);
    setUpdatedStock(
      productsData.reduce(
        (acc: Record<string, number>, product: any) => {
          acc[product.id] = product.stock_quantity;
          return acc;
        },
        {}
      )
    );
    setLoading(false);
  }

  async function updateStock(id: string, stock: number) {
    const { error } = await supabase
      .from("products")
      .update({
        stock_quantity: stock,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error("Failed to update stock");
      return;
    }

    toast.success("Stock updated");
    loadProducts();
  }
  if (loading) {
  return (
    <div className="p-6">
      <div className="h-96 rounded-xl bg-muted animate-pulse" />
    </div>
  );
}

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-1">
        Inventory Management
      </h1>

      <p className="text-sm text-muted-foreground mb-6">
        Update stock levels and availability
      </p>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Current Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-9 w-9 rounded object-cover shrink-0"
                    />

                    <span className="truncate">
                      {p.name}
                    </span>
                  </div>
                </td>

                <td className="p-3">
                  <Input
                    type="number"
                    value={updatedStock[p.id] ?? p.stock_quantity}
                    onChange={(event) =>
                      setUpdatedStock((prev) => ({
                        ...prev,
                        [p.id]: Number(event.target.value),
                      }))
                    }
                    className="w-20"
                  />
                </td>

                <td className="p-3">
                  {(updatedStock[p.id] ?? p.stock_quantity) > 0 ? (
                    <Badge className="bg-success text-success-foreground">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Out of Stock
                    </Badge>
                  )}
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStock(p.id, updatedStock[p.id] ?? p.stock_quantity)
                      }
                    >
                      Update
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateStock(p.id, 0)}
                    >
                      Mark OOS
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}