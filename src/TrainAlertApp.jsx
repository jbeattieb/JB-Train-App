import React, { useEffect, useState } from 'react';

export default function TrainAlertApp() {
  const [arrivals, setArrivals] = useState([]);
  const [error, setError] = useState(null);
  const [notifiedTrains, setNotifiedTrains] = useState(new Set());
  const [noticeMinutes, setNoticeMinutes] = useState(5);

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
      }
    };

    fetchArrivals();

    const interval = setInterval(fetchArrivals, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!arrivals.length) return;

    const now = new Date();
    const newNotified = new Set(notifiedTrains);

    arrivals.forEach((train) => {
      const arrivalTime = new Date(train.expectedArrival);
      const diffMinutes = (arrivalTime - now) / 1000 / 60;

      if (
        diffMinutes > 0 &&
        diffMinutes <= noticeMinutes &&
        !notifiedTrains.has(train.id) &&
        Notification.permission === 'granted'
      ) {
        new Notification(
          `Train to ${train.destinationName} arriving in ${Math.round(diffMinutes)} minutes!`
        );
        newNotified.add(train.id);
      }
    });

    setNotifiedTrains(newNotified);
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
      <ul>
        {arrivals.length === 0 && !error && <li>Loading arrivals...</li>}
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
