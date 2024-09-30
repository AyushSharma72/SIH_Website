import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyTrafficLineChart = () => {
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Traffic Density (2023)",
        data: [
          15000, 20000, 25000, 30000, 22000, 28000, 22000, 22000, 20000, 30000,
          25000, 31000,
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)", // Blue color for the first line
        tension: 0.1,
      },
      {
        label: "Traffic Density (2024)",
        data: [
          18000, 23000, 27000, 31000, 14000, 20000, 21000, 25000, 29000, 33000,
          26000, 32000,
        ],
        fill: false,
        borderColor: "rgb(255, 165, 0)", // Orange color for the second line
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          font: {
            weight: "bold",
            size: 14, // Font size for the x-axis labels
          },
          color: "black", // Sets x-axis text color to black
        },
      },
      y: {
        beginAtZero: true,
        min: 5000,
        max: 35000,
        ticks: {
          stepSize: 5000, // Y-axis step size
          callback: function (value) {
            return value + ""; // Format y-axis without modification
          },
          font: {
            weight: "bold",
            size: 14, // Font size for the y-axis labels
          },
          color: "black", // Sets y-axis text color to black
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 16, // Size of the legend font
          },
        },
      },
      title: {
        display: true,
        text: "Monthly Traffic Density Comparison (2023 vs 2024)",
        font: {
          size: 18, // Title font size
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} className="bg-white mt-20" />
    </div>
  );
};

export default MonthlyTrafficLineChart;
