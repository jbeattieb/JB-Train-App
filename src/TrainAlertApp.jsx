// /src/TrainAlertApp.jsx

import React, { useEffect, useState } from 'react';

export default function TrainAlertApp() {
  const [arrivals, setArrivals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const res = await fetch('/api/arrivals');
        if (!res.ok) throw new Error('Failed to fetch arrivals');
        const data = await res.json();
        setArrivals(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArrivals();
    const interval = setInterval(fetchArrivals, 30000); // refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h1>Rickmansworth Train Arrivals</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {arrivals.length === 0 && !error && <p>Loading arrivals...</p>}
      <ul>
        {arrivals.map((train) => (
          <li key={train.id}>
            🚆 Train to <strong>{train.destinationName}</strong> arriving at{' '}
            <strong>{new Date(train.expectedArrival).toLocaleTimeString()}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
