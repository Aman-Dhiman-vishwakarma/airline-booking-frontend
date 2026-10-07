import { baseApi } from "./baseApi";

export interface PassengerRequest {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
}

export interface BookingRequest {
  flightId: number;
  passengers: PassengerRequest[];
  contactEmail: string;
  contactPhone: string;
}

export interface BookingSeatResponse {
  seatId: number;
  seatNumber: string;
  seatClass: string;
  seatType: string;
}

export interface PassengerResponse {
  id: number;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  seat: BookingSeatResponse;
}

export interface BookingResponse {
  id: number;
  bookingReference: string;
  flightId: number;
  flightNumber: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  passengers: PassengerResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<
      ApiResponse<BookingResponse>,
      BookingRequest
    >({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),

    getMyBookings: builder.query<
      ApiResponse<BookingResponse[]>,
      void
    >({
      query: () => "/bookings",
      providesTags: ["Bookings"],
    }),

    getBookingById: builder.query<
      ApiResponse<BookingResponse>,
      number
    >({
      query: (bookingId) => `/bookings/${bookingId}`,
      providesTags: ["Bookings"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
} = bookingApi;