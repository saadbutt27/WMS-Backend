const { sequelize } = require("../config/database.js");
const WaterTankStatus = require("../models_v2/waterTankStatusModel.js");
const WaterTank = require("../models_v2/waterTankModel.js");
const Notification = require("../models_v2/notificationsModel.js");
const CustomerNotification = require("../models_v2/customerNotificationsModel.js");
const { Op, Sequelize, literal } = require("sequelize");

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

    // get tank capacity from tank table based on tank id
    const tank = await WaterTank.findOne({
      where: {
        tank_id: tank_id,
      },
      attributes: ["tank_id", "capacity", "customer_id"],
    });
    const tank_capacity = tank.capacity; // 5000 gallons
    // As we have tank capacity we can calculate available water in tank in gallons using water_level(which is in percentage) and tank_capacity
    const availableWater = (level / 100) * tank_capacity; // in gallons
    // if water level is less than 25 gallons then send alert to customer
    if (availableWater < 25) {
      // create a notification for customer
      const notification = await Notification.create({
        title: "Low Water Level Alert",
        message: `Water level is low, ${availableWater} gallons in your tank. Please request for a refill.`,
        admin_id: 3,
      });
      // create an entry in customer notifications table
      await CustomerNotification.create({
        customer_id: tank.customer_id,
        notification_id: notification.notification_id,
      });
    }

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

// get tank status of a customer/tank from a start data to end date on hourly bais, with water consumption
// and water level
// exports.getTankStatusWithConsumption = async (req, res) => {
//   const { start_date, end_date } = req.body;
//   const tank_id = req.params.id;

//   if (!tank_id || !start_date || !end_date) {
//     return res
//       .status(400)
//       .json({ error: "tank_id, start_date and end_date are required" });
//   }

//   try {
//     // 1. Fetch status ordered by date and time
//     const tankStatus = await WaterTankStatus.findAll({
//       where: {
//         status_date: {
//           [Op.between]: [new Date(start_date), new Date(end_date)],
//         },
//         tank_id: tank_id,
//       },
//       attributes: [
//         "tank_id",
//         "water_level",
//         "status_date",
//         "status_time",
//       ],
//       order: [
//         ["status_date", "ASC"],
//         ["status_time", "ASC"],
//       ],
//     });

//     // 2. Group by date to compute daily averages
//     const dailyData = {};
//     for (const entry of tankStatus) {
//       const date = new Date(entry.status_date).toISOString().split('T')[0]; // YYYY-MM-DD
//       if (!dailyData[date]) {
//         dailyData[date] = { total: 0, count: 0 };
//       }
//       dailyData[date].total += parseFloat(entry.water_level);
//       dailyData[date].count += 1;
//     }

//     const sortedDates = Object.keys(dailyData).sort();
//     const consumptionByDate = {};

//     for (let i = 1; i < sortedDates.length; i++) {
//       const prevDate = sortedDates[i - 1];
//       const currDate = sortedDates[i];

//       const prevAvg = dailyData[prevDate].total / dailyData[prevDate].count;
//       const currAvg = dailyData[currDate].total / dailyData[currDate].count;

//       consumptionByDate[currDate] = prevAvg - currAvg;
//     }

//     // 3. Attach consumption to each record (only for the matching date)
//     const resultWithConsumption = tankStatus.map((entry) => {
//       const date = new Date(entry.status_date).toISOString().split('T')[0];
//       return {
//         ...entry.toJSON(),
//         consumption: consumptionByDate[date] ?? null,
//       };
//     });

//     res.json(resultWithConsumption);
//   } catch (error) {
//     console.error("Error fetching tank status:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.getTankStatusWithConsumption = async (req, res) => {
//   const { start_date, end_date } = req.body;
//   const tank_id = req.params.id;

//   if (!tank_id || !start_date || !end_date) {
//     return res.status(400).json({
//       error: "tank_id, start_date, and end_date are required",
//     });
//   }

//   console.log(start_date, end_date, tank_id); // Debugging line

//   try {
//     // 1. Fetch all relevant data in full range for daily averages
//     const fullData = await WaterTankStatus.findAll({
//       where: {
//         tank_id,
//         status_date: {
//           [Op.between]: [start_date, end_date],
//         },
//       },
//       attributes: ["tank_id", "water_level", "status_date"],
//     });

//     // 2. Group data by date to compute daily averages
//     const dailyAverages = {};
//     fullData.forEach((entry) => {
//       const date = new Date(entry.status_date).toISOString().split("T")[0]; // "YYYY-MM-DD"
//       if (!dailyAverages[date]) {
//         dailyAverages[date] = { total: 0, count: 0 };
//       }
//       dailyAverages[date].total += parseFloat(entry.water_level);
//       dailyAverages[date].count += 1;
//     });

//     // 3. Compute average for each day and track with previous day
//     const sortedDates = Object.keys(dailyAverages).sort();
//     const consumptionByDate = {};

//     for (let i = 1; i < sortedDates.length; i++) {
//       const prev = sortedDates[i - 1];
//       const curr = sortedDates[i];
//       const prevAvg = dailyAverages[prev].total / dailyAverages[prev].count;
//       const currAvg = dailyAverages[curr].total / dailyAverages[curr].count;
//       consumptionByDate[curr] = currAvg - prevAvg; // current - previous
//     }

