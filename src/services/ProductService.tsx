import axios from "axios";
export const Products_Url = import.meta.env.VITE_PRODUCTS_URL;



export const getProducts = () => {
  return axios.get(`${Products_Url}/products?limit=20`);
};

export const deleteProduct = (id:number) => {
  return axios.delete(`${Products_Url}/products/${id}`);
};

export const updateProduct = (id:number, post:object) => {
  return axios.put(`${Products_Url}/products/${id}`, post);
};

export const createProduct = (product:object) => {
  return axios.post(`${Products_Url}/products`, product);
};