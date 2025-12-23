import { useState } from 'react'
import BookingForm from './components/BookingForm'
import MyBookings from './components/MyBookings'

function App() {
  const [activeTab, setActiveTab] = useState<'book' | 'view'>('book');

  return (
    <div className="container">
      <div className="header">
        <h1>🚗 Toronto Auto Show 2026</h1>
        <p>February 13-22, 2026 | Metro Toronto Convention Centre</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'book' ? 'active' : ''}`}
          onClick={() => setActiveTab('book')}
        >
          Book Tickets
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          My Bookings
        </button>
      </div>

      {activeTab === 'book' ? <BookingForm /> : <MyBookings />}
    </div>
  )
}

export default App
