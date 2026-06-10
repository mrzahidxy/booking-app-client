import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Interfaces
interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  message: string;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  placeOrder: () => Promise<void>;
}

// Helper function to auto-clear message after delay
const clearNotification = (set: any, delay = 3000) => {
  setTimeout(() => set({ message: "", error: null }), delay);
};

// Zustand store with persistence
const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        cartItems: [],
        message: "",
        isLoading: false,
        error: null,

        addToCart: async (productId, quantity) => {
          set({ isLoading: true, error: null });
          set((state) => ({
            cartItems: [
              ...state.cartItems,
              { id: Date.now(), productId, quantity },
            ],
            message: "Item added locally.",
            isLoading: false,
          }));
          clearNotification(set);
        },

        placeOrder: async () => {
          set({ isLoading: true, error: null });
          set({
            message: "Orders are created through booking checkout.",
            isLoading: false,
          });
          clearNotification(set);
        },
      }),
      { name: "cart-storage" }
    )
  )
);

export default useCartStore;
