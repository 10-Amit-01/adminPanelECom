import { baseApi } from "./baseApi";

interface Product {
  _id?: string | number;
  title:string;
  description: string;
  price: string | number;
  images: string[];
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[],void>({
      query: () =>
        `products`
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
