import { baseApi } from "./baseApi";

export interface FlightSearchParams {
  departureAirportCode: string;
  arrivalAirportCode: string;
  departureDate: string;
}

export interface FlightSearchResponse {
  id: number;
  flightNumber: string;

  airlineId: number;
  airlineName: string;
  airlineCode: string;

  aircraftId: number;
  aircraftModel: string;
  registrationNumber: string;

  departureAirportId: number;
  departureAirportName: string;
  departureAirportCode: string;

  arrivalAirportId: number;
  arrivalAirportName: string;
  arrivalAirportCode: string;

  departureTime: string;
  arrivalTime: string;

  status: string;
  active: boolean;

  baseFare: number;

  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const flightSearchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchFlights: builder.query<
      ApiResponse<FlightSearchResponse[]>,
      FlightSearchParams
    >({
      query: ({
        departureAirportCode,
        arrivalAirportCode,
        departureDate,
      }) => ({
        url: "/flights/search",
        method: "GET",
        params: {
          departureAirportCode,
          arrivalAirportCode,
          departureDate,
        },
      }),
    }),
  }),
});

export const {
  useSearchFlightsQuery,
} = flightSearchApi;