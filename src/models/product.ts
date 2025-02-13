export type TProduct = {
  id: number;
  name: string;
  description: string;
  price: string; 
  tags: string;
  image: string;
  createdAt: string;
  updateAt: string;
};

export type TProductAPIResponse =  {
  collection: TProduct[];
}

export type TCartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: TProduct;
};
