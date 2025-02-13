import { publicRequest } from "@/healper/privateRequest";
import { ProductCard } from "./Product-Card.component";
import { TProduct } from "@/models";

// Async function to fetch product data
const fetchProduct = async (
  tags: string
): Promise<{ collection: TProduct[] } | null> => {
  try {
    const response = await publicRequest.get(`/products?tags=${tags}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return null;
  }
};

// Product Page Component
const Products = async ({ tags = "" }: { tags?: string }) => {
  const productData = await fetchProduct(tags);

  if (!productData || productData.collection.length === 0) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container space-y-16">
      <div className="w-full md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        {productData.collection.map((product: TProduct) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.description}
            image={product.image ?? ""}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
