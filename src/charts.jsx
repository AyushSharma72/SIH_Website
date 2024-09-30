import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RoadTypeBarChart = () => {
  const data = {
    labels: [
      "Slip Road",
      "Single Carriageway",
      "RoundAbout",
      "One Way Street",
      "Dual CarriageWay",
    ],
    datasets: [
      {
        label: "Road Type",
        data: [100000, 150000, 50000, 200000, 250000],
        backgroundColor: ["rgb(255, 165, 0)"],
        borderColor: ["rgb(255, 255, 255)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y", // This makes the bars horizontal
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value / 1000 + "k"; // Format x-axis as 'k'
          },
          font: {
            weight: "bold",
            size: 14, // Increases font size
          },
          color: "black",
        },
        max: 250000,
      },
      y: {
        title: {
          display: true,
          text: "Road Type",
        },
        ticks: {
          font: {
            weight: "bold",
            size: 14, // Increases font size
          },
          color: "black",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Bar Chart for Road Types",
        font: {
          size: 18, // Increase title font size
        },
      },
    },
  };

  const data2 = {
    labels: [
      "Wet or damp",
      "Snow",
      "Frost and ice",
      "Flood over 3cm deep",
      "Dry",
    ],
    datasets: [
      {
        label: "Road Type",
        data: [200000, 100500, 30000, 20000, 100000],
        backgroundColor: ["rgb(255, 165, 0)"],
        borderColor: ["rgb(255, 255, 255)"],
        borderWidth: 1,
      },
    ],
  };

  const options2 = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value / 1000 + "k";
          },
          font: {
            weight: "bold",
            size: 14, // Increases font size
          },
          color: "black",
        },
        max: 300000,
      },
      y: {
        title: {
          display: true,
          text: "Road Condition",
        },
        ticks: {
          font: {
            weight: "bold",
            size: 14, // Increases font size
          },
          color: "black",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Road Condition",
        font: {
          size: 18, // Increase title font size
        },
      },
    },
  };

  return (
    <div className="flex justify-between ">
      <Bar
        data={data}
        options={options}
        className="bg-white p-4 !w-[550px] !h-[400px] mt-20"
      />
      <Bar
        data={data2}
        options={options2}
        className="bg-white p-4 !w-[550px] !h-[400px] mt-20"
      />
    </div>
  );
};

export default RoadTypeBarChart;
