"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();
  const router = useRouter();

  const isCartEmpty = cartItems.length === 0;

  const handleCheckout = () => {
    // Implement checkout logic here
    router.push("/checkout");
  };

  const continueShopping = () => {
    router.push("/catalog");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {isCartEmpty ? (
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button
            onClick={continueShopping}
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="py-6 flex"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link href={`/product/${item.product.id}`}>
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="ml-4">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 capitalize">
                        {item.product.category}
                      </p>
                      {item.selectedSize && (
                        <p className="mt-1 text-sm text-gray-500">
                          Size:{" "}
                          <span className="font-medium">
                            {item.selectedSize}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-1 items-end justify-between text-sm mt-2">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          type="button"
                          className="p-2 text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-2 text-gray-900 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-2 text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="font-medium text-red-600 hover:text-red-500 flex items-center"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={continueShopping}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">{formatPrice(getTotalPrice())}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">Free</p>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-medium">
                  <p>Total</p>
                  <p>{formatPrice(getTotalPrice())}</p>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-2 text-red-600 hover:bg-red-50"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
