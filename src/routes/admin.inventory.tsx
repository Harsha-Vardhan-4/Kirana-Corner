import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({ meta: [{ title: "Inventory" }] }),
  component: () => (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-1">Inventory Management</h1>
      <p className="text-sm text-muted-foreground mb-6">Update stock levels and availability</p>
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
                <td className="p-3"><div className="flex items-center gap-3 min-w-0"><img src={p.image} alt="" className="h-9 w-9 rounded object-cover shrink-0" /><span className="truncate">{p.name}</span></div></td>
                <td className="p-3"><Input type="number" defaultValue={p.stock} className="w-20" /></td>
                <td className="p-3">{p.stock > 0 ? <Badge className="bg-success text-success-foreground">In Stock</Badge> : <Badge variant="destructive">Out of Stock</Badge>}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => toast.success("Stock updated")}>Update</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast("Marked Out of Stock")}>Mark OOS</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  ),
});
