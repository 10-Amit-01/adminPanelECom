import { baseApi } from "./baseApi";

interface Product {
  id: number;
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
    deleteProducts: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      })
    }),
    editProduct: builder.mutation<Product, { id: number, data : FormData }>({
      query: ({id,data}) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: data
      })
    })
  }),
});

export const { useGetProductsQuery, useAddProductMutation, useDeleteProductsMutation, useEditProductMutation } = productApi;
