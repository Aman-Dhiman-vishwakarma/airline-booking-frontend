import { baseApi } from "./baseApi";

export interface AircraftRequest {
  airlineId: number;
  registrationNumber: string;
  model: string;
  totalSeats: number;
}

export interface AircraftResponse {
  id: number;
  airlineId: number;
  airlineName: string;
  registrationNumber: string;
  model: string;
  totalSeats: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AircraftApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const aircraftApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAircraft: builder.query<
      AircraftApiResponse<AircraftResponse[]>,
      void
    >({
      query: () => ({
        url: "/admin/aircraft",
        method: "GET",
      }),
      providesTags: ["Aircraft"],
    }),

    getAircraftById: builder.query<
      AircraftApiResponse<AircraftResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/aircraft/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Aircraft", id },
      ],
    }),

    createAircraft: builder.mutation<
      AircraftApiResponse<AircraftResponse>,
      AircraftRequest
    >({
      query: (body) => ({
        url: "/admin/aircraft",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Aircraft"],
    }),

    updateAircraft: builder.mutation<
      AircraftApiResponse<AircraftResponse>,
      {
        id: number;
        body: AircraftRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `/admin/aircraft/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Aircraft",
        { type: "Aircraft", id },
      ],
    }),

    activateAircraft: builder.mutation<
      AircraftApiResponse<AircraftResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/aircraft/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Aircraft",
        { type: "Aircraft", id },
      ],
    }),

    deactivateAircraft: builder.mutation<
      AircraftApiResponse<AircraftResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/aircraft/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Aircraft",
        { type: "Aircraft", id },
      ],
    }),
  }),
});

export const {
  useGetAircraftQuery,
  useGetAircraftByIdQuery,
  useCreateAircraftMutation,
  useUpdateAircraftMutation,
  useActivateAircraftMutation,
  useDeactivateAircraftMutation,
} = aircraftApi;