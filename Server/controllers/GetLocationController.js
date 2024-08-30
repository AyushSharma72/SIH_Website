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

module.exports = { GetLocation };
