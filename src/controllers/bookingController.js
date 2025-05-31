// const Driver = require("../models_v2/driverModel");
// const Request = require("../models_v2/requestModel");
// const Payment = require("../models_v2/paymentModel");
// const Tanker = require("../models_v2/tankerModel");
// const DeliverySchedule = require("../models_v2/deliveryScheduleModel");
// const Customer = require("../models_v2/customerModel");
const {
  Driver,
  Request,
  Payment,
  Tanker,
  DeliverySchedule,
  Customer,
  Bookings,
  Admin,
} = require("../models_v2/index");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");

function generateNumericCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

// Create a new booking request
exports.createBooking = async (req, res) => {
  // start transaction
  const { request_id, requested_gallons, admin_id, tanker_id, customer_id, scheduled_date } =
    req.body;
  const t = await sequelize.transaction();
  try {
    // Update Request request_status to "Accepted"
    await Request.update(
      { request_status: "Accepted" },
      { where: { request_id }, transaction: t }
    );

    // Retrieve assigned driver ID from the tanker
    const tankerData = await Tanker.findOne({
      where: { tanker_id },
      include: [{ model: Driver, attributes: ["driver_id"] }],
      // attributes: ["cost"],
      transaction: t,
    });

    if (!tankerData || !tankerData.Driver) {
      throw new Error("No driver assigned to this tanker");
    }

    const driver_id = tankerData.dataValues.Driver.dataValues.driver_id;
    const price_per_gallon = tankerData.dataValues.price_per_gallon;

    // get balance from customer table to check if the cost can be deducted from balance or not
    const customer = await Customer.findOne({
      where: { customer_id },
      attributes: ["balance"],
      transaction: t,
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    const balance = customer.dataValues.balance;
    if (balance < price_per_gallon * requested_gallons) {
      throw new Error("Insufficient balance");
    }
    // // Update Customer balance
    // const customerUpdate = await Customer.update(
    //   { balance: balance - cost },
    //   {
    //     where: { customer_id },
    //     transaction: t,
    //   }
    // );

    // Insert new delivery schedule entry
    await DeliverySchedule.create(
      {
        request_id: request_id,
        tanker_id: tanker_id,
        driver_id: driver_id,
        scheduled_date: scheduled_date, // You can replace this with the actual date
        delivery_status: "Scheduled", // Assuming enum has a value "Scheduled"
      },
      { transaction: t }
    );

    const newBooking = await Bookings.create(
      {
        admin_id,
        tanker_id,
        customer_id,
        scheduled_date,
        booking_code: generateNumericCode(),
        request_id,
      },
      {
        returning: true,
        transaction: t,
      }
    );
    // commit transaction
    await t.commit();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  const request_id = req.params.id;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if the request exists
    const request = await Request.findByPk(request_id);
    if (!request) {
      await transaction.rollback(); // Rollback transaction if request doesn't exist

      return res.status(404).json({ error: "Request not found." });
    }

    // Update request status to "Rejected"
    const [updatedRows, updatedRequest] = await Request.update(
      { request_status: "Rejected" },
      {
        where: { request_id },
        transaction,
        returning: true, // Ensure returning
        attributes: ["request_id", "request_status"],
      }
    );
    // Check if any rows were updated
    if (updatedRows === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "Request not updated." });
    }
    // console.log("Request updated successfully:", updatedRows, updatedRequest);

    // Commit the transaction
    await transaction.commit();

    res
      .status(200)
      .json({ status: "success", message: "Request rejected successfully." });
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to reject the request." });
  }
};

