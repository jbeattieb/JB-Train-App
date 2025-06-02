// /api/arrivals.js

export default async function handler(req, res) {
  const stopPointId = '9100RICKMWTH'; // Rickmansworth Station
  const tflUrl = `https://api.tfl.gov.uk/StopPoint/${stopPointId}/Arrivals`;

  try {
    const response = await fetch(tflUrl);
