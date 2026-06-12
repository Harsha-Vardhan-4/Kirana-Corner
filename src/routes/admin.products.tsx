import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Upload } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { products, categories } from "@/lib/data";
import { formatINR } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Product Management" }] }),
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const [q, setQ] = useState("");
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-sm text-muted-foreground">Add, edit and manage products</p>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-1"><Plus className="h-4 w-4" /> Add Product</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success("Product added"); }}>
              <div><Label>Name</Label><Input required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Price (₹)</Label><Input type="number" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Stock</Label><Input type="number" required /></div>
                <div><Label>Unit</Label><Input placeholder="e.g. 1 kg" /></div>
              </div>
              <div><Label>Description</Label><Textarea rows={3} /></div>
              <div>
                <Label>Product Image</Label>
                <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 cursor-pointer hover:bg-muted">
                  <Upload className="h-4 w-4" /><span className="text-sm text-muted-foreground">Click to upload image</span>
                </div>
              </div>
              <DialogFooter><Button type="submit">Save Product</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-3">Product</th>
              <th className="p-3 hidden sm:table-cell">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3 hidden md:table-cell">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/30">
                <td className="p-3"><div className="flex items-center gap-3 min-w-0"><img src={p.image} alt="" className="h-10 w-10 rounded object-cover shrink-0" /><div className="truncate font-medium">{p.name}</div></div></td>
                <td className="p-3 hidden sm:table-cell capitalize">{p.category}</td>
                <td className="p-3 font-medium">{formatINR(p.price)}</td>
                <td className="p-3 hidden md:table-cell">{p.stock}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => toast("Edit product")}><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => toast("Deleted")}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
