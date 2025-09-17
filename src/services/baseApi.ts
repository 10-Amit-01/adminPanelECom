import { logout, setCredentials } from "@/store/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth?: { accessToken?: string } }).auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include"
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extaOptions) => {
  let result = await baseQuery(args, api, extaOptions);

  if (result.error && result.error.status === 401) {

    const refreshRes = await baseQuery('/refresh', api, extaOptions);

    if (refreshRes.data) {
      const newToken = refreshRes.data as string;
      api.dispatch(setCredentials({ accessToken: newToken, user: null }));
      result = await baseQuery(args, api, extaOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
});
