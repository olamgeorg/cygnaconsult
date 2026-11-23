import { useEffect, useState } from "react";
import { supabase, isConfigured } from "./supabase";
export const RATES = { NGN: 1, USD: 1 / 1550, GBP: 1 / 1950, EUR: 1 / 1680 };
export const SYMBOL = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" };
export const PRODUCTS = [
  { id: 1, title: "Wireless Noise-Cancelling Headphones", category: "Electronics", price_ngn: 89000, rating: 4.7, reviews: 1284, badge: "Best Seller", icon: "🎧" },
  { id: 2, title: "Mechanical Keyboard 75%", category: "Electronics", price_ngn: 65000, rating: 4.6, reviews: 642, badge: "Deal", icon: "⌨️" },
  { id: 3, title: "Ergonomic Office Chair", category: "Furniture", price_ngn: 185000, rating: 4.5, reviews: 411, badge: "New", icon: "🪑" },
  { id: 4, title: "Leather Laptop Backpack", category: "Fashion", price_ngn: 48500, rating: 4.4, reviews: 903, badge: "Best Seller", icon: "🎒" },
  { id: 5, title: "Smart Fitness Watch", category: "Electronics", price_ngn: 72000, rating: 4.3, reviews: 2210, badge: "Deal", icon: "⌚" },
  { id: 6, title: "Stainless Steel Cookware Set", category: "Home", price_ngn: 96000, rating: 4.8, reviews: 356, badge: "New", icon: "🍳" },
  { id: 7, title: "4K Action Camera", category: "Electronics", price_ngn: 138000, rating: 4.6, reviews: 774, badge: "Best Seller", icon: "📷" },
  { id: 8, title: "Cotton Bedsheet Set (Queen)", category: "Home", price_ngn: 42000, rating: 4.2, reviews: 520, badge: "Deal", icon: "🛏️" },
];
export const CARS = [
  { id: 1, title: "2019 Toyota Camry SE", make: "Toyota", model: "Camry", year: 2019, mileage: 48000, fuel: "Petrol", transmission: "Automatic", body_type: "Sedan", condition: "Foreign Used", price_ngn: 14500000, location: "Lekki, Lagos", icon: "🚗" },
  { id: 2, title: "2022 Lexus RX 350", make: "Lexus", model: "RX 350", year: 2022, mileage: 12000, fuel: "Petrol", transmission: "Automatic", body_type: "SUV", condition: "Foreign Used", price_ngn: 68000000, location: "Victoria Island, Lagos", icon: "🚙" },
  { id: 3, title: "2024 Honda CR-V", make: "Honda", model: "CR-V", year: 2024, mileage: 0, fuel: "Petrol", transmission: "Automatic", body_type: "SUV", condition: "New", price_ngn: 52000000, location: "Abuja", icon: "🚙" },
  { id: 4, title: "2014 Toyota Corolla", make: "Toyota", model: "Corolla", year: 2014, mileage: 126000, fuel: "Petrol", transmission: "Automatic", body_type: "Sedan", condition: "Nigerian Used", price_ngn: 5200000, location: "Ikeja, Lagos", icon: "🚗" },
  { id: 5, title: "2023 Tesla Model 3", make: "Tesla", model: "Model 3", year: 2023, mileage: 9000, fuel: "Electric", transmission: "Automatic", body_type: "Sedan", condition: "Foreign Used", price_ngn: 59000000, location: "Lekki, Lagos", icon: "⚡" },
  { id: 6, title: "2016 Toyota Hilux", make: "Toyota", model: "Hilux", year: 2016, mileage: 98000, fuel: "Diesel", transmission: "Manual", body_type: "Truck", condition: "Nigerian Used", price_ngn: 17800000, location: "Port Harcourt", icon: "🛻" },
];
export const PROPERTIES = [
  { id: 1, title: "4-Bedroom Detached Duplex", type: "House", listing: "For Sale", price_ngn: 185000000, beds: 4, baths: 5, sqm: 420, location: "Ikoyi, Lagos", lat: 6.4549, lng: 3.4246, icon: "🏡" },
  { id: 2, title: "3-Bedroom Serviced Apartment", type: "Apartment", listing: "For Rent", price_ngn: 8500000, beds: 3, baths: 3, sqm: 160, location: "Lekki Phase 1, Lagos", lat: 6.4474, lng: 3.4723, icon: "🏢" },
  { id: 3, title: "600sqm Residential Land", type: "Land", listing: "For Sale", price_ngn: 65000000, beds: 0, baths: 0, sqm: 600, location: "Ibeju-Lekki, Lagos", lat: 6.4698, lng: 3.779, icon: "🌿" },
  { id: 4, title: "Grade-A Office Floor", type: "Commercial", listing: "For Rent", price_ngn: 24000000, beds: 0, baths: 4, sqm: 350, location: "Victoria Island, Lagos", lat: 6.4281, lng: 3.4219, icon: "🏬" },
  { id: 5, title: "2-Bedroom Apartment", type: "Apartment", listing: "For Rent", price_ngn: 4200000, beds: 2, baths: 2, sqm: 110, location: "Wuse 2, Abuja", lat: 9.0765, lng: 7.4698, icon: "🏢" },
  { id: 6, title: "5-Bedroom Smart Home", type: "House", listing: "For Sale", price_ngn: 320000000, beds: 5, baths: 6, sqm: 600, location: "Maitama, Abuja", lat: 9.082, lng: 7.495, icon: "🏡" },
];
const pk = (b, s, p, f) => [["Basic", b, f[0]], ["Standard", s, f[1]], ["Premium", p, f[2]]];
export const SERVICES = [
  { id: 1, title: "Website Development", category: "Website Development", icon: "🌐", rating: 4.9, delivery: "7-21 days", basic_price: 350000, standard_price: 750000, premium_price: 1800000,
    pk: pk(350000, 750000, 1800000, [["5 pages", "Responsive", "7 days"], ["10 pages", "CMS + SEO", "14 days"], ["Custom web app", "Auth + payments", "21 days"]]) },
  { id: 2, title: "AI Solutions & AI Agents", category: "AI Solutions", icon: "🤖", rating: 4.8, delivery: "14-30 days", basic_price: 600000, standard_price: 1500000, premium_price: 4000000,
    pk: pk(600000, 1500000, 4000000, [["FAQ chatbot", "1 channel", "14 days"], ["Support agent", "CRM integration", "21 days"], ["Multi-agent workflow", "Custom tools + monitoring", "30 days"]]) },
  { id: 3, title: "Cloud Setup & DevOps", category: "Cloud & DevOps", icon: "☁️", rating: 4.8, delivery: "5-14 days", basic_price: 400000, standard_price: 950000, premium_price: 2500000,
    pk: pk(400000, 950000, 2500000, [["Single server setup", "SSL + backups", "5 days"], ["CI/CD pipeline", "Staging + prod", "9 days"], ["Kubernetes / IaC", "Monitoring + SLA", "14 days"]]) },
  { id: 4, title: "UI/UX Design", category: "UI/UX Design", icon: "🎨", rating: 4.9, delivery: "7-21 days", basic_price: 250000, standard_price: 600000, premium_price: 1500000,
    pk: pk(250000, 600000, 1500000, [["5 screens", "Wireframes", "7 days"], ["15 screens", "Prototype", "14 days"], ["Full design system", "User testing", "21 days"]]) },
  { id: 5, title: "E-commerce Store", category: "E-commerce", icon: "🛒", rating: 4.7, delivery: "14-30 days", basic_price: 500000, standard_price: 1200000, premium_price: 3000000,
    pk: pk(500000, 1200000, 3000000, [["50 products", "Paystack/Flutterwave", "14 days"], ["500 products", "Inventory + coupons", "21 days"], ["Multi-vendor marketplace", "Mobile app", "30 days"]]) },
];
export const EXPERTS = [
  { id: 1, name: "Adaeze Okonkwo", role: "Full-Stack Engineer", rating: 4.9, jobs: 112, work: "Fintech dashboard, retail storefront" },
  { id: 2, name: "Tunde Bakare", role: "Cloud & DevOps Lead", rating: 4.8, jobs: 86, work: "AWS migration for a logistics firm" },
  { id: 3, name: "Ngozi Eze", role: "Senior UI/UX Designer", rating: 5.0, jobs: 94, work: "Banking app redesign, design systems" },
  { id: 4, name: "Dr. Samuel Adeyemi", role: "ML Engineer", rating: 4.9, jobs: 58, work: "Credit scoring model, NLP classifiers" },
];
export function useRows(table, fallback) {
  const [rows, setRows] = useState(fallback);
  useEffect(() => { if (!isConfigured) return; supabase.from(table).select("*").then(({ data, error }) => { if (!error && data && data.length) setRows(data.map((r) => ({ icon: fallback[0]?.icon, ...fallback.find((f) => f.id === r.id), ...r }))); }).catch(() => {}); }, [table]);
  return rows;
}
