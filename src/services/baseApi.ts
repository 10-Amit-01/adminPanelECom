import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { type RootState } from '../store/store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth?: { accessToken?: string } }).auth?.accessToken;
      if(token){
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include"
  }),
  endpoints: () => ({})
});