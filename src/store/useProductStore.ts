import { create } from "zustand";
import {
  deleteProduct,
  getProducts,
  createProduct,
  updateProduct,
} from "../services/ProductService";
import { DisplayToast } from "../components/Toast";

interface Product {
  id?: number;
  title: string;
  description: string;
  image?: string;
  price?: string;
}

interface ApiStore {
  items: Product[];
  getData: () => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  addData: (data: Product) => Promise<any>;
  editData: (id: number, data: Product) => Promise<any>;
}

export const useApiStore = create<ApiStore>((set, get) => ({
  items: [],

  getData: async () => {
    const res = await getProducts();
    set({ items: res.data });
  },

  handleDelete: async (id: number) => {
    try {
      const res = await deleteProduct(id);
      if (res.status === 200) {
        DisplayToast("Deleted Successfully", "warning");
        const currentItems = get().items;
        const updatedItems = currentItems.filter((curr) => {
          return curr.id !== id;
        });

        set({ items: updatedItems });
      }
    } catch (error) {
      console.error(error);
    }
  },
  addData: async (Data) => {
    try {
      const res = await createProduct(Data);
      if (res.status === 200) {
        const currentItems = get().items;
        const newItem = res.data;
        set({ items: [...currentItems, newItem] });
        DisplayToast("Added Succesfully", "success");
        console.log(res);
        return res;
      }
    } catch (error) {
      console.error(error);
    }
  },
  editData: async (id, data) => {
    try {
      const res = await updateProduct(id, data);
      if (res.status === 200) {
        const currentItems = get().items;
        DisplayToast("Edited Succesfully", "success");
        const updatedItems = currentItems.map((curr) => {
          return curr.id === id ? res.data : curr;
        });

        set({ items: updatedItems });
        return res;
      }
    } catch (error) {
      console.error(error);
    }
  },
}));
export function getLocalStorageParsed<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
