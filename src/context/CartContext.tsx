"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Product } from "@/data/data";
import { useToastContext } from "@/components/ui/toast";

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize with empty array to avoid hydration mismatch
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart data from localStorage only on client-side
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Get toast context with fallback
  const { toast } = useToastContext();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, size?: string, quantity: number = 1) => {
    setCartItems((prevItems) => {
      // Check if item exists with the same product ID and size
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      // Create the updated cart items
      let updatedItems;

      // If item exists, update quantity
      if (existingItemIndex !== -1) {
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;

        // Show toast notification
        toast(`Updated quantity: ${product.name} (${size || "Default"})`, "info");

        return updatedItems;
      }

      // Otherwise add new item
      updatedItems = [
        ...prevItems,
        {
          product,
          quantity: quantity,
          selectedSize: size,
        },
      ];

      // Show toast notification
      toast(`Added to cart: ${product.name} (${size || "Default"})`, "success");

      return updatedItems;
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) => item.product.id === productId
      );
      const filteredItems = prevItems.filter(
        (item) => item.product.id !== productId
      );

      // Show toast notification
      if (itemToRemove) {
        toast(`Removed from cart: ${itemToRemove.product.name}`, "info");
      }

      return filteredItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);

    // Show toast notification
    toast("Cart has been cleared", "info");
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
