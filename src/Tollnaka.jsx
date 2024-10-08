import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import 'leaflet-routing-machine';
import L from 'leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import logo from "../src/assets/logo.png";
import "./App.css";

// Custom blue and red icons for the markers
const blueIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
});

const redIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
});

const Tollnaka = () => {
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalFare, setTotalFare] = useState(0);
  const [tollExpenses, setTollExpenses] = useState(0); // Toll expenses for highway segments
  const mapRef = useRef();

  // Route coordinates (dummy data for the example)
  const routeCoordinates = [
    { lat: 22.7196, lng: 75.8577 }, // Indore (Start)
    { lat: 22.9734, lng: 78.6569 }, // Sehore (on highway)
    { lat: 23.2599, lng: 77.4126 }, // Bhopal (End)
  ];

  // Dummy toll locations and toll data (only on highways)
  const tollLocations = [
    { lat: 22.8239, lng: 76.0820, toll: 50, city: 'Toll 1 near Indore' },
    { lat: 22.9734, lng: 78.5569, toll: 100, city: 'Toll 2 near Sehore' },
  ];

  // Function to calculate distance using haversine formula
  const calculateDistance = () => {
    let distance = 0;
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const start = routeCoordinates[i];
      const end = routeCoordinates[i + 1];
      distance += L.latLng(start.lat, start.lng).distanceTo(L.latLng(end.lat, end.lng)); // distance in meters
    }
    return distance / 1000; // Convert to kilometers
  };

  // Function to calculate toll expenses based only on highway segments
  const calculateTollExpenses = () => {
    let tollSum = 0;
    tollLocations.forEach((toll) => {
      const isOnHighway = routeCoordinates.some((route) => 
        L.latLng(route.lat, route.lng).distanceTo(L.latLng(toll.lat, toll.lng)) < 5000 // Close to toll location
      );
      if (isOnHighway) tollSum += toll.toll;
    });
    return tollSum;
  };

  // Function to calculate total fare (highway tolls only)
  const calculateFare = (distance) => {
    const tollRatePerKm = 2; // Dummy fare per kilometer on highways
    const totalTolls = calculateTollExpenses(); // Total toll expenses
    const distanceFare = distance * tollRatePerKm;

    return totalTolls + distanceFare;
  };

  useEffect(() => {
    const distance = calculateDistance();
    const tolls = calculateTollExpenses();
    const fare = calculateFare(distance);

    setTotalDistance(distance);
    setTollExpenses(tolls);
    setTotalFare(fare);
  }, []);

  // Map component to display route
  const DisplayRoute = () => {
    const map = useMap();

    useEffect(() => {
      L.Routing.control({
        waypoints: routeCoordinates.map(coord => L.latLng(coord.lat, coord.lng)),
        lineOptions: {
          styles: [{ color: '#6FA1EC', weight: 4 }],
        },
        createMarker: () => null, // Hides default markers
        addWaypoints: false,
      }).addTo(map);
    }, [map]);

    return null;
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        <h1 className="text-xl font-semibold">Transportation and Logistics Department</h1>
      </header>

      <div className="flex flex-grow mt-16">
        {/* Navigation */}
        <nav className="bg-orange-500 text-white w-1/6 p-6 flex flex-col space-y-4">
          <img src={logo} alt="Logo" className="h-25 w-50 mb-4" />

          <Link to="/">
            <div className="p-3 bg-orange-400 rounded hover:bg-orange-300 cursor-pointer transition duration-200">
              Dashboard
            </div>
          </Link>

          <Link to="/reports">
            <div className="p-3 bg-orange-400 rounded hover:bg-orange-300 cursor-pointer transition duration-200">
              Reports
            </div>
          </Link>

          <Link to="/tollnaka">
            <div className="p-3 bg-orange-400 rounded hover:bg-orange-300 cursor-pointer transition duration-200">
              Tollnaka
            </div>
          </Link>
        </nav>

        {/* Main content */}
        <div className="flex flex-col flex-1 p-6 space-y-6">
          {/* Map container */}
          <div className="w-full h-[70vh]">
            <MapContainer
              center={[22.7196, 75.8577]}
              zoom={7}
              className="shadow-lg w-full h-full"
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Polyline positions={routeCoordinates} color="blue" />

              {/* Start marker */}
              <Marker position={routeCoordinates[0]} icon={blueIcon}>
                <Popup>Start Point: Indore</Popup>
              </Marker>
              
              {/* End marker */}
              <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={blueIcon}>
                <Popup>End Point: Bhopal</Popup>
              </Marker>

              {/* Toll locations (red markers) */}
              {tollLocations.map((toll, index) => (
                <Marker key={index} position={[toll.lat, toll.lng]} icon={redIcon}>
                  <Popup>
                    <strong>{toll.city}</strong><br />
                    Toll Amount: ₹{toll.toll}
                  </Popup>
                </Marker>
              ))}
              <DisplayRoute />
            </MapContainer>
          </div>

          {/* Total Fare Details */}
          <div className="bg-white p-4 rounded shadow text-black mt-4">
            <h2 className="text-xl font-semibold mb-4">Total Fare Calculation</h2>
            <p><strong>Total Distance:</strong> {totalDistance.toFixed(2)} km</p>
            <p><strong>Total Toll Expenses:</strong> ₹{tollExpenses}</p>
            <p><strong>Total Fare (Distance + Tolls):</strong> ₹{totalFare.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tollnaka;
