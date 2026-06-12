import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/data";

export const Route = createFileRoute("/admin/ai-description")({
  head: () => ({ meta: [{ title: "AI Description Generator" }] }),
  component: AIGen,
});

function AIGen() {
  const [name, setName] = useState("");
  const [cat, setCat] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!name) return;
    setLoading(true);
    setTimeout(() => {
      setOut(`Discover ${name} — a premium-quality ${cat || "essential"} product carefully sourced for your daily needs. Made to highest standards, it offers great value with authentic taste and freshness. Perfect for everyday cooking and family meals. Buy now to enjoy hassle-free home delivery and the best prices in town.`);
      setLoading(false);
    }, 1100);
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-6 w-6 text-accent" />
        <h1 className="text-2xl font-bold">AI Product Description Generator</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Auto-generate compelling product descriptions in seconds</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card space-y-3">
          <div><Label>Product Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aashirvaad Atta 5kg" /></div>
          <div>
            <Label>Category</Label>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={!name || loading} className="w-full gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Description
          </Button>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <Label>Generated Description (Editable)</Label>
          <Textarea rows={10} value={out} onChange={(e) => setOut(e.target.value)} placeholder="Click Generate to create a description…" className="mt-2" />
          <Button variant="outline" className="mt-3" disabled={!out}>Save to Product</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
