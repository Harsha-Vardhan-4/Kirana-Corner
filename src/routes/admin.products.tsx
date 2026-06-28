import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminGuard";


export const Route = createFileRoute("/admin/products")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  head: () => ({ meta: [{ title: "Product Management" }] }),
  component: ProductsAdmin,
});

function ProductsAdmin() {

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editUnit, setEditUnit] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

useEffect(() => {
  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (!error && data) {
      setProducts(data);
    }

    console.log("PRODUCTS:", data);
  }

  loadProducts();
}, []);

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
            <form className="space-y-3" onSubmit={async (e) => {
  e.preventDefault();

  const { error } = await supabase
    .from("products")
    .insert([
      {
        name,
        description,
        price: Number(price),
        stock_quantity: Number(stock),
        unit,
      },
    ]);

  if (error) {
    console.log(error);
    toast.error("Failed to add product");
  } else {
    toast.success("Product added successfully");

    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setUnit("");
    setCategoryId("");
  }
}}>
              <div><Label>Name</Label><Input
  required
  value={name}
  onChange={(e) => setName(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label>
                  <Select onValueChange={setCategoryId}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Price (₹)</Label><Input
  type="number"
  required
  value={price}
  onChange={(e) => setPrice(e.target.value)}
/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Stock</Label><Input
  type="number"
  required
  value={stock}
  onChange={(e) => setStock(e.target.value)}
/></div>
                <div><Label>Unit</Label><Input
  placeholder="e.g. 1 kg"
  value={unit}
  onChange={(e) => setUnit(e.target.value)}
/></div>
              </div>
              <div><Label>Description</Label><Textarea
  rows={3}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/></div>
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
              <th className="p-3">Status</th>
<th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/30">
                <td className="p-3"><div className="flex items-center gap-3 min-w-0"><img src={p.image} alt="" className="h-10 w-10 rounded object-cover shrink-0" /><div className="truncate font-medium">{p.name}</div></div></td>
                <td className="p-3 hidden sm:table-cell capitalize">{p.category}</td>
                <td className="p-3 font-medium">{formatINR(p.price)}</td>
                <td className="p-3 hidden md:table-cell">
  {p.stock_quantity}
</td>
                <td className="p-3">
  {p.stock_status === "out_of_stock" ? (
    <span className="rounded bg-red-500 px-2 py-1 text-white text-xs">
      Out of Stock
    </span>
  ) : (
    <span className="rounded bg-green-500 px-2 py-1 text-white text-xs">
      In Stock
    </span>
  )}
</td>

<td className="p-3">
  <div className="flex gap-1">
                    <Button
  size="icon"
  variant="ghost"
  onClick={() => {
    setEditingProduct(p);

    setEditName(p.name || "");
    setEditDescription(p.description || "");
    setEditPrice(String(p.price || ""));
    setEditStock(String(p.stock_quantity || ""));
    setEditUnit(p.unit || "");
  }}
>
  <Edit2 className="h-4 w-4" />
</Button>
                    <Button
  size="icon"
  variant="ghost"
  onClick={async () => {
    const confirmDelete = window.confirm(
      `Delete ${p.name}?`
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", p.id);

    if (error) {
      toast.error("Failed to delete");
      console.log(error);
      return;
    }

    setProducts(products.filter((x) => x.id !== p.id));
    toast.success("Product deleted");
  }}
>
  <Trash2 className="h-4 w-4 text-destructive" />
</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
  open={!!editingProduct}
  onOpenChange={(open) => {
    if (!open) setEditingProduct(null);
  }}
>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Edit Product</DialogTitle>
    </DialogHeader>

    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();

        const { error } = await supabase
          .from("products")
          .update({
            name: editName,
            description: editDescription,
            price: Number(editPrice),
            stock_quantity: Number(editStock),
            unit: editUnit,
          })
          .eq("id", editingProduct.id);

        if (error) {
          console.log(error);
          toast.error("Update failed");
          return;
        }

        setProducts(
          products.map((x) =>
            x.id === editingProduct.id
              ? {
                  ...x,
                  name: editName,
                  description: editDescription,
                  price: Number(editPrice),
                  stock_quantity: Number(editStock),
                  unit: editUnit,
                }
              : x
          )
        );

        toast.success("Product updated");
        setEditingProduct(null);
      }}
    >
      <div>
        <Label>Name</Label>
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
          />
        </div>

        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            value={editStock}
            onChange={(e) => setEditStock(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Unit</Label>
        <Input
          value={editUnit}
          onChange={(e) => setEditUnit(e.target.value)}
        />
      </div>

      <DialogFooter>
        <Button type="submit">
          Update Product
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
    </AdminLayout>
  );
}
