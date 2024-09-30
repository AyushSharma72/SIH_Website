import React from "react";

import HotspotTable from "./Table";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Link } from "react-router-dom";
import logo from "../src/assets/logo.png";
import RoadTypeBarChart from "./charts";
import MonthlyTrafficLineChart from "./LineChart";
import TwoPieCharts from "./Piecharts";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  // Dummy data for accidents on roads
  const accidentData = {
    labels: ["Ring Road", "AB Road", "MR10", "Rajkumar Bridge", "Dewas Naka"],
    datasets: [
      {
        label: "Accidents",
        data: [120, 90, 150, 80, 200],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dummy data for accident types
  const accidentTypeData = {
    labels: ["Car", "Bike", "Truck", "Pedestrian"],
    datasets: [
      {
        data: [300, 100, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Dummy data for accidents over time (weekly)
  const accidentTimeData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Accidents per Day",
        data: [15, 12, 25, 18, 20, 22, 30],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        <h1 className="text-xl font-semibold">
          Transportation and Logistics Department
        </h1>
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
          <h2 className="text-3xl font-bold mb-6">
            Accident Hotspot Analysis Report
          </h2>
          <HotspotTable />
          <RoadTypeBarChart />
          <TwoPieCharts />
          <MonthlyTrafficLineChart />
          {/* Insights Section */}
          <div className="bg-white p-4 rounded shadow text-black mt-4">
            <h2 className="text-xl font-semibold mb-4">Insights</h2>
            <ul className="list-disc list-inside">
              <li>
                Road E has the highest number of accidents with 200 recorded
                incidents.
              </li>
              <li>
                Most accidents involve cars, accounting for 60% of total
                accidents.
              </li>
              <li>
                Accidents tend to spike on weekends, with Sunday having the
                highest count.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
