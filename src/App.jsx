import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-routing-machine";
import { FaBell } from "react-icons/fa";
import logo from "../src/assets/logo.png";
import "./App.css";
import { Link } from 'react-router-dom';

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

// Convert DMS to Decimal
const dmsToDecimal = (dms, direction) => {
  const [degrees, minutes, seconds] = dms.split(/[°'"]/).map(Number);
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === "S" || direction === "W") {
    decimal = -decimal;
  }
  return decimal;
};


// Calculate the distance between two coordinates (Haversine formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const getNearbyHospitals = async (latitude, longitude) => {
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:5000,${latitude},${longitude})[amenity=hospital];out;`;
  try {
    const response = await fetch(overpassUrl);
    const data = await response.json();
    const hospitals = data.elements.map((hospital) => ({
      name: hospital.tags.name,
      address: hospital.tags['addr:full'] || 'Address not available',
      latitude: hospital.lat,
      longitude: hospital.lon,
    }));

    return hospitals;
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error.message);
    return [];
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

          return {
            latitude,
            longitude,
            time: new Date(item.createdAt).toLocaleString(),
            description: `Accident on ${new Date(item.createdAt).toLocaleString()}`,
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
  const [directions, setDirections] = useState([]);
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
  
        // Compute distance to each hospital and sort by nearest
        const sortedHospitals = nearbyHospitals.map(hospital => ({
          ...hospital,
          distance: getDistance(
            firstAccidentLocation.latitude,
            firstAccidentLocation.longitude,
            hospital.latitude,
            hospital.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);  // Take only the top 3 nearest hospitals
  
        setHospitals(sortedHospitals);  // Set the top 3 hospitals
      }
    };
  
    getData();
  }, []);
  

  const showRoute = (hospital) => {
    if (mapRef.current && locations.length > 0) {
      const map = mapRef.current;
      const firstAccidentLocation = locations[0];
  
      // Remove any existing routing control
      map.eachLayer(layer => {
        if (layer instanceof L.Routing.Control) {
          map.removeLayer(layer);
        }
      });
  
      // Add routing control for the selected hospital
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(hospital.latitude, hospital.longitude),
          L.latLng(firstAccidentLocation.latitude, firstAccidentLocation.longitude),
        ],
        lineOptions: {
          styles: [{ color: "blue", weight: 4 }], // Color of the route
        },
        createMarker: () => null,
        show: false,
        addWaypoints: false,
      }).addTo(map);
  
      routingControl.on("routesfound", function (e) {
        const route = e.routes[0];
        const steps = route.instructions.map((step) => ({
          text: step.text,
          distance: step.distance,
        }));
        setDirections(steps);
      });
  
      // Trigger a resize fix and fit the bounds of the map to the locations
      map.invalidateSize();
  
      // Fit bounds to include the accident location and the selected hospital
      const bounds = L.latLngBounds([
        [hospital.latitude, hospital.longitude],
        [firstAccidentLocation.latitude, firstAccidentLocation.longitude],
      ]);
      map.fitBounds(bounds);
    }
  };
  

  return (
    <div className="h-screen flex flex-col relative">
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        <h1 className="text-xl font-semibold">
          Transportation and Logistics Department
        </h1>
        <FaBell className="text-white text-2xl cursor-pointer" />
      </header>

      <div className="flex flex-grow mt-16">
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
      
      <Link to="/tollnaka"> {/* Link to Tollnaka page */}
        <div className="p-3 bg-orange-400 rounded hover:bg-orange-300 cursor-pointer transition duration-200">
          Tollnaka
        </div>
      </Link>
    </nav>

        <div className="flex flex-col flex-1 p-6 space-y-6">
          <div className="flex flex-col space-y-6">
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

            <div className="w-full h-[80vh]">
              <MapContainer
                center={[22.7196, 75.8577]}
                zoom={12}
                className="shadow-lg w-full h-full"
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
                      <strong>Address:</strong> {hospital.address}
                      <br />
                      <strong>Distance:</strong> {hospital.distance.toFixed(2)} km
                      <br />
                      <button
                        className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                        onClick={() => showRoute(hospital)}
                      >
                        Show Route
                      </button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow text-black mt-4">
            <h2 className="text-xl font-semibold mb-4">Nearest Hospitals Information</h2>
            {hospitals.map((hospital, index) => (
              <div key={index} className="border-b pb-2 mb-2">
                <h3 className="text-lg font-semibold">
                  {hospital.name} {index === 0 && <span className="text-green-500">(Nearest)</span>}
                </h3>
                <p><strong>Address:</strong> {hospital.address}</p>
                <p><strong>Distance:</strong> {hospital.distance.toFixed(2)} km</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                  onClick={() => showRoute(hospital)}
                >
                  Show Route
                </button>
              </div>
            ))}
          </div>

          {directions.length > 0 && (
            <div className="bg-white p-4 rounded shadow text-black mt-4">
              <h2 className="text-xl font-semibold mb-4">Directions to Accident</h2>
              <ul className="list-decimal ml-5">
                {directions.map((direction, index) => (
                  <li key={index} className="mb-2">
                    {direction.text} ({Math.round(direction.distance)} meters)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
}

export default App;
