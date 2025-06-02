import React, { useEffect, useState } from 'react';

export default function TrainAlertApp() {
  const [arrivals, setArrivals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const res = await fetch('/api/arrivals'); // Calls your serverless API
        if (!res.ok) throw new Error('Failed to fetch arrivals');
        const data = await res.json();
        setArrivals(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArrivals();

    const interval = setInterval(fetchArrivals, 30000); // Refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Rickmansworth Train Arrivals</h1>
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
