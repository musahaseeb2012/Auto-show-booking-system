# Toronto Auto Show 2026 - Booking System

A full-stack booking system for the Toronto Auto Show 2026, built with Node.js, Express, TypeScript, React, and SQLite.

**✅ Fully Safari Compatible** - Optimized for Safari desktop and iOS with proper webkit prefixes, date handling, and touch interactions. See [SAFARI_COMPATIBILITY.md](./SAFARI_COMPATIBILITY.md) for details.

## Features

- 🎫 **Multiple Ticket Types**: General Admission, VIP Pass, Family Pack, Student/Senior
- 📅 **Show Date Selection**: 10-day event from February 13-22, 2026
- 💳 **Easy Booking**: Simple three-step booking process
- 📧 **Email Lookup**: View and manage bookings by email
- ❌ **Cancellation**: Cancel bookings when needed
- 📊 **Real-time Availability**: Track available tickets for each date
- 💰 **Automatic Pricing**: Calculate total cost based on ticket type and quantity

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- SQLite (better-sqlite3)
- RESTful API

### Frontend
- React 18
- TypeScript
- Vite
- Axios for API calls
- Modern CSS with gradient design

## Project Structure

```
Auto-show-booking-system/
├── src/
│   └── server/
│       ├── server.ts          # Express server and API routes
│       ├── database.ts        # Database initialization and seeding
│       └── types.ts           # TypeScript type definitions
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingForm.tsx    # Booking form component
│   │   │   └── MyBookings.tsx     # View bookings component
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # React entry point
│   │   ├── api.ts             # API client
│   │   ├── types.ts           # Frontend types
│   │   └── index.css          # Styling
│   ├── index.html             # HTML template
│   ├── vite.config.ts         # Vite configuration
│   └── package.json           # Frontend dependencies
├── package.json               # Backend dependencies
├── tsconfig.server.json       # TypeScript config for server
└── .env.example               # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Auto-show-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   ```
   This will install both backend and frontend dependencies.

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you want to customize the port or database path.

### Running the Application

#### Development Mode

Run both backend and frontend concurrently:
```bash
npm run dev
```

Or run them separately:

**Backend only:**
```bash
npm run server:dev
```
Server runs on http://localhost:3000

**Frontend only:**
```bash
npm run client:dev
```
Client runs on http://localhost:5173

#### Production Mode

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

### Ticket Types
- `GET /api/ticket-types` - Get all ticket types

### Show Dates
- `GET /api/show-dates` - Get all show dates with availability

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/email/:email` - Get all bookings for an email
- `DELETE /api/bookings/:id` - Cancel a booking

### Statistics
- `GET /api/stats` - Get booking statistics (total bookings, revenue, etc.)

### Health Check
- `GET /health` - Server health check

## Usage Guide

### Booking Tickets

1. **Select Ticket Type**
   - Choose from General Admission, VIP Pass, Family Pack, or Student/Senior tickets
   - Each ticket type shows price and availability

2. **Select Show Date**
   - Choose from 10 available dates in February 2026
   - See real-time availability for each date
   - Times vary by date (10 AM - 10 PM on most days)

3. **Enter Your Information**
   - Provide your name, email, and optional phone number
   - Select quantity (1-10 tickets)
   - Review total price
   - Complete booking

4. **Confirmation**
   - Receive booking confirmation with unique booking ID
   - Use this ID to manage your booking later

### Managing Bookings

1. **View Bookings**
   - Click "My Bookings" tab
   - Enter your email address
   - View all bookings associated with that email

2. **Cancel Bookings**
   - Find your booking in "My Bookings"
   - Click "Cancel Booking" button
   - Confirm cancellation

## Database Schema

### ticket_types
- id (PRIMARY KEY)
- name
- description
- price
- available_quantity
- created_at

### show_dates
- id (PRIMARY KEY)
- date
- start_time
- end_time
- max_capacity
- created_at

### bookings
- id (PRIMARY KEY, UUID)
- customer_name
- customer_email
- customer_phone
- ticket_type_id (FOREIGN KEY)
- show_date_id (FOREIGN KEY)
- quantity
- total_price
- booking_date
- status (confirmed/cancelled)

## Default Ticket Types

1. **General Admission** - $35.00
   - Access to all show floors and exhibits
   - 5,000 available

2. **VIP Pass** - $125.00
   - Priority access, exclusive lounge, guided tours
   - 500 available

3. **Family Pack (4 tickets)** - $120.00
   - General admission for family of 4
   - 1,000 available

4. **Student/Senior** - $25.00
   - Discounted general admission
   - 2,000 available

## Show Schedule

**Toronto Auto Show 2026**
- **Dates**: February 13-22, 2026
- **Location**: Metro Toronto Convention Centre
- **Hours**:
  - Weekdays: 10:00 AM - 8:00 PM
  - Weekends: 10:00 AM - 10:00 PM
  - Final Day: 10:00 AM - 6:00 PM

## Development

### Adding New Features

The codebase is modular and easy to extend:

- **Add ticket types**: Modify the seed data in `src/server/database.ts`
- **Add show dates**: Update the dates array in `src/server/database.ts`
- **Customize styling**: Edit `client/src/index.css`
- **Add new API endpoints**: Update `src/server/server.ts`

### Testing the API

Use curl or Postman to test endpoints:

```bash
# Get ticket types
curl http://localhost:3000/api/ticket-types

# Get show dates
curl http://localhost:3000/api/show-dates

# Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "ticket_type_id": 1,
    "show_date_id": 1,
    "quantity": 2
  }'

# Get bookings by email
curl http://localhost:3000/api/bookings/email/john@example.com
```

## Browser Compatibility

This application is fully compatible with:
- ✅ **Safari** (desktop and iOS) - See [SAFARI_COMPATIBILITY.md](./SAFARI_COMPATIBILITY.md)
- ✅ Chrome/Edge (Chromium-based browsers)
- ✅ Firefox
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)

### Safari-Specific Features:
- Webkit-prefixed CSS for gradients, transforms, and transitions
- Safari-compatible date parsing
- iOS touch optimizations
- Proper input styling for iOS devices

## Troubleshooting

**Port already in use:**
- Change the PORT in `.env` file
- Or kill the process using the port: `lsof -ti:3000 | xargs kill`

**Database errors:**
- Delete `bookings.db` and restart the server to reinitialize

**Frontend not connecting to backend:**
- Ensure backend is running on port 3000
- Check Vite proxy configuration in `client/vite.config.ts`

**Dates not displaying correctly in Safari:**
- The app uses Safari-compatible date parsing (see SAFARI_COMPATIBILITY.md)
- If issues persist, check browser console for errors

## License

MIT License

## Author

Created for the Toronto Auto Show 2026 booking system demonstration.
