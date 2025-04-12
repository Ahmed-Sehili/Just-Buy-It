"use client";

import Image from "next/image";
import { Product } from "@/data/data";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  product: Product;
  quantity: number;
}

export default function CartItem({ product, quantity }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-24 h-24 relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-gray-500">${product.price}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="px-2 py-1 border rounded"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="px-2 py-1 border rounded"
          >
            +
          </button>
        </div>
      </div>
      <div className="ml-4">
        <button
          onClick={() => removeFromCart(product.id)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
