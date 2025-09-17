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

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    console.log("Detected 403, calling refresh endpoint...");

    const refreshRes = await baseQuery({ url: 'refresh', method: 'POST', credentials: 'include' }, api, extraOptions);
    if (refreshRes.data) {
      const newToken = (refreshRes.data as { accessToken: string }).accessToken;

      api.dispatch(setCredentials({ accessToken: newToken, user: null }));
      result = await baseQuery(args, api, extraOptions);
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
