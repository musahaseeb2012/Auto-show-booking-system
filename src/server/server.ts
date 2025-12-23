import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db, { initializeDatabase } from './database';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookingRequest, BookingDetails } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Routes

// GET /api/ticket-types - Get all ticket types
app.get('/api/ticket-types', (req, res) => {
  try {
    const ticketTypes = db.prepare('SELECT * FROM ticket_types').all();
    res.json(ticketTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket types' });
  }
});

// GET /api/show-dates - Get all show dates with availability
app.get('/api/show-dates', (req, res) => {
  try {
    const showDates = db.prepare(`
      SELECT
        sd.*,
        COALESCE(SUM(b.quantity), 0) as booked_count,
        sd.max_capacity - COALESCE(SUM(b.quantity), 0) as available_capacity
      FROM show_dates sd
      LEFT JOIN bookings b ON sd.id = b.show_date_id AND b.status = 'confirmed'
      GROUP BY sd.id
      ORDER BY sd.date, sd.start_time
    `).all();
    res.json(showDates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch show dates' });
  }
});

// GET /api/bookings/:id - Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
  try {
    const booking = db.prepare(`
      SELECT
        b.*,
        tt.name as ticket_type_name,
        sd.date as show_date,
        sd.start_time as show_start_time,
        sd.end_time as show_end_time
      FROM bookings b
      JOIN ticket_types tt ON b.ticket_type_id = tt.id
      JOIN show_dates sd ON b.show_date_id = sd.id
      WHERE b.id = ?
    `).get(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// GET /api/bookings/email/:email - Get bookings by email
app.get('/api/bookings/email/:email', (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT
        b.*,
        tt.name as ticket_type_name,
        sd.date as show_date,
        sd.start_time as show_start_time,
        sd.end_time as show_end_time
      FROM bookings b
      JOIN ticket_types tt ON b.ticket_type_id = tt.id
      JOIN show_dates sd ON b.show_date_id = sd.id
      WHERE b.customer_email = ?
      ORDER BY b.booking_date DESC
    `).all(req.params.email);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings - Create a new booking
app.post('/api/bookings', (req, res) => {
  try {
    const bookingData: CreateBookingRequest = req.body;

    // Validate required fields
    if (!bookingData.customer_name || !bookingData.customer_email ||
        !bookingData.ticket_type_id || !bookingData.show_date_id ||
        !bookingData.quantity || bookingData.quantity < 1) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    // Check ticket type exists and has enough quantity
    const ticketType = db.prepare('SELECT * FROM ticket_types WHERE id = ?').get(bookingData.ticket_type_id);
    if (!ticketType) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }

    // Check show date exists and has capacity
    const showDate = db.prepare(`
      SELECT
        sd.*,
        COALESCE(SUM(b.quantity), 0) as booked_count
      FROM show_dates sd
      LEFT JOIN bookings b ON sd.id = b.show_date_id AND b.status = 'confirmed'
      WHERE sd.id = ?
      GROUP BY sd.id
    `).get(bookingData.show_date_id) as any;

    if (!showDate) {
      return res.status(404).json({ error: 'Show date not found' });
    }

    const availableCapacity = showDate.max_capacity - showDate.booked_count;
    if (availableCapacity < bookingData.quantity) {
      return res.status(400).json({
        error: `Not enough capacity. Only ${availableCapacity} tickets available for this date.`
      });
    }

    // Calculate total price
    const totalPrice = (ticketType as any).price * bookingData.quantity;

    // Create booking
    const bookingId = uuidv4();
    const insertBooking = db.prepare(`
      INSERT INTO bookings (id, customer_name, customer_email, customer_phone,
                           ticket_type_id, show_date_id, quantity, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `);

    insertBooking.run(
      bookingId,
      bookingData.customer_name,
      bookingData.customer_email,
      bookingData.customer_phone || null,
      bookingData.ticket_type_id,
      bookingData.show_date_id,
      bookingData.quantity,
      totalPrice
    );

    // Fetch and return the created booking
    const newBooking = db.prepare(`
      SELECT
        b.*,
        tt.name as ticket_type_name,
        sd.date as show_date,
        sd.start_time as show_start_time,
        sd.end_time as show_end_time
      FROM bookings b
      JOIN ticket_types tt ON b.ticket_type_id = tt.id
      JOIN show_dates sd ON b.show_date_id = sd.id
      WHERE b.id = ?
    `).get(bookingId);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// DELETE /api/bookings/:id - Cancel a booking
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run('cancelled', req.params.id);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// GET /api/stats - Get booking statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      total_bookings: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = ?').get('confirmed'),
      total_revenue: db.prepare('SELECT SUM(total_price) as total FROM bookings WHERE status = ?').get('confirmed'),
      tickets_sold: db.prepare('SELECT SUM(quantity) as total FROM bookings WHERE status = ?').get('confirmed'),
      bookings_by_ticket_type: db.prepare(`
        SELECT tt.name, COUNT(*) as count, SUM(b.quantity) as tickets_sold
        FROM bookings b
        JOIN ticket_types tt ON b.ticket_type_id = tt.id
        WHERE b.status = 'confirmed'
        GROUP BY tt.name
      `).all()
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Toronto Auto Show 2026 Booking System' });
});

app.listen(PORT, () => {
  console.log(`🚗 Toronto Auto Show 2026 Booking System`);
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`📅 Show dates: February 13-22, 2026`);
});
