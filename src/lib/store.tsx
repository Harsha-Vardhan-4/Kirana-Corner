import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./data";

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const add: CartCtx["add"] = (p, qty = 1) =>
    setItems((prev) => {
      const e = prev.find((i) => i.product.id === p.id);
      if (e) return prev.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { product: p, qty }];
    });
  const remove: CartCtx["remove"] = (id) => setItems((p) => p.filter((i) => i.product.id !== id));
  const setQty: CartCtx["setQty"] = (id, qty) =>
    setItems((p) => qty <= 0 ? p.filter((i) => i.product.id !== id) : p.map((i) => i.product.id === id ? { ...i, qty } : i));
  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <CartContext.Provider value={{ items, add, remove, setQty, clear, total, count }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

type User = { name: string; email: string; phone: string } | null;
type AuthCtx = {
  user: User;
  login: (email: string) => void;
  signup: (name: string, email: string, phone: string) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);
  const persist = (u: User) => {
    setUser(u);
    try { u ? localStorage.setItem("user", JSON.stringify(u)) : localStorage.removeItem("user"); } catch {}
  };
  return (
    <AuthContext.Provider value={{
      user,
      login: (email) => persist({ name: email.split("@")[0] || "Customer", email, phone: "+91 98765 43210" }),
      signup: (name, email, phone) => persist({ name, email, phone }),
      logout: () => persist(null),
    }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
