"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { fetchProductById } from "@/lib/api";
import { Product } from "@/data/data";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Minus,
  Plus,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Extended product interface with selected options
interface ProductWithOptions extends Product {
  selectedOptions?: {
    size: string;
    quantity: number;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  // Unwrap the params promise using React.use()
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const { addToCart, getTotalItems } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await fetchProductById(slug);
        if (productData) {
          setProduct(productData);
          // Set default selection
          if (productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    setError("");

    // Add product with size and quantity
    addToCart(product, selectedSize, quantity);

    // Show success feedback
    setAddedToCart(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const goBack = () => {
    router.back();
  };

  const goToCheckout = () => {
    router.push("/cart");
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-24 bg-gray-200 rounded mb-8"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product not found
        </h1>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/catalog"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center text-white hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back</span>
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="relative h-80 w-80 sm:h-96 sm:w-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 80vw, 40vw"
                quality={90}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {product.name}
              </h1>
              <p className="mt-1 text-lg text-gray-200 capitalize">
                {product.category}
              </p>
            </div>

            <p className="mt-3 text-3xl font-semibold text-white">
              {formatPrice(product.price)}
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-white">Highlights</h3>
              <div className="mt-4">
                <ul className="list-disc pl-5 space-y-2 text-lg text-gray-200">
                  <li>Premium materials for durability</li>
                  <li>Designed for optimal performance</li>
                  <li>
                    Released on{" "}
                    {new Date(product.releaseDate).toLocaleDateString()}
                  </li>
                  <li>{product.description}</li>
                </ul>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Size options */}
            {product.sizes.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Size</h2>
                  {error && (
                    <span className="text-lg text-red-500">{error}</span>
                  )}
                </div>

                <RadioGroup
                  className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-6"
                  value={selectedSize}
                  onValueChange={(value) => {
                    setSelectedSize(value);
                    setError("");
                  }}
                >
                  {product.sizes.map((size) => (
                    <div key={size} className="flex items-center">
                      <RadioGroupItem
                        value={size}
                        id={`size-${size}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className={`cursor-pointer py-2 flex items-center justify-center w-full text-lg font-medium uppercase ${
                          selectedSize === size
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        } rounded-md hover:bg-gray-50 ${
                          selectedSize === size ? "hover:bg-blue-700" : ""
                        }`}
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-white">Quantity</h2>
              <div className="flex items-center mt-2 border border-gray-200 rounded-md w-36">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex-1 text-center text-white font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8">
              {addedToCart ? (
                <div className="flex flex-col space-y-3">
                  <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span>Added to cart successfully!</span>
                  </div>
                  <Button
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white py-6 flex items-center justify-center space-x-2"
                    onClick={goToCheckout}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Go to Cart</span>
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 flex items-center justify-center space-x-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
