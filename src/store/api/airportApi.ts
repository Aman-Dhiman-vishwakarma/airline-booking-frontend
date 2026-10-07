import { baseApi } from "./baseApi";

export interface AirportRequest {
  name: string;
  code: string;
  city: string;
  country: string;
}

export interface AirportResponse {
  id: number;
  name: string;
  code: string;
  city: string;
  country: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AirportApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const airportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAirports: builder.query<
      AirportApiResponse<AirportResponse[]>,
      void
    >({
      query: () => ({
        url: "/airports",
        method: "GET",
      }),
      providesTags: ["Airports"],
    }),

    getAirportById: builder.query<
      AirportApiResponse<AirportResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/airports/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Airports", id },
      ],
    }),

    createAirport: builder.mutation<
      AirportApiResponse<AirportResponse>,
      AirportRequest
    >({
      query: (body) => ({
        url: "/admin/airports",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Airports"],
    }),

    updateAirport: builder.mutation<
      AirportApiResponse<AirportResponse>,
      {
        id: number;
        body: AirportRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `/admin/airports/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Airports",
        { type: "Airports", id },
      ],
    }),

    activateAirport: builder.mutation<
      AirportApiResponse<AirportResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/airports/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Airports",
        { type: "Airports", id },
      ],
    }),

    deactivateAirport: builder.mutation<
      AirportApiResponse<AirportResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/airports/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Airports",
        { type: "Airports", id },
      ],
    }),
    
  }),
});

export const {
  useGetAirportsQuery,
  useGetAirportByIdQuery,
  useCreateAirportMutation,
  useUpdateAirportMutation,
  useActivateAirportMutation,
  useDeactivateAirportMutation,
} = airportApi;