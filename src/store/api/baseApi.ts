import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    credentials: "include",
  }),

  tagTypes: [
    "Auth",
    "Flights",
    "Bookings",
    "Airports",
    "Airlines",
    "Aircraft",
  ],

  endpoints: () => ({}),
});