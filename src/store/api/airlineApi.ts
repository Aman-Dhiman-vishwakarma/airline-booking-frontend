import { baseApi } from "./baseApi";

export interface AirlineRequest {
  name: string;
  code: string;
}

export interface AirlineResponse {
  id: number;
  name: string;
  code: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AirlineApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const airlineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAirlines: builder.query<
      AirlineApiResponse<AirlineResponse[]>,
      void
    >({
      query: () => ({
        url: "/admin/airlines",
        method: "GET",
      }),
      providesTags: ["Airlines"],
    }),

    getAirlineById: builder.query<
      AirlineApiResponse<AirlineResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/airlines/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Airlines", id },
      ],
    }),

    createAirline: builder.mutation<
      AirlineApiResponse<AirlineResponse>,
      AirlineRequest
    >({
      query: (body) => ({
        url: "/admin/airlines",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Airlines"],
    }),

    updateAirline: builder.mutation<
      AirlineApiResponse<AirlineResponse>,
      { id: number; body: AirlineRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/airlines/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Airlines",
        { type: "Airlines", id },
      ],
    }),

    activateAirline: builder.mutation<
      AirlineApiResponse<AirlineResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/airlines/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Airlines",
        { type: "Airlines", id },
      ],
    }),

    deactivateAirline: builder.mutation<
      AirlineApiResponse<AirlineResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/airlines/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Airlines",
        { type: "Airlines", id },
      ],
    }),
  }),
});

export const {
  useGetAirlinesQuery,
  useGetAirlineByIdQuery,
  useCreateAirlineMutation,
  useUpdateAirlineMutation,
  useActivateAirlineMutation,
  useDeactivateAirlineMutation,
} = airlineApi;