//     // 4. Fetch all records in requested range (for display + attachment)
//     const tankStatus = await WaterTankStatus.findAll({
//       where: {
//         tank_id,
//         status_date: {
//           [Op.between]: [new Date(start_date), new Date(end_date)],
//         },
//       },
//       attributes: [
//         "tank_id",
//         "water_level",
//         "status",
//         "status_date",
//         "status_time",
//       ],
//       order: [
//         ["status_date", "ASC"],
//         ["status_time", "ASC"],
//       ],
//     });

//     // 5. Attach consumption to each record based on date
//     const resultWithConsumption = tankStatus.map((entry) => {
//       const date = new Date(entry.status_date).toISOString().split("T")[0];
//       return {
//         ...entry.toJSON(),
//         consumption: consumptionByDate[date] ?? null,
//       };
//     });

//     res.json(resultWithConsumption);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.getTankStatusWithConsumption = async (req, res) => {
//   const { start_date, end_date } = req.body;
//   const customer_id = req.params.id;

//   if (!customer_id) {
//     return res.status(400).json({ error: "customer_id is required" });
//   }

//   try {
//     // find tank capacity from tank table based on customer id
//     const tank = await WaterTank.findOne({
//       where: {
//         customer_id: customer_id,
//       },
//       attributes: ["tank_id", "capacity"],
//     });
//     tank_capacity = tank.capacity; // 5000 gallons
//     tank_id = tank.tank_id; // 1
//     if (!tank_capacity) {
//       return res.status(404).json({ error: "Tank not found" });
//     }
//     // Step 1: Fetch last 31 days of water levels, grouped by date
//     const data = await WaterTankStatus.findAll({
//       attributes: [
//         "tank_id",
//         [fn("DATE", col("status_date")), "status_date"],
//         [fn("AVG", col("water_level")), "avg_level"],
//       ],
//       where: {
//         tank_id,
//         status_date: {
//           [Op.gte]: literal("CURRENT_DATE - INTERVAL '31 days'"),
//         },
//         status_date: {
//           [Op.and]: [
//             literal(
//               `DATE("status_date") BETWEEN DATE('${start_date}') AND DATE('${end_date}')`
//             ),
//           ],
//         },
//       },
//       group: [fn("DATE", col("status_date")), "tank_id"],
//       order: [[fn("DATE", col("status_date")), "ASC"]],
//       raw: true,
//     });

//     // Step 2: Convert to daily consumption by comparing with previous day
//     const result = [];

//     for (let i = 1; i < data.length; i++) {
//       const today = data[i];
//       const yesterday = data[i - 1];

//       const todayDate = new Date(today.status_date);
//       const yesterdayDate = new Date(yesterday.status_date);

//       const diffInTime = todayDate.getTime() - yesterdayDate.getTime();
//       const diffInDays = diffInTime / (1000 * 3600 * 24);

//       if (diffInDays === 1) {
//         const todayGallons = (today.avg_level / 100) * tank_capacity;
//         const ydayGallons = (yesterday.avg_level / 100) * tank_capacity;
//         const consumption = Math.abs(ydayGallons - todayGallons);

//         result.push({
//           tank_id: today.tank_id,
//           status_date: today.status_date,
//           avg_level_gallons: +todayGallons.toFixed(2),
//           yday_avg_level_gallons: +ydayGallons.toFixed(2),
//           daily_consumption_gallons: +consumption.toFixed(2),
//         });
//       }
//     }

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error calculating tank consumption:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.getTankStatusWithConsumption = async (req, res) => {
  const { customer_id, start_date, end_date } = req.query;
  console.log(customer_id, start_date, end_date); // Debugging line

  if (!customer_id) {
    return res.status(400).json({ error: "customer_id is required" });
  }

  try {
    // find tank capacity from tank table based on customer id
    const tank = await WaterTank.findOne({
      where: {
        customer_id: customer_id,
      },
      attributes: ["tank_id", "capacity"],
    });
    tank_capacity = tank.capacity; // 5000 gallons
    tank_id = tank.tank_id; // 1
    if (!tank_capacity) {
      return res.status(404).json({ error: "Tank not found" });
    }
    // Step 1: Fetch daily average water level for the last 31 days
    const dailyAvg = await WaterTankStatus.findAll({
      attributes: [
        "tank_id",
        [Sequelize.fn("DATE", Sequelize.col("status_date")), "status_date"],
        [
          Sequelize.literal("ROUND(AVG(water_level) * 5000 / 100.0, 2)"),
          "avg_level_gallons",
        ],
      ],
      where: {
        tank_id: tank_id,
        status_date: {
          [Op.gte]: Sequelize.literal("CURRENT_DATE - INTERVAL '31 days'"),
        },
        status_date: {
          [Op.and]: [
            literal(
              `DATE("status_date") BETWEEN DATE('${start_date}') AND DATE('${end_date}')`
            ),
          ],
        },
      },
      group: ["tank_id", Sequelize.fn("DATE", Sequelize.col("status_date"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("status_date")), "ASC"]],
      raw: true,
    });

    // Step 2: Calculate daily consumption
    const result = [];
    for (let i = 1; i < dailyAvg.length; i++) {
      const prev = dailyAvg[i - 1];
      const current = dailyAvg[i];

      const prevDate = new Date(prev.status_date);
      const currDate = new Date(current.status_date);

      const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        const consumption =
          prev.avg_level_gallons > current.avg_level_gallons
            ? prev.avg_level_gallons - current.avg_level_gallons
            : 0;

        result.push({
          status_date: current.status_date,
          tank_id: current.tank_id,
          avg_level_gallons: Number(current.avg_level_gallons),
          daily_consumption_gallons: Number(consumption.toFixed(2)),
        });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching tank daily consumption:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
