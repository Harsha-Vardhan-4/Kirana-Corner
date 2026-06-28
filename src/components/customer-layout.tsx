import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Menu, LogIn, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/store";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function CustomerHeader() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const searchParams = useRouterState({
  select: (s) => s.location.search,
});

const currentQuery = (searchParams as any)?.q ?? "";

  useEffect(() => {
    setSearchValue(currentQuery);
  }, [currentQuery]);

  function handleSearchChange(value: string) {
    setSearchValue(value);
    navigate({ to: "/products", search: { q: value || undefined } });
  }

  useEffect(() => {
    async function loadUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const currentUser = session?.user ?? null;

  setUser(currentUser);

  if (currentUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    setIsAdmin(profile?.role === "admin");
  } else {
    setIsAdmin(false);
  }
}

  loadUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async(_event, session) => {
    const currentUser = session?.user ?? null;

setUser(currentUser);

if (currentUser) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  setIsAdmin(profile?.role === "admin");
} else {
  setIsAdmin(false);
}
  });

  return () => subscription.unsubscribe();
}, []);

const logout = async () => {
  await supabase.auth.signOut();
};
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground font-bold text-lg shadow-soft">
            SL
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-bold text-foreground">Kirana Corner</div>
          </div>
        </Link>

        <div className="relative hidden md:flex flex-1 max-w-xl mx-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for rice, atta, oil…"
            className="pl-9 bg-muted/50"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:inline-flex gap-1">
              Categories <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Shop by category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.slice(0, 10).map((c) => (
              <DropdownMenuItem key={c.id} asChild>
                <Link to="/products" search={{ category: c.id }}>
                  <span className="mr-2">{c.icon}</span>{c.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to="/cart" className="relative">
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
              {count}
            </span>
          )}
        </Link>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
  Hi, {user.email}
</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/profile">My Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/orders">My Orders</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAdmin && (
  <DropdownMenuItem asChild>
    <Link to="/admin/dashboard">Admin Panel</Link>
  </DropdownMenuItem>
)}
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" className="gap-1">
            <Link to="/login"><LogIn className="h-4 w-4" /> <span className="hidden sm:inline">Login</span></Link>
          </Button>
        )}
      </div>

      <div className="relative md:hidden px-4 pb-3">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products…"
          className="pl-9 bg-muted/50"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-3 grid grid-cols-3 gap-2">
            {categories.slice(0, 9).map((c) => (
              <Link
                key={c.id}
                to="/products"
                search={{ category: c.id }}
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-1 rounded-lg border p-3 text-xs hover:bg-muted"
              >
                <span className="text-2xl">{c.icon}</span>{c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function CustomerFooter() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/admin")) return null;
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground font-bold">SL</div>
            <div className="font-bold">Kirana Corner</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Your neighbourhood kirana & general store — now online.</p>
        </div>
        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/" className="hover:text-foreground">Careers</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Legal</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Terms & Conditions</Link></li>
            <li><Link to="/" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-foreground">Refund Policy</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Follow Us</div>
          <div className="flex gap-3 text-sm">
            <a className="hover:text-primary" href="#">Facebook</a>
            <a className="hover:text-primary" href="#">Instagram</a>
            <a className="hover:text-primary" href="#">WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 Kirana & General Store. All rights reserved.
      </div>
    </footer>
  );
}
