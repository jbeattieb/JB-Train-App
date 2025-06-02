import React, { useEffect, useState } from 'react';

export default function TrainAlertApp() {
  const [message, setMessage] = useState('Train alert app is running.');

  useEffect(() => {
    // Placeholder: Replace with real train tracking API & notifications
    console.log('App mounted — here you would connect to train data and notification services.');
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Train Alert App</h1>
      <p>{message}</p>
      <p>This is a demo placeholder — train tracking logic goes here.</p>
    </div>
  );
}

