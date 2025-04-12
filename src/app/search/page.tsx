"use client";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchLoading() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-8">Loading...</h1>
    </div>
  );
}


import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/data/data";
import { fetchProducts } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (query && products.length > 0) {
      const searchTerms = query.toLowerCase().split(" ");

      const results = products.filter((product) => {
        const name = product.name.toLowerCase();
        const description = product.description.toLowerCase();
        const category = product.category.toLowerCase();

        // Check if any search term matches in name, description, or category
        return searchTerms.some(
          (term) =>
            name.includes(term) ||
            description.includes(term) ||
            category.includes(term)
        );
      });

      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [query, products]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold mb-8">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-2">Search Results</h1>
      {query ? (
        <p className="text-gray-500 mb-8">
          Showing results for "{query}" ({filteredProducts.length} items)
        </p>
      ) : (
        <p className="text-gray-500 mb-8">Please enter a search term</p>
      )}

      {filteredProducts.length === 0 && query ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No results found</h2>
          <p className="text-gray-500">
            We couldn't find any products matching "{query}"
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-block text-blue-600 hover:underline"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <Card className="border-0 shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-accent">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </Link>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-medium text-base">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.category}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
