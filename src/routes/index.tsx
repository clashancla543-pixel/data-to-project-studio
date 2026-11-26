import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Search, ShoppingBag, User, Truck, Minus, Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import hero from "@/assets/hero-perfume.jpg";
import bottleDark from "@/assets/bottle-dark.jpg";
import bottleAmber from "@/assets/bottle-amber.jpg";
import decants from "@/assets/decants.jpg";
import {
  PRODUCTS, SIZES, SIZE_LABEL, FREE_SHIPPING_THRESHOLD, inCategory, inr, lineKey, priceOf, shipping, subtotal,
  type CartItem, type Category, type Product, type Size,
} from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perfume Gyaan — Decants & Luxury Fragrances in India" },
      { name: "description", content: "Shop verified niche and Middle Eastern fragrances in 5ml, 10ml, 30ml decants and full bottles. Free shipping above ₹999." },
      { property: "og:title", content: "Perfume Gyaan — Decants & Luxury Fragrances" },
      { property: "og:description", content: "Verified niche fragrances in decants and full bottles, shipped across India." },
    ],
  }),
  component: Index,
});

const IMG = { dark: bottleDark, amber: bottleAmber };
const CATS: { id: Category; label: string; sub: string; img: string }[] = [
  { id: "decants", label: "Decants", sub: "5ml · 10ml · 30ml", img: decants },
  { id: "men", label: "Men's", sub: "Bold & woody", img: bottleDark },
  { id: "women", label: "Women's", sub: "Sweet & floral", img: bottleAmber },
  { id: "partials", label: "Partials", sub: "Discounted bottles", img: bottleDark },
];

