import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { offers } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function OffersCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % offers.length), 4500);
    return () => clearInterval(t);
  }, []);
  const prev = () => setI((p) => (p - 1 + offers.length) % offers.length);
  const next = () => setI((p) => (p + 1) % offers.length);
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-card">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {offers.map((o) => (
          <div
            key={o.id}
            className={`min-w-full bg-gradient-to-r ${o.bg} p-8 md:p-12 text-white`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="text-xs font-semibold uppercase tracking-widest opacity-90">Limited time</div>
                <h3 className="mt-2 text-2xl md:text-4xl font-extrabold leading-tight">{o.title}</h3>
                <p className="mt-2 text-sm md:text-base opacity-90">{o.description}</p>
                <Button variant="secondary" className="mt-4 text-foreground">{o.cta}</Button>
              </div>
              <div className="text-7xl md:text-9xl drop-shadow-lg">{o.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-foreground hover:bg-white transition-all">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-foreground hover:bg-white transition-all">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {offers.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Slide ${k + 1}`}
            className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
