import React, { useEffect, useState } from 'react';

export default function TrainAlertApp() {
  const [arrivals, setArrivals] = useState([]);
  const [error, setError] = useState(null);
  const [notifiedTrains, setNotifiedTrains] = useState(new Set());
  const [noticeMinutes, setNoticeMinutes] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArrivals = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/arrivals');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format received');
        setArrivals(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArrivals();

    const interval = setInterval(fetchArrivals, 30000); // refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  // Request notification permission once on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Notify when train arrival is within noticeMinutes
  useEffect(() => {
    if (!arrivals.length) return;
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const newNotified = new Set(notifiedTrains);

    arrivals.forEach((train) => {
      if (!train.id || !train.expectedArrival) return; // Defensive check

      const arrivalTime = new Date(train.expectedArrival);
      const diffMinutes = (arrivalTime - now) / 1000 / 60;

      if (
        diffMinutes > 0 &&
        diffMinutes <= noticeMinutes &&
        !notifiedTrains.has(train.id)
      ) {
        try {
          new Notification(
            `Train to ${train.destinationName} arriving in ${Math.round(diffMinutes)} minute(s)!`
          );
          newNotified.add(train.id);
        } catch {
          // Notifications can throw if blocked
        }
      }
    });

    // Only update state if new notifications sent to avoid infinite loops
    if (newNotified.size !== notifiedTrains.size) {
      setNotifiedTrains(newNotified);
    }
  }, [arrivals, notifiedTrains, noticeMinutes]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Harrow-on-the-Hill Train Arrivals</h1>

      <label>
        Notify me
        <input
          type="number"
          min="1"
          max="30"
          value={noticeMinutes}
          onChange={(e) => setNoticeMinutes(Number(e.target.value))}
          style={{ marginLeft: 8, width: 50 }}
        />
        minutes before train arrival
      </label>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {loading && !error && <p>Loading arrivals...</p>}

      {!loading && !error && arrivals.length === 0 && (
        <p>No upcoming arrivals found.</p>
      )}

      <ul>
        {arrivals.map((train) => (
          <li key={train.id}>
            Train to {train.destinationName} arriving at{' '}
            {new Date(train.expectedArrival).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
