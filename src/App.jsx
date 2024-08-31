import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { FaBell } from 'react-icons/fa';
import logo from "../src/assets/logo.png";
import './App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const dmsToDecimal = (dms, direction) => {
  const [degrees, minutes, seconds] = dms.split(/[°'"]/).map(Number);
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  return decimal;
};

const getHumanReadableAddress = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const address = data.address;
    const readableAddress = `${address.road || ''}, ${address.neighbourhood || ''}, ${address.suburb || ''}, ${address.city || address.town || ''}, ${address.state || ''}, ${address.country || ''}`.trim();
    return readableAddress;
  } catch (error) {
    console.error('Error fetching human-readable address:', error.message);
    return 'Unknown Location';
  }
};

const fetchLocationData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/Location/GetLocation');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const latitude = dmsToDecimal(data.Latitude.replace(/[NSEW]/g, ''), data.Latitude.slice(-1));
      const longitude = dmsToDecimal(data.Longitude.replace(/[NSEW]/g, ''), data.Longitude.slice(-1));
      const address = await getHumanReadableAddress(latitude, longitude);

      const convertedData = {
        latitude,
        longitude,
        time: new Date(data.createdAt).toLocaleString(),
        description: `Accident at ${address} on ${new Date(data.createdAt).toLocaleString()}`,
      };

      return [convertedData];
    } else {
      console.error('Data is not an object:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return [];
  }
};

function App() {
  const [locations, setLocations] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const bellIconRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchLocationData();
      setLocations(data);
      setAlertData(data);  // Set the same data for demonstration
    };

    getData();
  }, []);

  const handleBellClick = () => {
    setShowAlert(true);
  };

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Accidents per Month',
        data: [5, 7, 3, 9, 12, 6, 8, 10, 5, 7, 6, 8],  // Dummy data
        backgroundColor: 'rgba(0, 255, 0, 0.5)',  // Green color
        borderColor: 'rgba(0, 255, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        <h1 className="text-xl font-semibold">Transportation and Logistics Department</h1>
        <div className="relative">
          <FaBell
            ref={bellIconRef}
            className="text-white text-2xl cursor-pointer"
            onClick={handleBellClick}
          />
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-grow mt-16">
        {/* Navigation Bar */}
        <nav className="bg-orange-500 text-white w-1/4 p-6 flex flex-col space-y-4">
          <img src={logo} alt="Logo" className="h-25 w-50 mb-4" />
          <div className="p-3 bg-orange-400 rounded hover:bg-orange-300 cursor-pointer transition duration-200">
            Dashboard
          </div>
          <div className="p-3 bg-orange-400 rounded hover:bg-orange-300 cursor-pointer transition duration-200">
            Reports
          </div>
          <div className="p-3 bg-orange-400 rounded hover:bg-orange-300 cursor-pointer transition duration-200">
            Settings
          </div>
          <div className="p-3 bg-orange-400 rounded hover:bg-orange-300 cursor-pointer transition duration-200">
            Profile
          </div>
        </nav>

        {/* Center Section: Map and Accident Details */}
        <div className="flex flex-col flex-1 p-6 space-y-6">
          {/* Details Box and Map */}
          <div className="flex flex-row space-x-6">
            {/* Accident Details */}
            <div className="flex-1 bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Accident Details</h2>
              {locations.map((location, index) => (
                <div key={index} className="border-b pb-2 mb-2">
                  <p><strong>Description:</strong> {location.description}</p>
                  <p><strong>Latitude:</strong> {location.latitude}</p>
                  <p><strong>Longitude:</strong> {location.longitude}</p>
                  <p><strong>Time:</strong> {location.time}</p>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="w-1/2">
              <MapContainer center={[22.7196, 75.8577]} zoom={12} className="h-[400px] w-full rounded shadow-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {locations.map((location, index) => (
                  <Marker key={index} position={[location.latitude, location.longitude]} icon={defaultIcon}>
                    <Popup>{location.description}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Alerts and Past Events
          <div className="flex flex-col space-y-6"> */}
            {/* Alerts Chart
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Alerts Summary</h2>
              <div className="bg-gray-200 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">Monthly Accident Summary</h3>
                <Bar data={chartData} />
              </div>
            </div> */}

<div className="flex flex-col space-y-6">
            {/* Alerts Chart */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Alerts Summary</h2>
              <div className="bg-gray-200 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">Chart Title</h3>
                <p>Chart or summary of alert details...</p>
                {/* Add your chart here */}
              </div>
            </div>

            {/* Past Accident Insights */}
            <div className="bg-gray-100 p-6 rounded">
              <h2 className="text-xl font-semibold mb-4">Past Accident Insights</h2>
              <div className="bg-yellow-200 p-4 rounded mb-4 shadow">
                <p><strong>Location:</strong> Indore City Center</p>
                <p><strong>Details:</strong> Minor collision involving two vehicles.</p>
                <p><strong>Date:</strong> 2024-08-29</p>
              </div>
              <div className="bg-yellow-200 p-4 rounded shadow">
                <p><strong>Location:</strong> Rau, Indore</p>
                <p><strong>Details:</strong> Single-vehicle accident due to slippery roads.</p>
                <p><strong>Date:</strong> 2024-08-28</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Popup */}
      {showAlert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
          style={{ top: bellIconRef.current?.offsetTop + bellIconRef.current?.offsetHeight + 10 }}
        >
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Alert Details</h2>
            <p>New accident details from the backend...</p>
            <div className="bg-gray-200 p-4 rounded mt-4">
              {/* Display chart or alert details */}
              <h3 className="text-lg font-semibold mb-2">Alert Summary</h3>
              <p>Details of the alert...</p>
              {/* Add your chart here */}
            </div>
            <button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => setShowAlert(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
