const Location = require("../modals/Locationmodal");
async function GetLocation(req, res) {
  try {
    const location = await Location.find();
    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ message: "No location found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function AddLocation(req, res) {
  try {
    const { Latitude, Longitude, createdAt, updatedAt } = req.body;
    const newLocation = new Location({
      Latitude,
      Longitude,
      createdAt,
      updatedAt,
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = { GetLocation, AddLocation };

//async function GetLocation(req, res) {
// try {
// const locations = await Location.find().sort({ createdAt: -1 }); // Fetch all locations and sort by //creation date (newest first)
//  if (locations && locations.length > 0) {
//   res.status(200).json(locations); // Return all locations
// } else {
//    res.status(404).json({ message: "No locations found" });
//  }
//} catch (error) {
//   res.status(500).json({ message: "Server error", error });
// }
//}
