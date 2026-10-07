import { baseApi } from "./baseApi";

export interface FlightResponse {
  id: number;
  flightNumber: string;

  airlineId: number;
  airlineName: string;
  airlineCode: string;

  aircraftId: number;
  aircraftModel: string;
  aircraftRegistrationNumber: string;

  departureAirportId: number;
  departureAirportName: string;
  departureAirportCode: string;

  arrivalAirportId: number;
  arrivalAirportName: string;
  arrivalAirportCode: string;

  departureTime: string;
  arrivalTime: string;
  baseFare: number;

  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FlightRequest {
  flightNumber: string;
  airlineId: number;
  aircraftId: number;
  departureAirportId: number;
  arrivalAirportId: number;
  departureTime: string;
  arrivalTime: string;
  baseFare: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const flightApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFlights: builder.query<ApiResponse<FlightResponse[]>, void>({
      query: () => "/admin/flights",
      providesTags: ["Flights"],
    }),

    getFlightById: builder.query<
      ApiResponse<FlightResponse>,
      number
    >({
      query: (id) => `/admin/flights/${id}`,
      providesTags: ["Flights"],
    }),

    createFlight: builder.mutation<
      ApiResponse<FlightResponse>,
      FlightRequest
    >({
      query: (body) => ({
        url: "/admin/flights",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Flights"],
    }),

    updateFlight: builder.mutation<
      ApiResponse<FlightResponse>,
      { id: number; body: FlightRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/flights/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Flights"],
    }),

    activateFlight: builder.mutation<
      ApiResponse<FlightResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/flights/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Flights"],
    }),

    deactivateFlight: builder.mutation<
      ApiResponse<FlightResponse>,
      number
    >({
      query: (id) => ({
        url: `/admin/flights/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Flights"],
    }),
  }),
});

export const {
  useGetFlightsQuery,
  useGetFlightByIdQuery,
  useCreateFlightMutation,
  useUpdateFlightMutation,
  useActivateFlightMutation,
  useDeactivateFlightMutation,
} = flightApi;