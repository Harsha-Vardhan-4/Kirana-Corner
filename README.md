🛒 Kirana Corner

A modern full-stack e-commerce web application for a local Kirana & General Store built using **React, TypeScript, Supabase, and Vite**. The application provides a seamless shopping experience for customers while offering a complete admin dashboard for managing products and orders.

🌐 Live Demo

https://kirana-corner-five.vercel.app/

📌 Features

Customer

* Secure authentication with Supabase
* Browse products by category
* Search products
* View featured and best-selling products
* Product details page
* Add products to cart
* Checkout with Cash on Delivery
* View order history
* Responsive UI for desktop and mobile

Admin

* Secure admin authentication
* Dashboard overview
* Add new products
* Edit product information
* Manage inventory
* View customer orders
* Update order status
* Customer information displayed with each order

🛠 Tech Stack

# Frontend

* React
* TypeScript
* Vite
* TanStack Router
* Tailwind CSS
* shadcn/ui
* Lucide React

# Backend

* Supabase

# Database

* PostgreSQL (Supabase)

# Authentication

* Supabase Auth

# Deployment

* Vercel

# 📂 Project Structure

src/
 ├── components/
 ├── routes/
 ├── lib/
 ├── types/
 ├── hooks/
 └── assets/

🗄 Database

The project uses Supabase with the following primary tables:

* profiles
* products
* categories
* orders
* order_items

# 🚀 Getting Started

# Clone the repository

git clone https://github.com/Harsha-Vardhan-4/Kirana-Corner.git


# Install dependencies

npm install

# Configure environment variables

Create a .env file in the project root.

env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


# Run locally

npm run dev

# 🔒 Security

* Row Level Security (RLS) enabled where appropriate
* Supabase Authentication
* Role-based Admin Access
* Protected Admin Routes

# Future Improvements

* Online Payment Integration (Razorpay/Stripe)
* Product Image Upload
* Wishlist
* Coupons & Discounts
* Customer Reviews
* Sales Analytics
* Inventory Notifications
* Email Notifications

# 👨‍💻 Author

Harsha Vardhan

GitHub: https://github.com/Harsha-Vardhan-4

If you found this project interesting, consider giving it a ⭐.