function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wish, setWish] = useState<string[]>([]);
  const [cat, setCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [placed, setPlaced] = useState(false);

  const list = useMemo(() => PRODUCTS.filter((p) => inCategory(p, cat) &&
    (p.name + p.brand + p.notes).toLowerCase().includes(q.toLowerCase())), [cat, q]);
  const sub = subtotal(cart);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const add = (p: Product, size: Size) => {
    setCart((c) => {
      const k = lineKey({ id: p.id, size });
      const ex = c.find((i) => lineKey(i) === k);
      return ex ? c.map((i) => (lineKey(i) === k ? { ...i, qty: i.qty + 1 } : i)) : [...c, { id: p.id, size, qty: 1 }];
    });
    toast.success(`${p.name} (${SIZE_LABEL[size]}) added to bag`);
  };
  const setQty = (k: string, d: number) =>
    setCart((c) => c.map((i) => (lineKey(i) === k ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0));

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gold py-2 text-center text-xs font-medium tracking-wide text-primary-foreground">
        Free Shipping Across India on Orders Above ₹999 · Orders dispatched within 24 hours
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <a href="/" className="font-display text-2xl font-bold tracking-wide"><span className="text-gold">Perfume</span> Gyaan</a>
          <div className="relative ml-auto hidden flex-1 max-w-md md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search fragrances, brands, notes…"
              className="w-full rounded-full border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary" />
          </div>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button aria-label="Account" onClick={() => toast("Account & order tracking coming soon")} className="rounded-full p-2 hover:bg-accent"><User className="h-5 w-5" /></button>
            <button aria-label="Wishlist" className="relative rounded-full p-2 hover:bg-accent" onClick={() => toast(`${wish.length} item(s) in wishlist`)}>
              <Heart className="h-5 w-5" />{wish.length > 0 && <Badge n={wish.length} />}
            </button>
            <button aria-label="Open bag" className="relative rounded-full p-2 hover:bg-accent" onClick={() => setOpen(true)}>
              <ShoppingBag className="h-5 w-5" />{count > 0 && <Badge n={count} />}
            </button>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full rounded-full border border-input bg-card px-4 py-2 text-sm outline-none" />
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img src={hero} alt="Middle Eastern perfume bottles with oud and smoke" width={1600} height={912} className="h-[70vh] min-h-[460px] w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-6">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Verified · Authentic · Decanted fresh</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight md:text-7xl">Middle Eastern & designer <span className="text-gold">extraits</span></h1>
          <p className="mt-4 max-w-md text-muted-foreground">Try before you commit — sample the world's most hyped fragrances from just ₹179.</p>
          <a href="#shop" className="mt-8 w-fit rounded-sm bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-gold transition hover:opacity-90">Shop the collection</a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-center text-4xl">Curated Collections</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATS.map((c) => (
            <button key={c.id} onClick={() => { setCat(c.id); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-border text-left">
              <img src={c.img} alt={c.label} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl">{c.label}</h3>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl">The Fragrance Library</h2>
          <div className="flex flex-wrap gap-2">
            {(["all", "decants", "men", "women", "partials"] as const).map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}>{c}</button>
            ))}
          </div>
        </div>
        {list.length === 0 ? <p className="py-16 text-center text-muted-foreground">No fragrances match your search.</p> : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <ProductCard key={p.id} p={p} onAdd={add} wished={wish.includes(p.id)}
              onWish={() => setWish((w) => (w.includes(p.id) ? w.filter((x) => x !== p.id) : [...w, p.id]))} />)}
          </div>
        )}
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        <p className="font-display text-xl text-foreground">Perfume Gyaan</p>
        <p className="mt-2">100% authentic fragrances · Shipped across India</p>
      </footer>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader><SheetTitle className="font-display text-2xl">Your Bag ({count})</SheetTitle></SheetHeader>
          <ShippingMeter sub={sub} />
          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            {cart.length === 0 && <p className="py-12 text-center text-muted-foreground">Your bag is empty.</p>}
            {cart.map((i) => {
              const p = PRODUCTS.find((x) => x.id === i.id)!; const k = lineKey(i);
              return (
                <div key={k} className="flex gap-3 border-b border-border pb-4">
                  <img src={IMG[p.image]} alt={p.name} className="h-20 w-20 rounded-sm object-cover" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-primary">{SIZE_LABEL[i.size]}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button aria-label="Decrease" onClick={() => setQty(k, -1)} className="rounded border border-border p-1"><Minus className="h-3 w-3" /></button>
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button aria-label="Increase" onClick={() => setQty(k, 1)} className="rounded border border-border p-1"><Plus className="h-3 w-3" /></button>
                      <button aria-label="Remove" onClick={() => setQty(k, -i.qty)} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{inr(priceOf(i.id, i.size) * i.qty)}</p>
                </div>
              );
            })}
          </div>
          {cart.length > 0 && (
            <div className="space-y-3 border-t border-border p-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{inr(sub)}</span></div>
              <button onClick={() => { setOpen(false); setPlaced(false); setCheckout(true); }}
                className="w-full rounded-sm bg-gold py-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground">Checkout</button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={checkout} onOpenChange={setCheckout}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-2xl">{placed ? "Order placed" : "Checkout"}</DialogTitle></DialogHeader>
          {placed ? (
            <div className="py-6 text-center">
              <Check className="mx-auto h-12 w-12 text-primary" />
              <p className="mt-4">Thank you! This is a preview — no payment was taken.</p>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setPlaced(true); setCart([]); }}>
              {["Full name", "Phone", "Address", "City", "PIN code"].map((f) => (
                <input key={f} required placeholder={f} className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary" />
              ))}
              <div className="space-y-1 rounded-sm bg-muted p-3 text-sm">
                <Row l="Subtotal" v={inr(sub)} />
                <Row l="Shipping" v={shipping(sub) === 0 ? "Free" : inr(shipping(sub))} />
                <Row l="Total" v={inr(sub + shipping(sub))} bold />
              </div>
              <button className="w-full rounded-sm bg-gold py-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground">Place order</button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ l, v, bold }: { l: string; v: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "border-t border-border pt-1 font-semibold" : ""}`}><span>{l}</span><span>{v}</span></div>;
}

function Badge({ n }: { n: number }) {
  return <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{n}</span>;
}

function ShippingMeter({ sub }: { sub: number }) {
  const pct = Math.min(100, (sub / FREE_SHIPPING_THRESHOLD) * 100);
  const left = FREE_SHIPPING_THRESHOLD - sub;
  return (
    <div className="mx-4 rounded-sm border border-border p-3">
      <p className="flex items-center gap-2 text-xs"><Truck className="h-4 w-4 text-primary" />
        {left > 0 ? <>Add <b className="text-primary">{inr(left)}</b> more for free shipping</> : "You've unlocked free shipping!"}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function ProductCard({ p, onAdd, wished, onWish }: { p: Product; onAdd: (p: Product, s: Size) => void; wished: boolean; onWish: () => void }) {
  const [size, setSize] = useState<Size>("10ml");
  return (
    <div className="group overflow-hidden rounded-sm border border-border bg-card transition hover:shadow-gold">
      <div className="relative aspect-square overflow-hidden">
        <img src={IMG[p.image]} alt={`${p.brand} ${p.name}`} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          {p.tag && <span className="rounded-sm bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{p.tag}</span>}
          <span className="rounded-sm border border-border bg-background/80 px-2 py-0.5 text-[10px] uppercase tracking-wider">{p.gender}</span>
        </div>
        <button aria-label="Toggle wishlist" onClick={onWish} className="absolute right-3 top-3 rounded-full bg-background/80 p-2">
          <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.brand}</p>
        <h3 className="text-2xl">{p.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{p.notes}</p>
        <div className="mt-4 grid grid-cols-4 gap-1">
          {SIZES.map((s) => (
            <button key={s} onClick={() => setSize(s)}
              className={`rounded-sm border py-1.5 text-[11px] transition ${size === s ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:border-primary"}`}>
              {s === "100ml" ? "Full" : s}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div><p className="text-xl font-semibold text-primary">{inr(p.prices[size])}</p><p className="text-[10px] text-muted-foreground">{SIZE_LABEL[size]}</p></div>
          <button onClick={() => onAdd(p, size)} className="rounded-sm bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground">Add to bag</button>
        </div>
      </div>
    </div>
  );
}
