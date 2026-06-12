import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, Boxes, Tags, ClipboardList, BarChart3, Sparkles, Brain, LogOut } from "lucide-react";
import type { ReactNode } from "react";

const links = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/inventory", icon: Boxes, label: "Inventory" },
  { to: "/admin/categories", icon: Tags, label: "Categories" },
  { to: "/admin/orders", icon: ClipboardList, label: "Orders" },
  { to: "/admin/sales", icon: BarChart3, label: "Sales" },
  { to: "/admin/ai-description", icon: Sparkles, label: "AI Descriptions" },
  { to: "/admin/ai-insights", icon: Brain, label: "AI Insights" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      <aside className="hidden md:flex w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2 border-b p-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-hero text-primary-foreground font-bold">SL</div>
          <div className="leading-tight">
            <div className="text-sm font-bold">Admin Panel</div>
            <div className="text-[10px] text-muted-foreground">Sri Lakshmi Store</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"}`}
              >
                <l.icon className="h-4 w-4" />{l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-2">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" /> Exit Admin
          </Link>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
          <div className="font-semibold text-foreground">Admin</div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">View Store →</Link>
        </header>
        <nav className="flex md:hidden gap-1 overflow-x-auto border-b bg-background px-2 py-2 scrollbar-hide">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <l.icon className="h-3.5 w-3.5" />{l.label}
              </Link>
            );
          })}
        </nav>
        <main className="p-4 md:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
