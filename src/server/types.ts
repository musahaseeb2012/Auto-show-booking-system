export interface TicketType {
  id: number;
  name: string;
  description: string;
  price: number;
  available_quantity: number;
  created_at: string;
}

export interface ShowDate {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  created_at: string;
  booked_count?: number;
  available_capacity?: number;
}

export interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  ticket_type_id: number;
  show_date_id: number;
  quantity: number;
  total_price: number;
  booking_date: string;
  status: 'confirmed' | 'cancelled';
}

export interface CreateBookingRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  ticket_type_id: number;
  show_date_id: number;
  quantity: number;
}

export interface BookingDetails extends Booking {
  ticket_type_name: string;
  show_date: string;
  show_start_time: string;
  show_end_time: string;
}
