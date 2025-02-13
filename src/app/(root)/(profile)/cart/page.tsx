"use client";

import privateRequest from "@/healper/privateRequest";
import useCartStore from "@/store/useStore";
import CustomButton from "@/components/common/Button.component";
import CartList from "./Cart-list.component";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/common/PageLoader.component";

const CartPage = () => {
  const isLoading = useCartStore((state) => state.isLoading);
  const message = useCartStore((state) => state.message);
  const error = useCartStore((state) => state.error);
  const placeOrder = useCartStore((state) => state.placeOrder);

  const fetchCart = async () => {
    const response = await privateRequest.get("/carts");
    return response.data.data;
  };

  // Fetch data using react-query
  const {
    data: carts,
    isLoading: cartIsLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => fetchCart(),
  });

  if (cartIsLoading) {
    return <PageLoader isLoading={cartIsLoading} />;
  }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  let totalPrice = 0;

  for (const item of carts) {
    totalPrice += item.quantity * parseInt(item.product.price, 10);
  }

  const handleOrder = async () => {
    await placeOrder();
    refetch();
  };

  return (
    <div className="container grid grid-cols-3 gap-16">
      <CartList carts={carts} />

      <div className="space-y-12">
        <h4 className="text-xl">Order Summary</h4>
        <div className="grid grid-cols-2 space-y-2">
          <span>Sub-total</span> <span>{totalPrice}</span>
          <span>Shipping Charge</span> <span>0</span>
          <span>Discount</span> <span>0</span>
          <span className="font-semibold text-xl">Total</span>{" "}
          <span className="font-semibold text-xl">{totalPrice}</span>
        </div>

        <div className="space-x-4 pt-4">
          <CustomButton
            onClick={handleOrder}
            loading={isLoading}
            title="Checkout Now"
            className="w-44 py-2"
          />
        </div>
        <p className="text-green-500">{message}</p>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );
};

export default CartPage;
