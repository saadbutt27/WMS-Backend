const { sequelize } = require("../config/database.js");
const Customer = require("../models_v2/customerModel");
const Tanker = require("../models_v2/tankerModel");
const Driver = require("../models_v2/driverModel");
const TankerPhaseRelation = require("../models_v2/tankerPhaseRelationModel");
const Phase = require("../models_v2/phaseModel");
const Request = require("../models_v2/requestModel");

// Create a new tanker
exports.createTanker = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      tanker_name,
      plate_number,
      capacity,
      price_per_gallon,
      cost,
      assigned_driver_id,
      phase_id,
    } = req.body; // Use plate_number and tanker_model as in model
    // start a transaction
    // Check if the driver exists
    const driver = await Driver.findByPk(assigned_driver_id);

    if (!driver) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ status: "error", message: "Driver not found" });
    }

    if (driver.dataValues.availability_status === "Unavailable") {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Driver is not available",
      });
    }

    // Check if the tanker already exists
    const existingTanker = await Tanker.findOne({
      where: {
        plate_number,
      },
    });
    if (existingTanker) {
      // Rollback transaction if driver not found
      await transaction.rollback();
      // Return error response
      return res
        .status(400)
        .json({ status: "error", message: "Tanker already exists" });
    }

    const newTanker = await Tanker.create(
      {
        plate_number,
        tanker_name,
        capacity,
        price_per_gallon,
        cost,
        assigned_driver_id,
      },
      { transaction, returning: true } // IMPORTANT: Returns the created row(s)
    );

    const tanker_id = newTanker.tanker_id; // Get the generated tanker_id

    // an array of phase ids from frontend will come in the request, make a for loop to make an entry in tanker phase relation table to enter every phase for that tanker
    for (let i = 0; i < phase_id.length; i++) {
      const phase = await Phase.findByPk(phase_id[i]);
      if (!phase) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ status: "error", message: "Phase not found" });
      }
      // Check if the tanker already has this phase
      const existingTankerPhase = await TankerPhaseRelation.findOne({
        where: {
          tanker_id,
          phase_id: phase_id[i],
        },
      });
      if (existingTankerPhase) {
        // Rollback transaction if driver not found
        await transaction.rollback();
        // Return error response
        return res
          .status(400)
          .json({ status: "error", message: "Tanker already has this phase" });
      }
      // Create the relation
      await TankerPhaseRelation.create(
        {
          tanker_id,
          phase_id: phase_id[i],
        },
        { transaction }
      );
    }

    // const newRelation = await TankerPhaseRelation.create(
    //   {
    //     tanker_id,
    //     phase_id,
    //   },

    //   { transaction, returning: true } // IMPORTANT: Returns the created row(s)
    // );

    // Update the driver's availability status
    await Driver.update(
      { availability_status: "Unavailable" },
      { where: { driver_id: assigned_driver_id }, transaction }
    );

    // Commit the transaction
    await transaction.commit();

    // newTanker.phase_id = newRelation.phase_id; // Add phase_id to the tanker object
    res.status(201).json(newTanker);
  } catch (error) {
    console.error(error);
    // Rollback transaction on error
    await transaction.rollback();
    // if (error.name === "SequelizeValidationError") {
    //   // extract each validation message
    //   const messages = error.errors.map((e) => `${e.path}: ${e.message}`);
    //   console.error("Validation errors:", messages);
    //   return res.status(400).json({ errors: messages });
    // }

    // console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create phase tanker relation
// exports.createPhaseTankerRelation = async (req, res) => {
//   const { tanker_id, phase_id } = req.body;
//   try {
//     const newRelation = await TankerPhaseRelation.create({
//       tanker_id,
//       phase_id,
//     });
//     res.status(201).json(newRelation);
//   } catch (error) {
//     console.error("Error creating phase-tanker relation:", error);
//     res.status(500).json({ error: "Failed to create relation" });
//   }
// };

// Get all tankers
exports.getAllTankers = async (req, res) => {
  try {
    const tankers = await Tanker.findAll({
      // where: {
      //   availability_status: "Available",
      // },
      // attributes: ["tanker_id", "tanker_name", "capacity", "plate_number"],
      include: [
        {
          model: Driver,
          attributes: ["driver_id", "full_name"],
        },
        {
          model: TankerPhaseRelation,
          include: [
            {
              model: Phase,
              attributes: ["phase_id", "phase_name"],
            },
          ],
        },
      ],
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

exports.getAvailabletankersPhaseWise = async (req, res) => {
  // get phase id from params
  const phaseId = req.params.id;
  try {
    const tankers = await Tanker.findAll({
      where: {
        availability_status: "Available",
      },
      include: [
        {
          model: TankerPhaseRelation,
          where: {
            phase_id: phaseId,
          },
          attributes: [], // omit attributes from the join table if not needed
        },
      ],
    });

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
    const tanker = await Tanker.findByPk(req.params.id, {
      include: [
        {
          model: Driver,
          attributes: ["driver_id", "full_name"],
        },
        {
          model: TankerPhaseRelation,
          include: [
            {
              model: Phase,
              attributes: ["phase_id", "phase_name"],
            },
          ],
        },
      ],
    });
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
    price_per_gallon,
    cost,
    assigned_driver_id,
  } = req.body;

  try {
    const [updatedCount, updatedRows] = await Tanker.update(
      {
        plate_number,
        availability_status: availability,
        tanker_name,
        capacity,
        price_per_gallon,
        cost,
        assigned_driver_id,
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
  const { customer_id, requested_gallons } = req.body;

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
          requested_gallons,
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
