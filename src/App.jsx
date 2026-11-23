import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useApp } from "./lib/store";
import Home from "./pages/Home"; import Shop from "./pages/Shop"; import Cars, { CarDetail } from "./pages/Cars";
const RealEstate = lazy(() => import("./pages/RealEstate"));
const PropertyDetail = lazy(() => import("./pages/RealEstate").then((m) => ({ default: m.PropertyDetail }))); import Services from "./pages/Services"; import AITraining from "./pages/AITraining";
import About from "./pages/About"; import Contact from "./pages/Contact"; import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist"; import Cart from "./pages/Cart"; import SignIn from "./pages/SignIn"; import Search from "./pages/Search";
function NotFound() { return <div className="wrap text-center"><h1 className="h1">Page not found</h1><a className="btn" href="/">Back to Home</a></div>; }
export default function App() {
  const { toast } = useApp(); const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (<div className="flex min-h-screen flex-col"><Navbar />
    <main className="flex-1"><Suspense fallback={<p className="wrap">Loading…</p>}><Routes>
      <Route path="/" element={<Home />} /><Route path="/shop" element={<Shop />} />
      <Route path="/cars" element={<Cars />} /><Route path="/cars/:id" element={<CarDetail />} />
      <Route path="/real-estate" element={<RealEstate />} /><Route path="/real-estate/:id" element={<PropertyDetail />} />
      <Route path="/services" element={<Services />} /><Route path="/ai-training" element={<AITraining />} />
      <Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<Dashboard />} /><Route path="/cart" element={<Cart />} /><Route path="/wishlist" element={<Wishlist />} />
      <Route path="/signin" element={<SignIn />} /><Route path="/search" element={<Search />} /><Route path="*" element={<NotFound />} />
    </Routes></Suspense></main><Footer />
    {toast && <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-navy px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}</div>);
}
