import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { formatINR } from "@/lib/store";
import { requireAdmin } from "@/lib/adminGuard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/sales")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  head: () => ({ meta: [{ title: "Sales Dashboard" }] }),
  component: SalesDashboard,
});

function SalesDashboard() {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  const [salesData, setSalesData] = useState<any[]>([]);
  const [monthlySales, setMonthlySales] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSalesData() {
      setLoading(true);
      const { data: orders } = await supabase
        .from("orders")
        .select("*");

      const { data: orderItems } = await supabase
        .from("order_items")
        .select(`
          quantity,
          product_id,
          products (
            id,
            name,
            image_url,
            price
          )
        `);

      const orderList = orders || [];

      const today = new Date();

      let daily = 0;
      let weekly = 0;
      let monthly = 0;

      orderList.forEach((order) => {
        const orderDate = new Date(order.created_at);

        const amount = Number(order.total_amount || 0);

        const sameDay =
          orderDate.toDateString() === today.toDateString();

        const daysDiff =
          (today.getTime() - orderDate.getTime()) /
          (1000 * 60 * 60 * 24);

        const sameMonth =
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear();

        if (sameDay) daily += amount;

        if (daysDiff <= 7) weekly += amount;

        if (sameMonth) monthly += amount;
      });

      setDailyRevenue(daily);
      setWeeklyRevenue(weekly);
      setMonthlyRevenue(monthly);

      // Daily chart (last 7 days)

      const last7Days: any[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const label = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        const total = orderList
          .filter(
            (o) =>
              new Date(o.created_at).toDateString() ===
              date.toDateString()
          )
          .reduce(
            (sum, o) => sum + Number(o.total_amount || 0),
            0
          );

        last7Days.push({
          day: label,
          sales: total,
        });
      }

      setSalesData(last7Days);

      // Monthly chart

      const monthMap: Record<string, number> = {};

      orderList.forEach((order) => {
        const date = new Date(order.created_at);

        const month = date.toLocaleDateString("en-US", {
          month: "short",
        });

        monthMap[month] =
          (monthMap[month] || 0) +
          Number(order.total_amount || 0);
      });

      const monthData = Object.entries(monthMap).map(
        ([month, sales]) => ({
          month,
          sales,
        })
      );

      setMonthlySales(monthData);

      // Best sellers

      const productMap: Record<string, any> = {};

      (orderItems || []).forEach((item: any) => {
        const product = item.products;

        if (!product) return;

        if (!productMap[product.id]) {
          productMap[product.id] = {
            ...product,
            sold: 0,
          };
        }

        productMap[product.id].sold += item.quantity;
      });

      const sortedProducts = Object.values(productMap)
        .sort((a: any, b: any) => b.sold - a.sold)
        .slice(0, 8);

      setBestSellers(sortedProducts);
    }
    
    setLoading(false);
    loadSalesData();
  }, []);

  const cards = [
    {
      label: "Daily Revenue",
      value: formatINR(dailyRevenue),
    },
    {
      label: "Weekly Revenue",
      value: formatINR(weeklyRevenue),
    },
    {
      label: "Monthly Revenue",
      value: formatINR(monthlyRevenue),
    },
  ];

  if (loading) {
  return (
    <div className="p-6">
      <div className="h-96 rounded-xl bg-muted animate-pulse" />
    </div>
  );
}

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-1">
        Sales Dashboard
      </h1>

      <p className="text-sm text-muted-foreground mb-6">
        Revenue analytics & best sellers
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border bg-gradient-hero p-5 text-primary-foreground shadow-soft"
          >
            <div className="text-xs opacity-90">
              {c.label}
            </div>

            <div className="text-3xl font-bold mt-1">
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">
            Daily Sales Trend
          </h3>

          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient
                    id="g1"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="oklch(0.58 0.16 145)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.58 0.16 145)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.3}
                />

                <XAxis dataKey="day" fontSize={12} />

                <YAxis fontSize={12} />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="oklch(0.58 0.16 145)"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="font-semibold mb-4">
            Monthly Revenue
          </h3>

          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={monthlySales}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.3}
                />

                <XAxis dataKey="month" fontSize={12} />

                <YAxis fontSize={12} />

                <Tooltip />

                <Bar
                  dataKey="sales"
                  fill="oklch(0.72 0.18 55)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h3 className="font-semibold mb-4">
          Best Selling Products
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {bestSellers.map((p: any) => (
            <div
              key={p.id}
              className="flex gap-2 rounded-lg border p-3"
            >
              <img
                src={p.image_url}
                alt=""
                className="h-12 w-12 rounded object-cover"
              />

              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {p.name}
                </div>

                <div className="text-xs text-muted-foreground">
                  {formatINR(Number(p.price))} • {p.sold} sold
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}