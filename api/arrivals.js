// api/arrivals.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const tflUrl = 'https://api.tfl.gov.uk/StopPoint/Rickmansworth/Arrivals';

    const response = await fetch(tflUrl);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch from TfL API' });
      return;
    }

    const data = await response.json();

    // Sort by expectedArrival
    data.sort((a, b) => new Date(a.expectedArrival) - new Date(b.expectedArrival));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
