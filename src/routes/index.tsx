import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OffersCarousel } from "@/components/offers-carousel";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sri Lakshmi Narasimha Kirana & General Store — Fresh Groceries Delivered" },
      { name: "description", content: "Modern online kirana store — rice, dals, snacks, household & more at best prices." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);
  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-background to-orange-50">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center animate-fade-in">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Free delivery above ₹499
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight text-foreground">
              Daily essentials, <span className="text-primary">delivered fresh</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-md">
              Your neighbourhood kirana store — now online. Browse 1000+ products with the best prices and lightning-fast delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/products">Shop Now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/products">Browse Categories</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Fast delivery</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Quality assured</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Open 7-days</div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
            <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-3">
              {products.slice(0, 4).map((p, i) => (
                <div key={p.id} className={`overflow-hidden rounded-2xl bg-card shadow-card animate-fade-in ${i % 2 ? "translate-y-6" : ""}`}>
                  <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <OffersCarousel />
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <p className="text-sm text-muted-foreground">Find everything you need</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/products"
              search={{ category: c.id }}
              className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className={`grid h-14 w-14 place-items-center rounded-full ${c.color} text-3xl transition-transform group-hover:scale-110`}>
                {c.icon}
              </div>
              <div className="text-xs font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <p className="text-sm text-muted-foreground">Hand-picked daily essentials</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Best Sellers</h2>
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {bestSellers.map((p) => (
            <div key={p.id} className="min-w-[180px] md:min-w-[220px] max-w-[220px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant */}
      <section className="container mx-auto px-4">
        <div className="overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-12 text-primary-foreground shadow-soft">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                <Sparkles className="h-3 w-3" /> AI Powered
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold">Need help finding products?</h3>
              <p className="mt-2 opacity-90 max-w-xl">Chat with our smart shopping assistant. Get recommendations, check availability, and find offers — all in seconds.</p>
            </div>
            <Button size="lg" variant="secondary" className="text-foreground">
              Chat with AI Assistant
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
