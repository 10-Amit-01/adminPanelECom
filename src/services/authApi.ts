import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string, user: { id: string, email: string } }, { username: string, password: string }>({
      query: (credentials) => ({
        url: 'login',
        method: "POST",
        body: credentials
      })
    })
  }),
  overrideExisting:false
});

export const {useLoginMutation} = authApi;