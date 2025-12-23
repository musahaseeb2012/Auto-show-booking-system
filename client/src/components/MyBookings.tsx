import { useState } from 'react';
import { api } from '../api';
import { BookingDetails } from '../types';

function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSearched(true);

    try {
      const result = await api.getBookingsByEmail(email);
      setBookings(result);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.cancelBooking(bookingId);
      const result = await api.getBookingsByEmail(email);
      setBookings(result);
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
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

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#667eea' }}>My Bookings</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div className="form-group">
          <label>Enter your email address to view your bookings</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {searched && !loading && bookings.length === 0 && (
        <div className="empty-state">
          <h3>No bookings found</h3>
          <p>No bookings were found for this email address.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h3>{booking.ticket_type_name}</h3>
              <div style={{ margin: '15px 0' }}>
                <p><strong>Date:</strong> {formatDate(booking.show_date)}</p>
                <p><strong>Time:</strong> {formatTime(booking.show_start_time)} - {formatTime(booking.show_end_time)}</p>
                <p><strong>Quantity:</strong> {booking.quantity} ticket(s)</p>
                <p><strong>Total:</strong> ${booking.total_price.toFixed(2)}</p>
                <p><strong>Booking ID:</strong> {booking.id}</p>
              </div>
              <div style={{ marginTop: '15px' }}>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="btn btn-danger"
                  style={{ marginTop: '15px', width: '100%' }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
