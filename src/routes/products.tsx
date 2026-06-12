import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const search = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["price-asc", "price-desc", "name"]).optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Shop Products — Sri Lakshmi Kirana" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const sp = Route.useSearch();
  const navigate = Route.useNavigate();
  const [page, setPage] = useState(1);
  const perPage = 12;

  const list = useMemo(() => {
    let l = products.slice();
    if (sp.category) l = l.filter((p) => p.category === sp.category);
    if (sp.q) {
      const q = sp.q.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sp.sort === "price-asc") l.sort((a, b) => a.price - b.price);
    else if (sp.sort === "price-desc") l.sort((a, b) => b.price - a.price);
    else if (sp.sort === "name") l.sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [sp]);

  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const paged = list.slice((page - 1) * perPage, page * perPage);
  const activeCat = categories.find((c) => c.id === sp.category);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{activeCat ? activeCat.name : "All Products"}</h1>
        <p className="text-sm text-muted-foreground">{list.length} products</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="font-semibold mb-3 text-sm">Categories</div>
            <div className="space-y-1">
              <Link
                to="/products"
                search={{}}
                className={`block rounded px-2 py-1.5 text-sm ${!sp.category ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                All Products
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/products"
                  search={{ category: c.id }}
                  className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm ${sp.category === c.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <span>{c.icon}</span> {c.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products…"
                defaultValue={sp.q}
                onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value || undefined }) })}
                className="pl-9"
              />
            </div>
            <Select
              value={sp.sort ?? "default"}
              onValueChange={(v) => navigate({ search: (p) => ({ ...p, sort: v === "default" ? undefined : (v as any) }) })}
            >
              <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Recommended</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paged.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {paged.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-md text-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
