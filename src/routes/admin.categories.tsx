import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { categories, products } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [{ title: "Categories" }] }),
  component: () => (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-sm text-muted-foreground">Organize your product catalogue</p>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-1"><Plus className="h-4 w-4" /> Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Category added"); }} className="space-y-3">
              <div><Label>Name</Label><Input required /></div>
              <div><Label>Emoji Icon</Label><Input placeholder="🛒" /></div>
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-xl border bg-card p-4 shadow-card hover-lift">
            <div className={`grid h-12 w-12 place-items-center rounded-full ${c.color} text-2xl`}>{c.icon}</div>
            <div className="mt-3 font-semibold">{c.name}</div>
            <div className="text-xs text-muted-foreground">{products.filter((p) => p.category === c.id).length} products</div>
            <div className="mt-3 flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => toast("Edit")}><Edit2 className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => toast("Deleted")}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  ),
});
