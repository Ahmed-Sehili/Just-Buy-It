"use client";

import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Use useEffect to update cart count only on client side
  useEffect(() => {
    setCartItemsCount(getTotalItems());
  }, [getTotalItems]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">
                Just Buy It
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/catalog"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                All Products
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 border border-gray-300">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none text-sm w-40 sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="ml-2 text-gray-500">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            <Link
              href="/cart"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Cart</span>
              {cartItemsCount > 0 && (
                <span className="bg-white text-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu - only shown below sm breakpoint */}
        <div className="sm:hidden py-2">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/catalog"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              All Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
