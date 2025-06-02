import React, { useEffect, useState } from 'react';

export default function TrainAlertApp() {
  const [arrivals, setArrivals] = useState([]);
  const [error, setError] = useState(null);
  const [noticeMinutes, setNoticeMinutes] = useState(5);
  const [notifiedTrains, setNotifiedTrains] = useState(new Set());

  // Fetch arrivals every 30 seconds
  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const res = await fetch('/api/arrivals');
        if (!res.ok) throw new Error('Failed to fetch arrivals');
        const data = await res.json();
        setArrivals(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setArrivals([]);
      }
    };

    fetchArrivals();
    const interval = setInterval(fetchArrivals, 30000);

    return () => clearInterval(interval);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Notifications for trains arriving soon
  useEffect(() => {
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const newNotified = new Set(notifiedTrains);

    arrivals.forEach((train) => {
      const arrivalTime = new Date(train.expectedArrival);
      const diffMinutes = (arrivalTime - now) / 1000 / 60;

      if (
        diffMinutes > 0 &&
        diffMinutes <= noticeMinutes &&
        !notifiedTrains.has(train.id)
      ) {
        new Notification(
          `Train to ${train.destinationName} arriving in ${Math.round(diffMinutes)} minutes!`
        );
        newNotified.add(train.id);
      }
    });

    setNotifiedTrains(newNotified);
  }, [arrivals, noticeMinutes, notifiedTrains]);

  return (
    <div
      style={{
        position: 'fixed',    // Fix position to avoid iOS repaint issues
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',    // allow scrolling if needed
        padding: 20,
        minHeight: 200,
        WebkitTextSizeAdjust: '100%',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTransform: 'translate3d(0,0,0)',   // GPU acceleration
        WebkitBackfaceVisibility: 'hidden',
        WebkitPerspective: 1000,
        willChange: 'transform',
        backgroundColor: 'white',
        color: 'black',
      }}
    >
      <h1>Harrow-on-the-Hill Train Arrivals</h1>

      <label>
        Notify me{' '}
        <input
          type="number"
          min="1"
          max="30"
          value={noticeMinutes}
          onChange={(e) => setNoticeMinutes(Number(e.target.value))}
          style={{ width: 50, marginLeft: 8, marginRight: 8 }}
        />
        minutes before train arrival
      </label>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {arrivals.length === 0 && !error ? (
        <p style={{ color: 'black', fontWeight: 'bold' }}>
          Loading arrivals…
        </p>
      ) : (
        <ul>
          {arrivals.map((train) => (
            <li key={train.id}>
              Train to {train.destinationName} arriving at{' '}
              {new Date(train.expectedArrival).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
