const { sequelize } = require("../config/database.js");
const WaterTankStatus = require("../models_v2/waterTankStatusModel.js");
const { Op, Sequelize } = require("sequelize");

// Create a new tanker
exports.createTankStatus = async (req, res) => {
  // tank id and level form query parameters
  const { tank_id, level } = req.query;
  try {
    // const { tank_id, level } = req.body; // Use plate_number and tanker_model as in model
    const newTanker = await WaterTankStatus.create({
      tank_id,
      water_level: level,
    });
    res.status(201).json(newTanker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTankStatus = async (req, res) => {
  const { tank_id } = req.query;

  try {
    const latestTankStatus = await WaterTankStatus.findOne({
      where: {
        tank_id: tank_id,
      },
      order: [
        ["status_date", "DESC"],
        ["status_time", "DESC"],
      ],
      attributes: [
        // 'id',
        // 'tank_id',
        "water_level",
        // 'status',
        // 'status_date',
        // 'status_time',
      ],
    });

    if (!latestTankStatus) {
      return res
        .status(404)
        .json({ message: "No status found for this tank_id." });
    }

    res.status(200).json(latestTankStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailyAvgConsumption = async (req, res) => {
  try {
    const tankId = req.query.tank_id; // Get tank_id from request params or default to 1

    const results = await WaterTankStatus.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("status_date")), "date"],
        [Sequelize.fn("AVG", Sequelize.col("water_level")), "avg_level"],
      ],
      where: {
        tank_id: tankId,
        status_date: {
          [Op.gte]: Sequelize.literal("CURRENT_DATE - INTERVAL '30 days'"),
        },
      },
      group: [
        "tank_id",
        Sequelize.fn("DATE", Sequelize.col("status_date")),
        "status",
      ],
      order: [[Sequelize.fn("DATE", Sequelize.col("status_date")), "DESC"]],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
