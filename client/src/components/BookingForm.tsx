import { useState, useEffect } from 'react';
import { api } from '../api';
import { TicketType, ShowDate, CreateBookingRequest } from '../types';

function BookingForm() {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [showDates, setShowDates] = useState<ShowDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateBookingRequest>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    ticket_type_id: 0,
    show_date_id: 0,
    quantity: 1,
  });

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [selectedDate, setSelectedDate] = useState<ShowDate | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tickets, dates] = await Promise.all([
        api.getTicketTypes(),
        api.getShowDates()
      ]);
      setTicketTypes(tickets);
      setShowDates(dates);
    } catch (err) {
      setError('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSelect = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setFormData({ ...formData, ticket_type_id: ticket.id });
  };

  const handleDateSelect = (date: ShowDate) => {
    setSelectedDate(date);
    setFormData({ ...formData, show_date_id: date.id });
  };

  const calculateTotal = () => {
    if (selectedTicket) {
      return (selectedTicket.price * formData.quantity).toFixed(2);
    }
    return '0.00';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.ticket_type_id || !formData.show_date_id) {
      setError('Please select both a ticket type and show date');
      return;
    }

    try {
      setSubmitting(true);
      const booking = await api.createBooking(formData);
      setSuccess(`Booking confirmed! Your booking ID is: ${booking.id}`);

      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        ticket_type_id: 0,
        show_date_id: 0,
        quantity: 1,
      });
      setSelectedTicket(null);
      setSelectedDate(null);

      // Reload dates to update availability
      const dates = await api.getShowDates();
      setShowDates(dates);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    // Safari-compatible date parsing: replace hyphen with slash or use ISO format
    const date = new Date(dateStr.replace(/-/g, '/'));
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <div className="loading">Loading booking information...</div>;
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Book Your Tickets</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Step 1: Select Ticket Type</label>
          <div className="grid">
            {ticketTypes.map((ticket) => (
              <div
                key={ticket.id}
                className={`ticket-card ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                onClick={() => handleTicketSelect(ticket)}
              >
                <h3>{ticket.name}</h3>
                <p>{ticket.description}</p>
                <div className="price">${ticket.price.toFixed(2)}</div>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  {ticket.available_quantity} tickets available
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Step 2: Select Show Date</label>
          <div className="grid">
            {showDates.map((date) => (
              <div
                key={date.id}
                className={`date-card ${selectedDate?.id === date.id ? 'selected' : ''}`}
                onClick={() => handleDateSelect(date)}
              >
                <h3>{formatDate(date.date)}</h3>
                <p>
                  {formatTime(date.start_time)} - {formatTime(date.end_time)}
                </p>
                <p style={{ marginTop: '10px', color: date.available_capacity && date.available_capacity > 100 ? '#28a745' : '#dc3545' }}>
                  {date.available_capacity} spots available
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Step 3: Your Information</label>
          <div style={{ display: 'grid', gap: '15px' }}>
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email Address *"
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
            />
            <div>
              <label>Number of Tickets</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>
        </div>

        {selectedTicket && (
          <div className="alert alert-info">
            <strong>Total: ${calculateTotal()}</strong>
            <div style={{ marginTop: '5px', fontSize: '0.9rem' }}>
              {formData.quantity} x {selectedTicket.name} @ ${selectedTicket.price.toFixed(2)}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Processing...' : 'Complete Booking'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
