import axios from 'axios';
import { TicketType, ShowDate, BookingDetails, CreateBookingRequest } from './types';

const API_BASE_URL = '/api';

export const api = {
  async getTicketTypes(): Promise<TicketType[]> {
    const response = await axios.get(`${API_BASE_URL}/ticket-types`);
    return response.data;
  },

  async getShowDates(): Promise<ShowDate[]> {
    const response = await axios.get(`${API_BASE_URL}/show-dates`);
    return response.data;
  },

  async createBooking(booking: CreateBookingRequest): Promise<BookingDetails> {
    const response = await axios.post(`${API_BASE_URL}/bookings`, booking);
    return response.data;
  },

  async getBookingsByEmail(email: string): Promise<BookingDetails[]> {
    const response = await axios.get(`${API_BASE_URL}/bookings/email/${encodeURIComponent(email)}`);
    return response.data;
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`);
  }
};
