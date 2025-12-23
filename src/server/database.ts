import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../bookings.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Ticket types table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ticket_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      available_quantity INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Show dates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS show_dates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      max_capacity INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      ticket_type_id INTEGER NOT NULL,
      show_date_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'confirmed',
      FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id),
      FOREIGN KEY (show_date_id) REFERENCES show_dates(id)
    )
  `);

  // Seed initial data if tables are empty
  seedInitialData();
}

function seedInitialData() {
  const ticketCount = db.prepare('SELECT COUNT(*) as count FROM ticket_types').get() as { count: number };

  if (ticketCount.count === 0) {
    // Insert ticket types
    const insertTicket = db.prepare(`
      INSERT INTO ticket_types (name, description, price, available_quantity)
      VALUES (?, ?, ?, ?)
    `);

    insertTicket.run('General Admission', 'Access to all show floors and exhibits', 35.00, 5000);
    insertTicket.run('VIP Pass', 'Priority access, exclusive lounge, and guided tours', 125.00, 500);
    insertTicket.run('Family Pack (4 tickets)', 'General admission for family of 4', 120.00, 1000);
    insertTicket.run('Student/Senior', 'Discounted general admission', 25.00, 2000);

    console.log('✓ Ticket types seeded');
  }

  const dateCount = db.prepare('SELECT COUNT(*) as count FROM show_dates').get() as { count: number };

  if (dateCount.count === 0) {
    // Insert show dates for Toronto Auto Show 2026
    const insertDate = db.prepare(`
      INSERT INTO show_dates (date, start_time, end_time, max_capacity)
      VALUES (?, ?, ?, ?)
    `);

    // February 2026 show dates (typical auto show period)
    const dates = [
      ['2026-02-13', '10:00:00', '22:00:00', 15000],
      ['2026-02-14', '10:00:00', '22:00:00', 18000],
      ['2026-02-15', '10:00:00', '22:00:00', 18000],
      ['2026-02-16', '10:00:00', '20:00:00', 12000],
      ['2026-02-17', '10:00:00', '20:00:00', 12000],
      ['2026-02-18', '10:00:00', '20:00:00', 12000],
      ['2026-02-19', '10:00:00', '20:00:00', 12000],
      ['2026-02-20', '10:00:00', '22:00:00', 15000],
      ['2026-02-21', '10:00:00', '22:00:00', 18000],
      ['2026-02-22', '10:00:00', '18:00:00', 15000]
    ];

    dates.forEach(([date, start, end, capacity]) => {
      insertDate.run(date, start, end, capacity);
    });

    console.log('✓ Show dates seeded');
  }
}

export default db;
