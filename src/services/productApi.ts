import { baseApi } from "./baseApi";

interface Product {
  _id?: string | number;
  title: string;
  description: string;
  category: string;
  price: string | number;
  images: (string | File)[];
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<{ products: Product[], totalPages: number }, { page: number }>({
      query: ({ page = 1 }) =>
        `products?page=${page}`
    }),
    addProduct: builder.mutation<void, FormData>({
      query: (formdata) => ({
        url: 'products',
        method: 'POST',
        body: formdata
      }),
    }),
    deleteProducts: builder.mutation<void, { id: string | number }>({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'POST',
      })
    })
  }),
});

export const { useGetProductsQuery, useAddProductMutation, useDeleteProductsMutation } = productApi;
