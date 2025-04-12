"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useToastContext } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const toastContext = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    wilaya: "",
    homeAddress: "",
  });

  // Form validation state
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    country: "",
    wilaya: "",
    homeAddress: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone =
        "Please enter a valid phone number (at least 10 digits)";
      valid = false;
    }

    // Validate country
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
      valid = false;
    } else if (formData.country.trim().length < 2) {
      newErrors.country = "Please enter a valid country name";
      valid = false;
    }

    // Validate wilaya/province
    if (!formData.wilaya.trim()) {
      newErrors.wilaya = "Wilaya/Province is required";
      valid = false;
    } else if (formData.wilaya.trim().length < 2) {
      newErrors.wilaya = "Please enter a valid province name";
      valid = false;
    }

    // Validate home address
    if (!formData.homeAddress.trim()) {
      newErrors.homeAddress = "Home address is required";
      valid = false;
    } else if (formData.homeAddress.trim().length < 5) {
      newErrors.homeAddress = "Please enter a more detailed address";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show toast notification for validation error
      if (toastContext) {
        toastContext.toast(
          "Please fill all required fields correctly",
          "error",
          3000
        );
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);

      // Generate a random order number
      const randomOrderNumber =
        "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(randomOrderNumber);

      if (toastContext) {
        toastContext.toast("Order placed successfully!", "success", 5000);
      }

      // Clear the cart after successful order
      clearCart();
    }, 1500);
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Add some items to your cart before checking out.
            </p>
            <Link
              href="/catalog"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase, {formData.name}.
            </p>
            <p className="text-gray-600 mb-2">
              Your order number is:{" "}
              <span className="font-bold">{orderNumber}</span>
            </p>
            <p className="text-gray-600 mb-8">
              We'll send a confirmation to your phone number at {formData.phone}
              .
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8 max-w-md mx-auto text-left">
              <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {formData.homeAddress}
                </p>
                <p>
                  <span className="font-medium">Wilaya/Province:</span>{" "}
                  {formData.wilaya}
                </p>
                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {formData.country}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
              >
                Return Home
              </Link>
              <Link
                href="/catalog"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-md transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Checkout Form - 3 columns */}
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your country"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="wilaya"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Wilaya/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="wilaya"
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.wilaya ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your wilaya/province"
                  />
                  {errors.wilaya && (
                    <p className="mt-1 text-sm text-red-500">{errors.wilaya}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="homeAddress"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Home Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="homeAddress"
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.homeAddress ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your home address"
                  />
                  {errors.homeAddress && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.homeAddress}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Place Order</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary - 2 columns */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="border-t border-gray-200 py-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-between py-2">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">{formatPrice(totalPrice)}</p>
                </div>
                <div className="flex justify-between py-2">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">Free</p>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <p>Total</p>
                  <p>{formatPrice(totalPrice)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
