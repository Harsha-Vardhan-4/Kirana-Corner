export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp?: number;
  unit: string;
  image: string;
  stock: number;
  description: string;
  featured?: boolean;
  bestSeller?: boolean;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export const categories: Category[] = [
  { id: "rice", name: "Rice", icon: "🍚", color: "bg-amber-100" },
  { id: "dals", name: "Dals", icon: "🫘", color: "bg-yellow-100" },
  { id: "sugar", name: "Sugar", icon: "🧂", color: "bg-slate-100" },
  { id: "flour", name: "Flour", icon: "🌾", color: "bg-orange-100" },
  { id: "oils", name: "Cooking Oils", icon: "🫒", color: "bg-lime-100" },
  { id: "biscuits", name: "Biscuits", icon: "🍪", color: "bg-amber-100" },
  { id: "snacks", name: "Chips & Snacks", icon: "🍿", color: "bg-red-100" },
  { id: "chocolates", name: "Chocolates", icon: "🍫", color: "bg-amber-200" },
  { id: "beverages", name: "Beverages", icon: "🥤", color: "bg-blue-100" },
  { id: "soaps", name: "Soaps", icon: "🧼", color: "bg-pink-100" },
  { id: "toothpaste", name: "Toothpaste", icon: "🪥", color: "bg-cyan-100" },
  { id: "toothbrushes", name: "Toothbrushes", icon: "🦷", color: "bg-teal-100" },
  { id: "detergents", name: "Detergents", icon: "🧺", color: "bg-indigo-100" },
  { id: "household", name: "Household Items", icon: "🏠", color: "bg-purple-100" },
  { id: "others", name: "Others", icon: "📦", color: "bg-gray-100" },
];

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=600&q=70`;

export const products: Product[] = [
  { id: "p1", name: "India Gate Basmati Rice 5kg", category: "rice", price: 549, mrp: 650, unit: "5 kg", image: img("photo-1586201375761-83865001e31c"), stock: 45, description: "Premium long-grain basmati rice, perfect for biryani and pulao.", featured: true, bestSeller: true },
  { id: "p2", name: "Sona Masoori Rice 10kg", category: "rice", price: 720, mrp: 800, unit: "10 kg", image: img("photo-1536304993881-ff6e9eefa2a6"), stock: 30, description: "Daily-use rice, soft and aromatic.", featured: true },
  { id: "p3", name: "Toor Dal 1kg", category: "dals", price: 145, mrp: 160, unit: "1 kg", image: img("photo-1599909533730-2e4b3d7d3f63"), stock: 80, description: "High-quality unpolished toor dal.", bestSeller: true },
  { id: "p4", name: "Moong Dal 1kg", category: "dals", price: 135, unit: "1 kg", image: img("photo-1612257999691-c81d6d76fcfd"), stock: 60, description: "Yellow split moong dal, easy to cook." },
  { id: "p5", name: "Aashirvaad Atta 5kg", category: "flour", price: 285, mrp: 320, unit: "5 kg", image: img("photo-1568051243851-f9b136146e97"), stock: 50, description: "100% whole wheat atta for soft rotis.", featured: true, bestSeller: true },
  { id: "p6", name: "Madhur Sugar 1kg", category: "sugar", price: 48, unit: "1 kg", image: img("photo-1610725664285-7c57e6eeac3f"), stock: 100, description: "Pure refined sugar." },
  { id: "p7", name: "Fortune Sunflower Oil 1L", category: "oils", price: 165, mrp: 180, unit: "1 L", image: img("photo-1604908554027-211b41dbf3e0"), stock: 70, description: "Light and healthy sunflower cooking oil.", featured: true },
  { id: "p8", name: "Saffola Gold Oil 1L", category: "oils", price: 195, unit: "1 L", image: img("photo-1620706857370-e1b9770e8bb1"), stock: 40, description: "Heart-healthy blended oil." },
  { id: "p9", name: "Parle-G Biscuits 800g", category: "biscuits", price: 80, unit: "800 g", image: img("photo-1558961363-fa8fdf82db35"), stock: 120, description: "India's favourite glucose biscuits.", bestSeller: true },
  { id: "p10", name: "Britannia Good Day 600g", category: "biscuits", price: 95, unit: "600 g", image: img("photo-1606312619070-d48b4c652a52"), stock: 90, description: "Cashew-loaded cookies." },
  { id: "p11", name: "Lays Classic 90g", category: "snacks", price: 30, unit: "90 g", image: img("photo-1566478989037-eec170784d0b"), stock: 200, description: "Crispy potato chips.", featured: true },
  { id: "p12", name: "Kurkure Masala Munch 90g", category: "snacks", price: 30, unit: "90 g", image: img("photo-1599490659213-e2b9527bd087"), stock: 150, description: "Spicy crunchy snack." },
  { id: "p13", name: "Dairy Milk Silk 150g", category: "chocolates", price: 220, unit: "150 g", image: img("photo-1623600121029-3fce2c764f15"), stock: 60, description: "Smooth and silky milk chocolate.", bestSeller: true },
  { id: "p14", name: "KitKat 4 Finger Pack", category: "chocolates", price: 50, unit: "37.3 g", image: img("photo-1582058091505-f87a2e55a40f"), stock: 80, description: "Have a break, have a KitKat." },
  { id: "p15", name: "Coca-Cola 1.25L", category: "beverages", price: 70, unit: "1.25 L", image: img("photo-1554866585-cd94860890b7"), stock: 100, description: "Refreshing classic cola." },
  { id: "p16", name: "Tropicana Orange Juice 1L", category: "beverages", price: 130, unit: "1 L", image: img("photo-1600271886742-f049cd451bba"), stock: 35, description: "100% pure orange juice." },
  { id: "p17", name: "Lifebuoy Soap 4x125g", category: "soaps", price: 160, mrp: 200, unit: "4 pack", image: img("photo-1600857544200-b2f666a9a2ec"), stock: 75, description: "Total germ protection." },
  { id: "p18", name: "Colgate MaxFresh 150g", category: "toothpaste", price: 105, unit: "150 g", image: img("photo-1609840114035-3c981b782dfe"), stock: 90, description: "Cool mint freshness." },
  { id: "p19", name: "Oral-B Toothbrush 3pk", category: "toothbrushes", price: 99, unit: "3 pack", image: img("photo-1559591937-abc3a5cd9bf7"), stock: 110, description: "Soft bristle daily-use toothbrush." },
  { id: "p20", name: "Surf Excel Matic 2kg", category: "detergents", price: 470, mrp: 520, unit: "2 kg", image: img("photo-1626806787461-102c1bfaaea1"), stock: 40, description: "Powerful stain removal for machines.", featured: true },
  { id: "p21", name: "Vim Dishwash Bar 4pk", category: "household", price: 60, unit: "4 pack", image: img("photo-1585421514738-01798e348b17"), stock: 130, description: "Tough on grease, gentle on hands." },
  { id: "p22", name: "Harpic Toilet Cleaner 1L", category: "household", price: 175, unit: "1 L", image: img("photo-1583947215259-38e31be8751f"), stock: 0, description: "10x stronger cleaning power." },
  { id: "p23", name: "Tata Salt 1kg", category: "others", price: 28, unit: "1 kg", image: img("photo-1518110925495-b37653d33d35"), stock: 200, description: "Iodised salt for daily use.", bestSeller: true },
  { id: "p24", name: "Maggi 2-Min Noodles 12pk", category: "others", price: 168, unit: "12 pack", image: img("photo-1612929633738-8fe44f7ec841"), stock: 8, description: "Family favourite instant noodles." },
];

export const offers = [
  { id: "o1", title: "Summer Grocery Sale", description: "Up to 40% off on staples & essentials", cta: "Shop Now", bg: "from-emerald-500 to-green-600", emoji: "🛒" },
  { id: "o2", title: "Buy 1 Get 1 Free", description: "On selected biscuits & snacks this week", cta: "Grab Deals", bg: "from-orange-500 to-amber-500", emoji: "🍪" },
  { id: "o3", title: "Weekend Discounts", description: "Flat ₹100 off on orders above ₹999", cta: "Order Now", bg: "from-green-600 to-teal-600", emoji: "💸" },
  { id: "o4", title: "Fresh Arrivals", description: "Brand new stock just in — explore today", cta: "Explore", bg: "from-lime-500 to-emerald-500", emoji: "✨" },
  { id: "o5", title: "Festival Special", description: "Pooja & festival essentials at best prices", cta: "Shop Festival", bg: "from-amber-500 to-orange-600", emoji: "🪔" },
];

export const placeholderOrders = [
  { id: "ORD1024", date: "2026-06-08", status: "Delivered", total: 1245, items: 6, customer: "Ramesh Kumar" },
  { id: "ORD1025", date: "2026-06-09", status: "Out for Delivery", total: 549, items: 2, customer: "Priya Sharma" },
  { id: "ORD1026", date: "2026-06-10", status: "Packed", total: 2310, items: 9, customer: "Anil Reddy" },
  { id: "ORD1027", date: "2026-06-11", status: "Confirmed", total: 870, items: 4, customer: "Sneha Iyer" },
  { id: "ORD1028", date: "2026-06-12", status: "Pending", total: 460, items: 3, customer: "Vijay Singh" },
];

export const salesData = [
  { day: "Mon", sales: 12400 },
  { day: "Tue", sales: 15800 },
  { day: "Wed", sales: 11200 },
  { day: "Thu", sales: 18400 },
  { day: "Fri", sales: 22100 },
  { day: "Sat", sales: 28900 },
  { day: "Sun", sales: 25400 },
];

export const monthlySales = [
  { month: "Jan", sales: 320000 },
  { month: "Feb", sales: 295000 },
  { month: "Mar", sales: 380000 },
  { month: "Apr", sales: 410000 },
  { month: "May", sales: 445000 },
  { month: "Jun", sales: 478000 },
];
