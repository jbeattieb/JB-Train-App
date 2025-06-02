import React, { useEffect, useState } from 'react';

export default function TrainAlertApp() {
  const [arrivals, setArrivals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArrivals = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/arrivals');  // Make sure your API is working!
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format');
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

    const interval = setInterval(fetchArrivals, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Harrow-on-the-Hill Train Arrivals</h1>

      {loading && <p>Loading arrivals...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && arrivals.length === 0 && <p>No upcoming arrivals found.</p>}

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
