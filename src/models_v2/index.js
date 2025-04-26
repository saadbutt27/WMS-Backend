const WaterTank = require("./waterTankModel");
const WaterTankStatus = require("./waterTankStatusModel");
const Request = require("./requestModel");
const Customer = require("./customerModel");
const Admin = require("./adminModel");
const DeliverySchedule = require("./deliveryScheduleModel");
const Driver = require("./driverModel");
const Payment = require("./paymentModel");
const Sensor = require("./sensorModel");
// const TankerAssignment = require("./tankerAssignmentModel");
const Tanker = require("./tankerModel");
const Bookings = require("./bookingsModel");
const Notification = require("./notificationsModel");
const CustomerNotification = require("./customerNotificationsModel.js");
const Complain = require("./complainModel.js");
const UserTypes = require("./userTypesModel.js");
const Phase = require("./phaseModel.js");
const TankerPhaseRelation = require("./tankerPhaseRelationModel.js");

// Reletionship of water tank table
// with water tank status
WaterTank.hasMany(WaterTankStatus, {
  foreignKey: "tank_id",
});
WaterTankStatus.belongsTo(WaterTank, {
  foreignKey: "tank_id",
});

// Reletionship of request table
// with customer
Customer.hasMany(Request, {
  foreignKey: "customer_id",
});
Request.belongsTo(Customer, {
  foreignKey: "customer_id",
});

// Reletionship of request table
// with admin
Customer.hasMany(WaterTank, {
  foreignKey: "customer_id",
});
WaterTank.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Request.hasMany(DeliverySchedule, {
  foreignKey: "request_id",
});
DeliverySchedule.belongsTo(Request, {
  foreignKey: "request_id",
});

Tanker.hasMany(DeliverySchedule, {
  foreignKey: "tanker_id",
});
DeliverySchedule.belongsTo(Tanker, {
  foreignKey: "tanker_id",
});

Driver.hasMany(DeliverySchedule, {
  foreignKey: "driver_id",
});
DeliverySchedule.belongsTo(Driver, {
  foreignKey: "driver_id",
});

// Reletionship of bookings table
// with admin
Bookings.belongsTo(Admin, {
  foreignKey: "admin_id",
});
Admin.hasMany(Bookings, {
  foreignKey: "admin_id",
});
// with tanker
Bookings.belongsTo(Tanker, {
  foreignKey: "tanker_id",
});
Tanker.hasMany(Bookings, {
  foreignKey: "tanker_id",
});
// with customer
Bookings.belongsTo(Customer, {
  foreignKey: "customer_id",
});
Customer.hasMany(Bookings, {
  foreignKey: "customer_id",
});
// with request
Bookings.belongsTo(Request, {
  foreignKey: "request_id", // Booking table contains request_id
});
Request.hasOne(Bookings, {
  foreignKey: "request_id", // Booking's request_id points to Request
});

// Driver.hasMany(TankerAssignment, {
//     foreignKey: 'driver_id'
// });
// TankerAssignment.belongsTo(Driver, {
//     foreignKey: 'driver_id'
// });

// Tanker.hasMany(Driver, {
//     foreignKey: 'assigned_tanker_id'
// });
// Driver.belongsTo(Tanker, {
//     foreignKey: 'assigned_tanker_id'
// });

Request.hasOne(Payment, {
  foreignKey: "request_id",
});
Payment.belongsTo(Request, {
  foreignKey: "request_id",
});

Sensor.hasOne(WaterTank, {
  foreignKey: "sensor_id",
});
WaterTank.belongsTo(Sensor, {
  foreignKey: "sensor_id",
});

// Tanker.hasMany(TankerAssignment, {
//     foreignKey: 'tanker_id'
// });
// TankerAssignment.belongsTo(Tanker, {
//     foreignKey: 'tanker_id'
// });

// One-to-One Relationship
Driver.hasOne(Tanker, {
  foreignKey: "assigned_driver_id",
  onDelete: "SET NULL",
});
Tanker.belongsTo(Driver, {
  foreignKey: "assigned_driver_id",
});

// Notfication and CustomerNotification relationship
// with admin
Notification.belongsTo(Admin, {
  foreignKey: "admin_id",
});
Admin.hasMany(Notification, {
  foreignKey: "admin_id",
});
// Customer Notifications relationships
// with customer
CustomerNotification.belongsTo(Customer, {
  foreignKey: "customer_id",
});
Customer.hasMany(CustomerNotification, {
  foreignKey: "customer_id",
});
// with notifications
CustomerNotification.belongsTo(Notification, {
  foreignKey: "notification_id",
});
Notification.hasMany(CustomerNotification, {
  foreignKey: "notification_id",
});

//Compalins relationships
// with customer
Complain.belongsTo(Customer, {
  foreignKey: "customer_id",
});
Customer.hasMany(Complain, {
  foreignKey: "customer_id",
});

// with admin
Complain.belongsTo(Admin, {
  foreignKey: "admin_id",
});
Admin.hasMany(Complain, {
  foreignKey: "admin_id",
});

// User types relationships
// with admin
Admin.belongsTo(UserTypes, { foreignKey: "user_type_id" });
UserTypes.hasOne(Admin, { foreignKey: "user_type_id" });
// with customer
Customer.belongsTo(UserTypes, { foreignKey: "user_type_id" });
UserTypes.hasOne(Customer, { foreignKey: "user_type_id" });
// with driver
Driver.belongsTo(UserTypes, { foreignKey: "user_type_id" });
UserTypes.hasOne(Driver, { foreignKey: "user_type_id" });

// Phase relationships
// with customer
Customer.belongsTo(Phase, { foreignKey: "phase_number" });
Phase.hasMany(Customer, { foreignKey: "phase_number" });  

// tankerPhaseRelation relationships
// with phase
TankerPhaseRelation.belongsTo(Phase, { foreignKey: "phase_id" });
Phase.hasMany(TankerPhaseRelation, { foreignKey: "phase_id" });
// with tanker
TankerPhaseRelation.belongsTo(Tanker, { foreignKey: "tanker_id" });
Tanker.hasMany(TankerPhaseRelation, { foreignKey: "tanker_id" });


module.exports = {
  WaterTank,
  WaterTankStatus,
  Request,
  Customer,
  Admin,
  DeliverySchedule,
  Driver,
  Payment,
  Sensor,
  Bookings,
  //   TankerAssignment,
  Tanker,
  Notification,
  CustomerNotification,
  Complain,
  UserTypes,
  Phase,
  TankerPhaseRelation,
};
