import { Product } from "@/data/data";

const NIKE_API_BASE_URL = "https://api.nike.com";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${NIKE_API_BASE_URL}/product_feed/rollup_threads/v2?filter=marketplace(US)&filter=language(en)&filter=employeePrice(true)&filter=attributeIds(16633190-45e5-4830-a068-232ac7aea82c,0f64ecc7-d624-4e91-b171-b83a03dd8550)&anchor=0&consumerChannelId=d9a5bc42-4b9c-4976-858a-f159cf99c647&count=24`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    // More specific debug logging
    console.log("API Response Structure:", {
      hasObjects: !!data.objects,
      objectsLength: data?.objects?.length,
      firstObject: data?.objects?.[0]
        ? {
            id: data.objects[0].id,
            hasProductInfo: !!data.objects[0].productInfo,
            productInfoLength: data.objects[0].productInfo?.length,
            firstProductInfo: data.objects[0].productInfo?.[0]
              ? {
                  name: data.objects[0].productInfo[0].productName,
                  description:
                    data.objects[0].productInfo[0].productDescription,
                  price:
                    data.objects[0].productInfo[0].merchPrice?.currentPrice,
                  category: data.objects[0].productInfo[0].productCategory,
                  gender: data.objects[0].productInfo[0].gender,
                }
              : "No product info",
          }
        : "No first object",
    });

    // Log the raw data structure paths
    console.log(
      "Available paths in first object:",
      Object.keys(data?.objects?.[0] || {}).join(", ")
    );

    if (data?.objects?.[0]) {
      console.log(
        "First object raw data:",
        JSON.stringify(data.objects[0], null, 2)
      );
    }

    // Transform the API response to match our Product type
    const transformedProducts = data.objects.map((item: any) => {
      // Helper function to normalize category
      const normalizeCategory = (
        category: string | undefined
      ): "running" | "basketball" | "lifestyle" | "training" => {
        if (!category) return "lifestyle"; // default category if undefined
        const normalized = category.toLowerCase();
        if (normalized.includes("run")) return "running";
        if (normalized.includes("basket")) return "basketball";
        if (normalized.includes("train") || normalized.includes("gym"))
          return "training";
        return "lifestyle"; // default category
      };

      const productInfo = item.productInfo?.[0];
      const merchProduct = productInfo?.merchProduct;
      const productContent = productInfo?.productContent;
      const merchPrice = productInfo?.merchPrice;

      const product = {
        id: merchProduct?.id ?? "unknown",
        name: productContent?.title ?? "Unknown Product",
        description: productContent?.subtitle ?? "No description available",
        price: merchPrice?.currentPrice ?? 0,
        category: normalizeCategory(merchProduct?.sportTags?.[0]),
        image: productInfo?.imageUrls?.productImageUrl ?? "/placeholder.svg",
        releaseDate:
          merchProduct?.commerceStartDate ?? new Date().toISOString(),
        colors: productContent?.colors?.map(
          (color: any) => color?.name ?? "Unknown Color"
        ) ?? ["Unknown Color"],
        sizes: merchProduct?.availableSizes ?? [],
        featured: merchProduct?.isFeatured ?? false,
      };

      // Debug logging for transformed product
      console.log("Transformed product:", product);
      return product;
    });

    return transformedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    // First, fetch all products
    const products = await fetchProducts();

    // Find the product with the matching ID
    const product = products.find((product) => product.id === id);

    return product || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}
