import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import Features from "../components/Features";
import { getProducts } from "../services/woocommerce";

function Home() {
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch only 12 products total (6 for bestsellers, 6 for new arrivals)
        const allProducts = await getProducts({ per_page: 12 });

        // Transform WooCommerce products to match our component format
        const transformProduct = (product) => ({
          id: product.id,
          name: product.name,
          image:
            product.images[0]?.src ||
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop&q=80",
          salePrice:
            parseFloat(product.sale_price) || parseFloat(product.price),
          regularPrice: parseFloat(product.regular_price),
          badge: product.tags.length > 0 ? product.tags[0].name : null,
          options:
            product.attributes.find((attr) => attr.name === "Color")?.options ||
            [],
        });

        // Filter bestsellers (you can use tags or featured flag)
        const bestsellerProducts = allProducts
          .filter(
            (p) =>
              p.featured ||
              p.tags.some((tag) =>
                tag.name.toLowerCase().includes("bestseller")
              )
          )
          .slice(0, 6)
          .map(transformProduct);

        // Set bestsellers first
        setBestsellers(
          bestsellerProducts.length > 0
            ? bestsellerProducts
            : allProducts.slice(0, 6).map(transformProduct)
        );
        setLoadingBestsellers(false);

        // Filter new arrivals (you can use tags or date)
        const newArrivalProducts = allProducts
          .filter((p) =>
            p.tags.some((tag) => tag.name.toLowerCase().includes("new"))
          )
          .slice(0, 6)
          .map(transformProduct);

        // Set new arrivals after a slight delay to show progressive loading
        setTimeout(() => {
          setNewArrivals(
            newArrivalProducts.length > 0
              ? newArrivalProducts
              : allProducts.slice(6, 12).map(transformProduct)
          );
          setLoadingNewArrivals(false);
        }, 300);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoadingBestsellers(false);
        setLoadingNewArrivals(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Hero />
      <ProductGrid
        title="BESTSELLERS"
        products={bestsellers}
        loading={loadingBestsellers}
        skeletonCount={6}
      />
      <ProductGrid
        title="NEW ARRIVALS"
        products={newArrivals}
        viewAllLink="VIEW ALL NEW ARRIVALS"
        loading={loadingNewArrivals}
        skeletonCount={6}
      />
      <Features />
    </>
  );
}

export default Home;
