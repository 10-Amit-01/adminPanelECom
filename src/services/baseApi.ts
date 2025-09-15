import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type RootState } from '../store/store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
    credentials: "include"
  }),
  endpoints: () => ({})
});