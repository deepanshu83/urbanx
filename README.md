# 🔥 UrbanX — Premium Urban Fashion E-Commerce

<div align=\"center\">

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-FB923C?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

**Complete Urban Fashion Store — Admin + WhatsApp Orders + Supabase Backend**

</div>

---

## 🎯 **Kya Hai Ye Project?**

**UrbanX** ek **full-stack e-commerce website** hai premium urban fashion ke liye. 

**Customer Side** (`/`): Hero banner, Collections grid, About, Testimonials, Contact  
**Admin Side** (`/admin`): Products add/edit/delete, Image upload, Dashboard stats  
**Backend**: **Supabase** (Database + Storage) — real-time sync everywhere!

---

## 🛠️ **Tech Stack (Languages + Tools)**

| Tech | Purpose |
|------|---------|
| **TypeScript** | Full type safety |
| **Next.js 16** (App Router) | Frontend + API routes |
| **React 19** | Components |
| **Tailwind CSS 4** | Styling (dark theme, glassmorphism) |
| **Supabase** | Database (`products` table), Storage (`product-images` bucket) |
| **WhatsApp API** | Order inquiries (`wa.me` links) |

---

## 📜 **Development Journey (Scratch se End tak)**

### **Phase 1: Basic Website** (Static)
```
HTML/CSS/JS → Next.js + Tailwind → Dark theme + Glassmorphism
Components: Navbar, Hero, Collections, Features, About, Testimonials, Contact
```

### **Phase 2: Admin Panel** (localStorage)
```
Login system → Products CRUD → Orders → Settings
Data persistence: localStorage
WhatsApp integration: Pre-filled order messages
```

### **Phase 3: Supabase Backend** ⭐ (Current)
```
localStorage → Supabase Database
Static images → Supabase Storage upload
Real-time sync: Admin add → Website instantly shows
API route `/api/upload` → Image upload handler
```

---

## 🚀 **Live Setup (5 Minutes)**

```bash
cd urbanx
npm install
npm run dev
```

**Website**: http://localhost:3000  
**Admin**: http://localhost:3000/admin

### **Supabase Setup** (Must!)
1. [supabase.com](https://supabase.com) → New Project
2. `urbanx/.env.local` mein:
```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
3. **SQL Editor**:
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active',
  description TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```
4. **Storage** → New Bucket: `product-images` (Public)

---

## 🔐 **Admin Login**
```
Username: urbanx_admin
Password: UrbanX@secure24
```
**Change anytime** in Settings!

---

## 🎨 **Key Features**

| Feature | Status |
|---------|--------|
| **Responsive UI** | ✅ Mobile + Desktop |
| **Products CRUD** | ✅ Supabase real-time |
| **Image Upload** | ✅ Drag-drop to Storage |
| **WhatsApp Orders** | ✅ Pre-filled messages |
| **Dashboard Stats** | ✅ Live product count |
| **Search + Filter** | ✅ Admin panel |
| **Toast Notifications** | ✅ All actions |

---

## 📱 **WhatsApp Orders**
Customer clicks **Order on WhatsApp** → Opens chat with:
```
Hi UrbanX! 
Mujhe Urban Hoodie order karna hai.
Price: ₹999
Category: Streetwear
```

**Your number**: `src/lib/data.ts` → `WHATSAPP_NUMBER`

---

## 🚀 **Deploy Vercel (Free)**
```
vercel --prod
```
Supabase env vars add kar dena!

---

## 🗺️ **Roadmap**
- [ ] Cart + Checkout (Razorpay)
- [ ] User Login
- [ ] Order History
- [ ] Email Notifications

---

**Made with ❤️ for Indian Urban Fashion Brands** 🇮🇳

**From Scratch → Production Ready in 1 Week!** 🎉

#
