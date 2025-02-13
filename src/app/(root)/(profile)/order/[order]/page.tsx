"use client";


import privateRequest from "@/healper/privateRequest";
import { TOrder } from "@/models/order";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  params: {
    slug: string;
  };
};

const OrdersPage = ({}: Props) => {
  const params = useParams<{order: string }>();

  const [order, setOrder] = useState<TOrder>();

  const fetchOrders = async () => {
    const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${params?.order}`;
    try {
      const response = await privateRequest.get(endpoint);
      setOrder(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (params) {
      fetchOrders();
    }
  }, [params]);

  return (
<div className="container mx-auto px-4 py-8 max-w-3xl">
  <h4 className="font-semibold text-2xl mb-6 text-gray-800">Order Details</h4>
  <div className="bg-white shadow-md rounded-lg p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <p className="text-gray-600"><span className="font-medium">Order ID:</span> {order?.id}</p>
      <p className="text-gray-600"><span className="font-medium">Order Date:</span> {order?.createdAt}</p>
      <p className="text-gray-600"><span className="font-medium">Order Status:</span> 
        <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
          order?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          order?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          order?.status === 'CANCELLED' ? 'bg-red-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {order?.status}
        </span>
      </p>
    </div>
    <div>
      <p className="font-medium text-gray-800 mb-2">Order Items:</p>
      <ul className="bg-gray-50 rounded-md p-4">
        {order?.products?.map((product) => (
          <li key={product.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
            <span className="text-gray-800">{product.id}</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              Quantity: {product.quantity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
  );
};

export default OrdersPage;
