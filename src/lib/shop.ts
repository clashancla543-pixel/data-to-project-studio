export type Size = "5ml" | "10ml" | "30ml" | "100ml";
export const SIZES: Size[] = ["5ml", "10ml", "30ml", "100ml"];
export const SIZE_LABEL: Record<Size, string> = { "5ml": "5ml Decant", "10ml": "10ml Decant", "30ml": "30ml Travel", "100ml": "Full Bottle" };
export type Category = "decants" | "men" | "women" | "partials";
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;

export interface Product {
  id: string; name: string; brand: string; gender: "Men" | "Women" | "Unisex";
  tag?: "New" | "Bestseller"; image: "dark" | "amber"; notes: string;
  prices: Record<Size, number>; partial?: boolean;
}

export const PRODUCTS: Product[] = [
  { id: "nitro-red", name: "Nitro Red", brand: "Dumont", gender: "Men", tag: "Bestseller", image: "amber", notes: "Pineapple · Apple · Vanilla", prices: { "5ml": 249, "10ml": 449, "30ml": 1099, "100ml": 2999 } },
  { id: "hawas-ice", name: "Hawas Ice", brand: "Rasasi", gender: "Men", tag: "New", image: "dark", notes: "Mint · Apple · Ambergris", prices: { "5ml": 299, "10ml": 549, "30ml": 1299, "100ml": 3799 } },
  { id: "kaaf-noir", name: "Kaaf Noir", brand: "Ahmed Al Maghribi", gender: "Unisex", tag: "Bestseller", image: "dark", notes: "Oud · Leather · Saffron", prices: { "5ml": 349, "10ml": 649, "30ml": 1599, "100ml": 4499 } },
  { id: "arabians-tonka", name: "Arabians Tonka", brand: "Montale", gender: "Unisex", image: "amber", notes: "Tonka · Rose · Oud", prices: { "5ml": 449, "10ml": 849, "30ml": 2199, "100ml": 7999 }, partial: true },
  { id: "teriaq", name: "Teriaq", brand: "Lattafa", gender: "Women", tag: "New", image: "amber", notes: "Caramel · Honey · Leather", prices: { "5ml": 199, "10ml": 349, "30ml": 849, "100ml": 2299 } },
  { id: "la-di-da", name: "La Di Da", brand: "Emir", gender: "Women", image: "dark", notes: "Peach · Praline · Musk", prices: { "5ml": 179, "10ml": 319, "30ml": 749, "100ml": 1999 }, partial: true },
];

export function inCategory(p: Product, c: Category | "all"): boolean {
  if (c === "all" || c === "decants") return true;
  if (c === "partials") return !!p.partial;
  if (c === "men") return p.gender === "Men" || p.gender === "Unisex";
  return p.gender === "Women" || p.gender === "Unisex";
}

export interface CartItem { id: string; size: Size; qty: number }
export function lineKey(i: { id: string; size: Size }) { return `${i.id}-${i.size}`; }
export function priceOf(id: string, size: Size): number {
  return PRODUCTS.find((p) => p.id === id)?.prices[size] ?? 0;
}
export function subtotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + priceOf(i.id, i.size) * i.qty, 0);
}
export function shipping(sub: number): number {
  return sub === 0 || sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
