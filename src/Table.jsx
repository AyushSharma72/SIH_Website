import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import map from "./assets/map.png";
const data = [
  {
    hotSpot: "1",
    location: "235 and Lyon Street",
    giSize: "1.29",
    latitude: "23.5",
    longitude: "45.7",
    densityEstimate: "0.8",
  },
  {
    hotSpot: "2",
    location: "US Highway 69",
    giSize: "4.25",
    latitude: "12.1",
    longitude: "33.3",
    densityEstimate: "1.2",
  },
  {
    hotSpot: "3",
    location: "Sunset Blvd and 5th Ave",
    giSize: "2.15",
    latitude: "40.7",
    longitude: "-74.0",
    densityEstimate: "1.5",
  },
  {
    hotSpot: "4",
    location: "Parkway and Main St",
    giSize: "3.67",
    latitude: "36.2",
    longitude: "-115.1",
    densityEstimate: "0.9",
  },
  {
    hotSpot: "5",
    location: "Broadway and Elm St",
    giSize: "5.44",
    latitude: "51.5",
    longitude: "-0.1",
    densityEstimate: "1.8",
  },
];

const HotspotTable = () => {
  return (
    <div className="flex justify-around">
      {" "}
      <TableContainer component={Paper} className="!w-[60%]">
        <Table sx={{ minWidth: 650 }} aria-label="hotspot table">
          <TableHead>
            <TableRow>
              <TableCell className="!font-bold">Hot Spot Rank</TableCell>
              <TableCell className="!font-bold">Location</TableCell>
              <TableCell className="!font-bold">Gi* size</TableCell>
              <TableCell className="!font-bold">
                Latitude (in degrees)
              </TableCell>
              <TableCell className="!font-bold">
                Longitude (in degrees)
              </TableCell>
              <TableCell className="!font-bold">
                Density estimate (max)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.hotSpot}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.giSize}</TableCell>
                <TableCell>{row.latitude}</TableCell>
                <TableCell>{row.longitude}</TableCell>
                <TableCell>{row.densityEstimate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <img src={map} className="h-[370px] w-[450px]"></img>
    </div>
  );
};

export default HotspotTable;
