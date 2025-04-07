const Sensor = require("../models_v2/sensorModel");

const getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      attributes: [
        "sensor_id",
        "sensor_name",
        "sensor_details",
        "manufacturing_date",
        "status",
      ],
    });
    res.status(200).json({ sensors });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to fetch sensors" });
  }
};
const getAvailableSensors = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      attributes: [
        "sensor_id",
        "sensor_name",
        "sensor_details",
        "manufacturing_date",
        "status",
      ],
      where: { status: "Not Assigned" },
    });
    res.status(200).json({ sensors });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to fetch sensors" });
  }
};

const createSensor = async (req, res) => {
  try {
    const sensor = await Sensor.create(req.body);
    res.status(201).json({ sensor });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to create sensor" });
  }
};

const updateSensor = async (req, res) => {
  const { sensor_id, sensor_name, manufacturing_date, status } = req.body;
  try {
    const sensor = await Sensor.update(
      { sensor_name, manufacturing_date, status },
      {
        where: { sensor_id },
        returning: true,
      }
    );
    res.status(200).json({ sensor });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to update sensor" });
  }
};

const deleteSensor = async (req, res) => {
  const sensor_id = req.query.sensor_id;
  try {
    const sensor = await Sensor.destroy({ where: { sensor_id } });
    res.status(200).json({ sensor });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to Delete sensor" });
  }
};
module.exports = {
  getSensors,
  getAvailableSensors,
  createSensor,
  updateSensor,
  deleteSensor,
};
