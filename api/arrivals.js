// /api/arrivals.js

export default async function handler(req, res) {
  const stopPointId = '9100RICKMWTH'; // Rickmansworth Station
  const tflUrl = `https://api.tfl.gov.uk/StopPoint/${stopPointId}/Arrivals`;

  try {
    const response = await fetch(tflUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TfL API responded with non-OK:", errorText);
      return res.status(response.status).json({
        error: 'TfL API returned an error',
        status: response.status,
        message: errorText,
      });
    }

    const data = await response.json();

    // Sort by expected arrival time
    const sorted = data.sort((a, b) =>
      new Date(a.expectedArrival) - new Date(b.expectedArrival)
    );

    return res.status(200).json(sorted);
  } catch (error) {
    console.error("Function crash:", error.message);
    return res.status(500).json({
      error: 'Failed to fetch from TfL API',
      details: error.message,
    });
  }
}
