import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string, user: { id: string, email: string } }, { username: string, password: string }>({
      query: (credentials) => ({
        url: 'login',
        method: "POST",
        body: credentials
      })
    }),
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: 'refresh',
        method: "POST",
        credentials: "include"
      })
    }),

    logout: builder.mutation<{message : string}, void>({
      query: () => ({
        url: 'logout',
        method: "POST",
        credentials: "include"
      })
    })
  }),
  overrideExisting: false
});

export const { useLoginMutation, useLogoutMutation } = authApi;