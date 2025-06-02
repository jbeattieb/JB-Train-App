import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function TrainAlertApp() {
  const [position, setPosition] = useState(null);
  const [leadTime, setLeadTime] = useState(5);
  const [station, setStation] = useState(null);
  const [status, setStatus] = useState("Select a location to begin.");
  const intervalRef = useRef(null);

  const stations = [
    { id: "940GZZLURKW", name: "Rickmansworth", lat: 51.6386, lon: -0.4732 },
    { id: "940GZZLUUXB", name: "Uxbridge", lat: 51.5468, lon: -0.4776 },
    { id: "940GZZLUHR4", name: "Harrow-on-the-Hill", lat: 51.5793, lon: -0.3376 },
  ];

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setStatus("Finding nearest station...");
        findNearestStation(e.latlng);
      },
    });
    return position === null ? null : <Marker position={position} />;
  }

  function findNearestStation(coords) {
    let minDist = Infinity;
    let nearest = null;
    stations.forEach((st) => {
      const d = haversine(coords.lat, coords.lng, st.lat, st.lon);
      if (d < minDist) {
        minDist = d;
        nearest = st;
      }
    });
    setStation(nearest);
    setStatus(`Nearest station: ${nearest.name}`);
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // meters
  }

  function fetchTrainArrivals(stationId) {
    fetch(`https://api.tfl.gov.uk/StopPoint/${stationId}/Arrivals`)
      .then((res) => res.json())
      .then((data) => {
        const arrivals = data.filter((item) => {
          const etaToStation = item.time
