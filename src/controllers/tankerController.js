const { sequelize } = require("../config/database.js");
const Customer = require("../models_v2/customerModel");
const Tanker = require("../models_v2/tankerModel");
const Request = require("../models_v2/requestModel");
const { where } = require("sequelize");

// Create a new tanker
exports.createTanker = async (req, res) => {
  try {
    const { tanker_name, plate_number, capacity, price_per_liter, cost } =
      req.body; // Use plate_number and tanker_model as in model
    const newTanker = await Tanker.create({
      plate_number,
      tanker_name,
      capacity,
      price_per_liter,
      cost,
    });
    res.status(201).json(newTanker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tankers
exports.getAllTankers = async (req, res) => {
  try {
    const tankers = await Tanker.findAll({
      // where: {
      //   availability_status: "Available",
      // },
      // attributes: ["tanker_id", "capacity", "plate_number"]
    });
    // console.log("Tankers: ", tankers);
    res.status(200).json(tankers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailabletankers = async (req, res) => {
  try {
    const tankers = await Tanker.findAll({
      where: {
        availability_status: "Available",
      },
    });
    // console.log("Tankers: ", tankers);
    res.status(200).json(tankers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalTankers = async (req, res) => {
  try {
    const totalTankers = await Tanker.count({});
    res.status(200).json({ total_tankers: totalTankers });
  } catch (error) {
    console.error("Error counting tankers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single tanker by ID
exports.getTankerById = async (req, res) => {
  try {
    const tanker = await Tanker.findByPk(req.params.id);
    if (!tanker) {
      return res.status(404).json({ error: "Tanker not found" });
    }
    res.status(200).json(tanker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a tanker by ID
exports.updateTanker = async (req, res) => {
  const id = req.params.id;
  const {
    plate_number,
    availability,
    tanker_name,
    capacity,
    price_per_liter,
    cost,
  } = req.body;

  try {
    const [updatedCount, updatedRows] = await Tanker.update(
      {
        plate_number,
        availability_status: availability,
        tanker_name,
        capacity,
        price_per_liter,
        cost,
      },
      {
        where: { tanker_id: id },
        returning: true, // IMPORTANT: Returns updated row(s)
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: "Tanker not found" });
    }

    res.status(200).json(updatedRows[0]); // First element (since one tanker)
  } catch (error) {
    console.error(error); // For better debugging
    res.status(500).json({ error: error.message });
  }
};

// Delete a tanker by ID
exports.deleteTanker = async (req, res) => {
  try {
    const deletedCount = await Tanker.destroy({
      where: { tanker_id: req.params.id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Tanker not found" });
    }

    res.status(200).json({ message: "Tanker deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete tanker" });
  }
};

// Requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestTanker = async (req, res) => {
  const { customer_id, requested_liters } = req.body;

  try {
    // Check if customer exists
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res
        .status(400)
        .json({ status: "error", message: "Customer not found" });
    }

    const transaction = await sequelize.transaction();
    try {
      // Create the request
      const newRequest = await Request.create(
        {
          customer_id,
          requested_liters,
        },
        { transaction, returning: true }
      );

      // Commit the transaction
      await transaction.commit();

      // console.log("New Request: ", newRequest);

      // Send success response
      res.status(201).json({
        status: "success",
        request: newRequest,
        // estimated_time: estimatedTime.toISOString(),
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error creating tanker request:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
// exports.requestTanker = async (req, res) => {
//   const { customer_id, tanker_id, requested_liters, payment_mode } = req.body;

//   try {
//     // Check if customer exists
//     const customer = await Customer.findByPk(customer_id);
//     if (!customer) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Customer not found" });
//     }

//     // Check if tanker exists and is available
//     const tanker = await Tanker.findOne({
//       where: {
//         tanker_id,
//         availability_status: "Available",
//       },
//     });
//     if (!tanker) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Tanker not available" });
//     }

//     // Validate requested liters
//     if (requested_liters > tanker.capacity) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Insufficient tanker capacity" });
//     }

//     // Start a transaction
//     console.log(sequelize);
//     const transaction = await sequelize.transaction();
//     try {
//       // Create the request
//       const newRequest = await Request.create(
//         {
//           customer_id,
//           tanker_id,
//           requested_liters,
//           description: `Payment Mode: ${payment_mode}`,
//         },
//         { transaction }
//       );

//       // Update tanker's availability status
//       await Tanker.update(
//         { availability_status: "Unavailable" },
//         { where: { tanker_id }, transaction }
//       );

//       // Commit the transaction
//       await transaction.commit();

//       // Estimate delivery time (e.g., 2 hours from now)
//       const estimatedTime = new Date();
//       estimatedTime.setHours(estimatedTime.getHours() + 2);

//       // Send success response
//       res.status(201).json({
//         status: "success",
//         request_id: newRequest.request_id,
//         estimated_time: estimatedTime.toISOString(),
//       });
//     } catch (error) {
//       // Rollback the transaction in case of error
//       await transaction.rollback();
//       throw error;
//     }
//   } catch (error) {
//     console.error("Error creating tanker request:", error);
//     res.status(500).json({ status: "error", message: "Server error" });
//   }
// };
