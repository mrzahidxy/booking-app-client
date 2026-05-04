import privateRequest from "@/shared/lib/api";
import { TCartOrder } from "@/entities/order";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

function CartList({carts}: {carts: TCartOrder[]}) {
    return (
        <div className="space-y-6 col-span-2">
            <h4 className="text-xl">Items</h4>
            <div className="space-y-4">
                {carts?.map((cart: TCartOrder, i: number) => (
                    <div
                        key={i}
                        className="grid grid-cols-3 dgroup justify-between gap-4 hover:shadow-sm hover:bg-gray-100 transition ease-in-out duration-100"
                    >
                        <div className="relative w-24 h-24">
                            {cart?.product?.image ? (
                                <Image
                                    src={cart.product.image}
                                    alt={cart.product.name ?? ""}
                                    fill
                                />
                            ) : (
                                <div className="h-full w-full rounded-md bg-muted" />
                            )}
                        </div>
                        <div className="col-span-2 space-y-1">
                            <span className="font-semibold text-xl">
                                {cart?.product?.name}
                            </span>
                            <div>
                                <span className="font-medium">Price</span>{" "}
                                <span>
                                    {cart.product
                                        ? cart.quantity * Number(cart.product.price)
                                        : "-"}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Quantity</span>{" "}
                                <span>{cart.quantity}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CartList;
