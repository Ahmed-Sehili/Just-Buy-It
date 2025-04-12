"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/data/data";
import { fetchProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

type CategoryFilter =
  | "all"
  | "running"
  | "basketball"
  | "lifestyle"
  | "training";

export default function ProductCatalogue() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [priceRanges, setPriceRanges] = useState({
    under100: false,
    between100And200: false,
    over200: false,
  });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">(
    "newest"
  );
  const [isMobile, setIsMobile] = useState(false);
  const { addToCart, getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

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

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (categoryFilter === "all" || product.category === categoryFilter) &&
      (!priceRanges.under100 &&
      !priceRanges.between100And200 &&
      !priceRanges.over200
        ? true
        : (priceRanges.under100 && product.price < 100) ||
          (priceRanges.between100And200 &&
            product.price >= 100 &&
            product.price <= 200) ||
          (priceRanges.over200 && product.price > 200)) &&
      (selectedColors.length === 0 ||
        product.colors.some((color) => selectedColors.includes(color))) &&
      (selectedSizes.length === 0 ||
        product.sizes.some((size) => selectedSizes.includes(size)))
  );

  const handlePriceRangeChange = (range: keyof typeof priceRanges) => {
    setPriceRanges((prev) => ({
      ...prev,
      [range]: !prev[range],
    }));
  };

  const resetPriceFilter = () => {
    setPriceRanges({
      under100: false,
      between100And200: false,
      over200: false,
    });
  };

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Category</h3>
        <RadioGroup
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-categories" />
              <Label htmlFor="all-categories">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="running" id="running" />
              <Label htmlFor="running">Running</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basketball" id="basketball" />
              <Label htmlFor="basketball">Basketball</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lifestyle" id="lifestyle" />
              <Label htmlFor="lifestyle">Lifestyle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="training" id="training" />
              <Label htmlFor="training">Training</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Price</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPriceFilter}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="under-100"
              checked={priceRanges.under100}
              onCheckedChange={() => handlePriceRangeChange("under100")}
            />
            <Label htmlFor="under-100">Under $100</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="100-200"
              checked={priceRanges.between100And200}
              onCheckedChange={() => handlePriceRangeChange("between100And200")}
            />
            <Label htmlFor="100-200">$100 - $200</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="over-200"
              checked={priceRanges.over200}
              onCheckedChange={() => handlePriceRangeChange("over200")}
            />
            <Label htmlFor="over-200">Over $200</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const goToCheckout = () => {
    router.push("/cart");
  };

  return (
    <div className="flex h-full relative">
      {/* Mobile Filter Button - Fixed at top */}
      {isMobile && (
        <div className="absolute top-4 left-4 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Narrow down your product search
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop Sidebar - Fixed height with its own scroll */}
      {!isMobile && (
        <div className="hidden md:block w-56 shrink-0 pr-6 border-r h-full overflow-auto py-6">
          <div className="sticky top-0">
            <h2 className="font-semibold mb-4">Filters</h2>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Main Content - Scrollable */}
      <div className="flex-1 md:pl-6 py-6 overflow-auto h-full">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-background z-10 py-2">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-accent h-64 rounded-t-lg"></div>
                  <div className="bg-background p-4 rounded-b-lg">
                    <div className="h-4 bg-accent rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-accent rounded w-1/2"></div>
                    <div className="h-4 bg-accent rounded w-1/4 mt-2"></div>
                  </div>
                </div>
              ))}
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
                      <p className="font-semibold">
                        ${product.price.toFixed(2)}
                      </p>
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
      </div>

      {/* Floating Checkout Button - only visible when cart has items */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto">
            <Button
              onClick={goToCheckout}
              className="w-full py-6 bg-green-600 hover:bg-green-700 text-white text-lg font-medium flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-6 w-6 mr-2" />
              <span>Checkout Now ({cartItemsCount} items)</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
