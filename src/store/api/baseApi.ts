import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://airline-booking-backend-bdzq.onrender.com/api",
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