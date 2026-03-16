// UrbanX — Default seed data for admin panel

// ============================================
// WhatsApp number (with country code, no +)
// Change this to your actual number!
// ============================================
export const WHATSAPP_NUMBER = '918302909191'; // e.g. 919876543210 for +91-9876-543210
export const WHATSAPP_NAME = 'UrbanX';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive" | "Out of Stock";
  desc: string;
  image?: string;
}

export const DEFAULT_PRODUCTS: Product[] = [];

export const COLLECTIONS = [
  {
    name: "Street Wear",
    desc: "Bold and edgy styles for the urban warrior",
    price: "₹999",
    original: "₹1,999",
    image: "/collections/street.png",
    badge: "New",
    gradient: "from-purple-600 via-violet-600 to-indigo-800",
    btnGradient: "from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500",
  },
  {
    name: "Casual Chic",
    desc: "Effortless style for everyday comfort",
    price: "₹799",
    original: "₹1,499",
    image: "/collections/casual.png",
    badge: "Trending",
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    btnGradient: "from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500",
  },
  {
    name: "Premium Line",
    desc: "Luxury fashion for special occasions",
    price: "₹2,499",
    original: "₹4,999",
    image: "/collections/premium.png",
    badge: "Premium",
    gradient: "from-amber-500 via-yellow-500 to-orange-400",
    btnGradient: "from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500",
  },
  {
    name: "Active Wear",
    desc: "Performance meets style",
    price: "₹1,299",
    original: "₹2,499",
    image: "/collections/active.png",
    badge: "Active",
    gradient: "from-cyan-500 via-teal-500 to-green-500",
    btnGradient: "from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500",
  },
];

export const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    city: "Delhi",
    review: "Absolutely love the quality! The Street Wear collection is 🔥. Perfect fit and the fabric is top-notch.",
    avatar: "R",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Priya Mehta",
    city: "Mumbai",
    review: "UrbanX ne meri wardrobe change kar di! Fast delivery, amazing packaging, and the clothes are stunning.",
    avatar: "P",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Arjun Singh",
    city: "Bangalore",
    review: "Premium Line collection is worth every penny. Got so many compliments wearing it. 100% recommend!",
    avatar: "A",
    color: "from-amber-500 to-orange-600",
  },
];

export const DEFAULT_ADMIN_USER = "urbanx_admin";
export const DEFAULT_ADMIN_PASS = "UrbanX@secure24";

export const STORAGE_KEYS = {
  products: "urbanx_products",
  adminUser: "urbanx_admin_user",
  adminPass: "urbanx_admin_pass",
  dataVersion: "urbanx_data_version",
};

// Current data version — bump this to force-clear old dummy data on load
export const DATA_VERSION = "2.0";

// Call this once on mount in admin + website root
// Clears localStorage if data version is outdated (removes dummy seed data)
export function clearOldData() {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem(STORAGE_KEYS.dataVersion);
  if (saved !== DATA_VERSION) {
    // Wipe old products so dummy data doesn't persist
    localStorage.removeItem(STORAGE_KEYS.products);
    // Remove legacy keys from older versions
    localStorage.removeItem('urbanx_orders');
    localStorage.removeItem('urbanx_customers');
    // Set new version
    localStorage.setItem(STORAGE_KEYS.dataVersion, DATA_VERSION);
  }
}
