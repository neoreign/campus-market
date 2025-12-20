import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
  id: number
  name: string
  price: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // This key saves the data in the browser
    }
  )
)