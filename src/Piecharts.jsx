import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TwoPieCharts = () => {
  const ruralUrbanData = {
    labels: ["Rural", "Urban"],
    datasets: [
      {
        label: "Population Distribution",
        data: [40, 60], // Replace these values with your data
        backgroundColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
        borderColor: ["white", "white"],
        borderWidth: 2,
      },
    ],
  };

  const darknessLightData = {
    labels: [
      "Darkness - Light Unknown",
      "Darkness - Lights Lit",
      "Darkness - Lights Unlit",
      "Darkness - No Light",
      "Daylight",
    ],
    datasets: [
      {
        label: "Light Conditions",
        data: [15, 25, 20, 30, 10], // Replace these values with your data
        backgroundColor: [
          "rgb(255, 159, 64)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 205, 86)",
          "rgb(54, 162, 235)",
        ],
        borderColor: ["white", "white", "white", "white", "white"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Population Distribution (Rural vs Urban)",
        font: {
          size: 18,
        },
      },
    },
  };

  const options2 = {
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Light Conditions Distribution",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="flex  items-center justify-center">
      <div className="p-4  mt-20 w-[400px] h-[400px]">
        <Pie data={ruralUrbanData} options={options} />
      </div>
      <div className="p-4 mt-20  w-[500px] h-[500px]">
        <Pie data={darknessLightData} options={options2} />
      </div>
    </div>
  );
};

export default TwoPieCharts;
