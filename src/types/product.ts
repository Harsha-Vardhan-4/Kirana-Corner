export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  mrp: number | null;
  unit: string | null;
  image_url: string | null;
  stock_quantity: number;
  stock_status: string;
  category_id: string | null;
  featured: boolean;
  best_seller: boolean;
};