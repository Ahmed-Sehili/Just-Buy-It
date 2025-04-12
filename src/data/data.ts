export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "running" | "basketball" | "lifestyle" | "training";
  image: string;
  releaseDate: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
}
