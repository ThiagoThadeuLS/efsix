import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ShippingOption, Order } from '@/types';

interface CartState {
  items: CartItem[];
  shipping: ShippingOption | null;
  orders: Order[];
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (product: Product, size: string) => { success: boolean; message?: string };
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setShipping: (shipping: ShippingOption | null) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], nfeKey?: string) => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shipping: null,
      orders: [],
      isCartDrawerOpen: false,

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      addItem: (product, size) => {
        const stockAvailable = product.stock[size] ?? 0;
        
        // RN03: Produtos com saldo de estoque igual a zero não podem ser adicionados ao carrinho
        if (stockAvailable <= 0) {
          return {
            success: false,
            message: `O tamanho ${size} está esgotado no momento.`,
          };
        }

        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id && item.size === size
        );

        if (existingItem) {
          if (existingItem.quantity >= stockAvailable) {
            return {
              success: false,
              message: `Estoque máximo atingido (${stockAvailable} unidades).`,
            };
          }

          set({
            items: currentItems.map((item) =>
              item.product.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          return { success: true };
        }

        set({
          items: [...currentItems, { product, size, quantity: 1 }],
        });
        return { success: true };
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.size === size)
          ),
        }));
      },

      updateQuantity: (productId, size, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => !(item.product.id === productId && item.size === size)
              ),
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.product.id === productId && item.size === size) {
                const stock = item.product.stock[size] ?? 0;
                return { ...item, quantity: Math.min(quantity, stock) };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => set({ items: [], shipping: null }),

      setShipping: (shipping) => set({ shipping }),

      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `EF-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, status, nfeKey) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  ...(nfeKey ? { nfeKey, nfeIssued: true } : {}),
                }
              : o
          ),
        }));
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shippingCost = get().shipping?.price || 0;
        return subtotal + shippingCost;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'efsix-cart-store',
    }
  )
);