// Get all booking requests
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Bookings.findAll({
      attributes: [
        "booking_id",
        "request_id",
        "scheduled_date",
        "status",
        "booking_code",
      ],

      include: [
        {
          model: Admin,
          attributes: ["admin_id", "full_name"], // Fetch admin name
        },
        {
          model: Customer,
          attributes: ["customer_id", "full_name"], // Fetch customer name
        },
        {
          model: Tanker,
          attributes: ["tanker_id", "tanker_name"], // Fetch customer name
        },
      ],
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Bookings.findByPk(req.params.id, {
      attributes: [
        "booking_id",
        "request_id",
        "scheduled_date",
        "status",
        "booking_code",
      ],
      include: [
        {
          model: Admin,
          attributes: ["admin_id", "full_name"], // Fetch admin name
        },
        {
          model: Customer,
          attributes: ["customer_id", "full_name"], // Fetch customer name
        },
        {
          model: Tanker,
          attributes: ["tanker_id", "tanker_name"], // Fetch customer name
        },
      ],
    });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingForCustomer = async (req, res) => {
  try {
    const bookings = await Bookings.findAll({
      where: { customer_id: req.params.id },
      attributes: ["scheduled_date", "booking_code", "status"],
      include: [
        {
          model: Request,
          as: "Request",
          attributes: [
            "request_id",
            "requested_gallons",
            "request_status",
            "request_date",
          ],
        },
      ],
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a booking request
exports.updateBooking = async (req, res) => {
  try {
    const { admin_id, tanker_id, customer_id, scheduled_date } = req.body;
    // const booking = await Booking.findByPk(req.params.id);
    // if (!booking) {
    //   return res.status(404).json({ error: "Booking not found" });
    // }
    const updatedBooking = await Bookings.update(
      {
        admin_id,
        tanker_id,
        customer_id,
        scheduled_date,
      },
      {
        where: { booking_id: req.params.id },
        returning: true,
      }
    );
    res.status(200).json(updatedBooking[1][0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a booking request
exports.deleteBooking = async (req, res) => {
  try {
    // const booking = await Booking.findByPk(req.params.id);
    // if (!booking) {
    //   return res.status(404).json({ error: "Booking not found" });
    // }
    await Bookings.destroy({
      where: { booking_id: req.params.id },
    });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all driver for testing database
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      attributes: ["full_name", "phone_number", "license_number"],
    });
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving drivers." });
  }
};

exports.approveRequest = async (req, res) => {
  const { tanker_id, request_id, customer_id, schedule_date } = req.body;

  if (!tanker_id || !request_id || !schedule_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await Tanker.sequelize.transaction(async (t) => {
      // Update Tanker availability_status to "Unavailable"
      const tanker = await Tanker.update(
        { availability_status: "Unavailable" },
        { where: { tanker_id }, transaction: t }
      );

      if (tanker[0] === 0) {
        throw new Error("Tanker not found or already unavailable");
      }

      // Update Request request_status to "In Progress"
      const request = await Request.update(
        { request_status: "In Progress" },
        { where: { request_id }, transaction: t }
      );

      // Retrieve assigned driver ID from the tanker
      const tankerData = await Tanker.findOne({
        where: { tanker_id },
        include: [{ model: Driver, attributes: ["driver_id"] }],
        attributes: ["cost"],
        transaction: t,
      });

      if (!tankerData || !tankerData.Driver) {
        throw new Error("No driver assigned to this tanker");
      }

      const driver_id = tankerData.dataValues.Driver.dataValues.driver_id;
      const cost = tankerData.dataValues.cost;

      // get balance from customer table to check if the cost can be deducted from balance or not
      const customer = await Customer.findOne({
        where: { customer_id },
        attributes: ["balance"],
        transaction: t,
      });
      if (!customer) {
        throw new Error("Customer not found");
      }
      const balance = customer.dataValues.balance;
      if (balance < cost) {
        throw new Error("Insufficient balance");
      }
      // Update Request request_status to "Completed"
      // const requestUpdate = await Request.update(
      //   { request_status: "Completed" },
      //   { where: { request_id }, transaction: t }
      // );
      // // Update Tanker availability_status to "Available"
      // const tankerUpdate = await Tanker.update(
      //   { availability_status: "Available" },
      //   { where: { tanker_id }, transaction: t }
      // );
      // // Update Driver assigned_driver_status to "Available"
      // const driverUpdate = await Driver.update(
      //   { assigned_driver_status: "Available" },
      //   { where: { driver_id }, transaction: t }
      // );
      // Update Customer balance
      const customerUpdate = await Customer.update(
        { balance: balance - cost },
        {
          where: { customer_id },
          transaction: t,
        }
      );

      // Insert new delivery schedule entry
      await DeliverySchedule.create(
        {
          request_id: request_id,
          tanker_id: tanker_id,
          driver_id: driver_id,
          scheduled_date: schedule_date, // You can replace this with the actual date
          delivery_status: "Scheduled", // Assuming enum has a value "Scheduled"
        },
        { transaction: t }
      );
    });

    res.status(200).json({ message: "Tanker scheduled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

exports.getBookingReport = async (req, res) => {
  const { customer_id, start_date, end_date } = req.query;
  // Validate the query parameters
  if (!customer_id) {
    return res.status(400).json({ error: "customer_id is required" });
  }
  // Validate the date range
  if (!start_date || !end_date) {
    return res
      .status(400)
      .json({ error: "startDate and endDate are required" });
  }
  try {
    const bookings = await Bookings.findAll({
      where: {
        scheduled_date: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
        customer_id: customer_id,
      },
      attributes: ["scheduled_date"],
      include: [
        {
          model: Request,
          as: "Request",
          attributes: ["requested_liters", "request_date"],
        },
        {
          model: Tanker,
          as: "Tanker",
          attributes: ["tanker_id", "tanker_name", "cost"],
        },
      ],
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving bookings" });
  }
};

// Create a new booking request
// exports.createBooking = async (req, res) => {
//   try {
//     const { order_ID, username, booking_date, pickup_location, status } =
//       req.body;
//     const newBooking = await Booking.create({
//       order_ID,
//       username,
//       booking_date,
//       pickup_location,
//       status,
//     });
//     res.status(201).json(newBooking);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all booking requests
// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.findAll();
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get a single booking by order ID
// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findByPk(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update a booking by order ID
// exports.updateBooking = async (req, res) => {
//   try {
//     const { order_ID, username, booking_date, pickup_location, status } =
//       req.body;
//     const booking = await Booking.findByPk(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }
//     await booking.update({
//       order_ID,
//       username,
//       booking_date,
//       pickup_location,
//       status,
//     });
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete a booking by order ID
// exports.deleteBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByPk(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }
//     await booking.destroy();
//     res.status(200).json({ message: "Booking deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.previousBookings = async (req, res) => {
  const { customer_id } = req.query;

  if (!customer_id) {
    return res.status(400).json({ error: "customer_id is required" });
  }

  try {
    const orders = await Request.findAll({
      where: {
        customer_id,
      },
      attributes: [
        "request_id",
        "requested_gallons",
        "request_status",
        "request_date",
      ],
      include: [
        {
          model: Bookings,
          // as: "Bookings",
          attributes: ["scheduled_date", "booking_code", "status"],
        },
        {
          model: Payment,
          as: "Payment",
          attributes: ["amount_paid", "payment_status"],
        },
        {
          model: DeliverySchedule,
          as: "DeliverySchedules",
          attributes: ["schedule_id", "delivery_status"],
          include: [
            {
              model: Tanker,
              as: "Tanker",
              attributes: ["tanker_id", "tanker_name", "capacity"],
            },
          ],
        },
      ],
    });

    // Check if any orders were found
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ error: "No orders found for the given customer_id" });
    }

    // Return orders as JSON response
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving orders" });
  }
};

exports.requestStatus = async (req, res) => {
  const { customer_id } = req.query;

  // Validate the query parameter
  if (!customer_id) {
    return res.status(400).json({ error: "customer_id is required" });
  }

  try {
    // Fetch data from the database
    const requests = await Request.findAll({
      where: { customer_id },
      attributes: [
        "request_id",
        "requested_gallons",
        "request_status",
        "request_date",
      ],
      include: [
        {
          model: Payment,
          as: "Payment",
          attributes: ["amount_paid", "payment_status"],
        },
        {
          model: DeliverySchedule,
          as: "DeliverySchedules",
          attributes: ["scheduled_date", "delivery_status"],
        },
      ],
      order: [["request_date", "DESC"]], // Sort by request_date in descending order
    });

    // If no requests are found
    if (!requests || requests.length === 0) {
      return res
        .status(404)
        .json({ message: "No requests found for the given customer_id" });
    }

    // Format and return the response
    // res.status(200).json(
    //   requests.map(request => ({
    //     request_id: request.request_id,
    //     requested_liters: request.requested_liters,
    //     request_status: request.request_status,
    //     request_date: request.request_date,
    //     amount_paid: request.Payment?.amount_paid || null,
    //     payment_status: request.Payment?.payment_status || null,
    //     delivery_details: request.DeliverySchedules.map(schedule => ({
    //       scheduled_date: schedule.scheduled_date,
    //       delivery_status: schedule.delivery_status,
    //     })),
    //   }))
    // );

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching request status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching request status" });
  }
};

exports.cancelRequest = async (req, res) => {
  const { request_id } = req.params;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if the request exists
    const request = await Request.findByPk(request_id);
    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }

    // // Delete related rows from DeliverySchedule
    // await DeliverySchedule.destroy({
    //   where: { request_id },
    //   transaction,
    // });

    // // Delete related row from Payment
    // await Payment.destroy({
    //   where: { request_id },
    //   transaction,
    // });

    // Delete the request itself
    await Request.update(
      { request_status: "Rejected" },
      { where: { request_id }, transaction }
    );

    // Commit the transaction
    await transaction.commit();

    res
      .status(200)
      .json({ status: "success", message: "Request rejected successfully." });
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to reject the request." });
  }
};

exports.getAllBills = async (req, res) => {
  const { customer_id } = req.query;

  if (!customer_id) {
    return res.status(400).json({ error: "customer_id is required" });
  }

  try {
    const allBills = await Customer.findAll({
      where: {
        customer_id,
      },
      attributes: [
        "full_name",
        "email",
        "phone_number",
        "home_address",
        "username",
      ],
      include: [
        {
          model: Request,
          as: "Requests",
          attributes: [
            "requested_liters",
            "request_status",
            "request_date",
            "description",
          ],
          include: [
            {
              model: Payment,
              as: "Payment",
              attributes: ["amount_paid", "payment_status", "payment_date"],
            },
          ],
        },
      ],
    });

    // Check if any orders were found
    if (allBills.length === 0) {
      return res
        .status(404)
        .json({ error: "No Bils found for the given customer_id" });
    }

    // Return orders as JSON response
    res.json(allBills);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving orders" });
  }
};
