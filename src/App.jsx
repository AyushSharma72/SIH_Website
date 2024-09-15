import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { FaBell } from "react-icons/fa";
import logo from "../src/assets/logo.png";
import "./App.css";
import { toast } from "react-toastify";
import { Divider } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const defaultIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Define a new blue icon for hospitals
const hospitalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const dmsToDecimal = (dms, direction) => {
  const [degrees, minutes, seconds] = dms.split(/[°'"]/).map(Number);
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === "S" || direction === "W") {
    decimal = -decimal;
  }
  return decimal;
};

const getNearbyHospitals = async (latitude, longitude) => {
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${latitude},${longitude})[amenity=hospital];out;`;
  try {
    const response = await fetch(overpassUrl);
    const data = await response.json();
    const hospitals = data.elements.map((hospital) => ({
      name: hospital.tags.name,
      latitude: hospital.lat,
      longitude: hospital.lon,
    }));

    // Limit to the first 3 nearby hospitals
    return hospitals;
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error.message);
    return [];
  }
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
    const readableAddress = `${data.display_name || ""}`;
    return readableAddress;
  } catch (error) {
    console.error("Error fetching human-readable address:", error.message);
    return "Unknown Location";
  }
};

const fetchLocationData = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/Location/GetLocation"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (Array.isArray(data)) {
      const convertedData = await Promise.all(
        data.map(async (item) => {
          const latitude = dmsToDecimal(
            item.Latitude.replace(/[NSEW]/g, ""),
            item.Latitude.slice(-1)
          );
          const longitude = dmsToDecimal(
            item.Longitude.replace(/[NSEW]/g, ""),
            item.Longitude.slice(-1)
          );
          const address = await getHumanReadableAddress(latitude, longitude);

          return {
            latitude,
            longitude,
            time: new Date(item.createdAt).toLocaleString(),
            description: `Accident at ${address} on ${new Date(
              item.createdAt
            ).toLocaleString()}`,
          };
        })
      );

      return convertedData;
    } else {
      console.error("Data is not an array:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

function App() {
  const [locations, setLocations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchLocationData();
      setLocations(data);

      if (data.length > 0) {
        const firstAccidentLocation = data[0];
        const nearbyHospitals = await getNearbyHospitals(
          firstAccidentLocation.latitude,
          firstAccidentLocation.longitude
        );
        setHospitals(nearbyHospitals);
      }
    };

    getData();
  }, []);

  const barChartData = {
    labels: locations.map((loc) => loc.time),
    datasets: [
      {
        label: "Accident Occurrences",
        data: locations.map(() => 1),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Occurrences: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        <h1 className="text-xl font-semibold">
          Transportation and Logistics Department
        </h1>
        <FaBell className="text-white text-2xl cursor-pointer" />
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
        </nav>

        {/* Center Section: Map and Accident Details */}
        <div className="flex flex-col flex-1 p-6 space-y-6">
          {/* Details Box and Map */}
          <div className="flex flex-col space-y-6">
            {/* Accident Details */}
            <div className="flex-1 bg-white p-4 rounded shadow text-black overflow-y-auto h-[300px]">
              <h2 className="text-xl font-semibold mb-4">Accident Details</h2>
              {locations.map((location, index) => (
                <div key={index} className="border-b pb-2 mb-2">
                  <p>
                    <strong>Description:</strong> {location.description}
                  </p>
                  <p>
                    <strong>Latitude:</strong> {location.latitude}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {location.longitude}
                  </p>
                  <p>
                    <strong>Time:</strong> {location.time}
                  </p>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="w-full h-[300px]">
              <MapContainer
                center={[22.7196, 75.8577]}
                zoom={12}
                className="shadow-lg z-0"
                ref={mapRef}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {locations.map((location, index) => (
                  <Marker
                    key={index}
                    position={[location.latitude, location.longitude]}
                    icon={defaultIcon}
                  >
                    <Popup>
                      <strong>Description:</strong> {location.description}
                      <br />
                      <strong>Latitude:</strong> {location.latitude}
                      <br />
                      <strong>Longitude:</strong> {location.longitude}
                    </Popup>
                  </Marker>
                ))}

                {hospitals.map((hospital, index) => (
                  <Marker
                    key={index}
                    position={[hospital.latitude, hospital.longitude]}
                    icon={hospitalIcon}
                  >
                    <Popup>
                      <strong>{hospital.name}</strong>
                      <br />
                      <strong>Latitude:</strong> {hospital.latitude}
                      <br />
                      <strong>Longitude:</strong> {hospital.longitude}
                    </Popup>
                  </Marker>
                ))}

                {locations.map((location, locIndex) =>
                  hospitals.map((hospital, hosIndex) => (
                    <Polyline
                      key={`polyline-${locIndex}-${hosIndex}`}
                      positions={[
                        [location.latitude, location.longitude],
                        [hospital.latitude, hospital.longitude],
                      ]}
                      color="blue"
                    />
                  ))
                )}
              </MapContainer>
            </div>
          </div>

          {/* Bottom Section: Accident Statistics */}
          <div className="bg-white p-4 rounded shadow text-black">
            <h2 className="text-xl font-semibold mb-4">Accident Statistics</h2>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
