-- PostgreSQL SQL Dump

https://water-management-system-cse5a6chapgyhpc0.centralindia-01.azurewebsites.net/

-- Database: wms_db

-- Create Tables

-- 1. Create standalone tables first
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    home_address TEXT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sensors (
    sensor_name SERIAL PRIMARY KEY,
    sensor_id VARCHAR(100) NOT NULL,
    sensor_details TEXT,
    manufacturing_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT sensor_status_check CHECK (status IN ('Active', 'Inactive', 'Faulty'))
);

-- CREATE TABLE tankers (
--     tanker_id SERIAL PRIMARY KEY,
--     tanker_name VARCHAR(100) NOT NULL,
--     capacity INT NOT NULL,
--     availability_status VARCHAR(20) DEFAULT 'Available',
--     price_per_liter DECIMAL(10,2) NOT NULL,
--     CONSTRAINT tanker_status_check CHECK (availability_status IN ('Available', 'Unavailable'))
-- );


-- CREATE TABLE drivers (
--     driver_id SERIAL PRIMARY KEY,
--     full_name VARCHAR(100) NOT NULL,
--     phone_number VARCHAR(15) NOT NULL UNIQUE,
--     license_number VARCHAR(50) NOT NULL UNIQUE,
--     availability_status VARCHAR(20) DEFAULT 'Available',
--     assigned_tanker_id INT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT availability_status_check CHECK (availability_status IN ('Available', 'Unavailable')),
--     FOREIGN KEY (assigned_tanker_id) REFERENCES tankers (tanker_id)
-- );

CREATE TABLE drivers (
    driver_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    availability_status VARCHAR(20) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT availability_status_check CHECK (availability_status IN ('Available', 'Unavailable'))
);

CREATE TABLE tankers (
    tanker_id SERIAL PRIMARY KEY,
    tanker_name VARCHAR(100) NOT NULL,
    plate_number VARCHAR(20) NOT NULL UNIQUE, -- Added plate_number attribute
    capacity INT NOT NULL,
    availability_status VARCHAR(20) DEFAULT 'Available',
    price_per_liter DECIMAL(10,2) NOT NULL,
    assigned_driver_id INT UNIQUE, -- Ensures 1:1 relationship
    CONSTRAINT tanker_status_check CHECK (availability_status IN ('Available', 'Unavailable')),
    FOREIGN KEY (assigned_driver_id) REFERENCES drivers (driver_id) ON DELETE SET NULL
);




-- 2. Create dependent tables
CREATE TABLE requests (
    request_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    requested_liters INT NOT NULL,
    request_status VARCHAR(20) DEFAULT 'Pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    CONSTRAINT request_status_check CHECK (request_status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE
);

CREATE TABLE deliveryschedule (
    schedule_id SERIAL PRIMARY KEY,
    request_id INT NOT NULL,
    tanker_id INT NOT NULL,
    driver_id INT NOT NULL,
    scheduled_date DATE NOT NULL,
    delivery_status VARCHAR(20) DEFAULT 'Scheduled',
    CONSTRAINT delivery_status_check CHECK (delivery_status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    FOREIGN KEY (request_id) REFERENCES requests (request_id),
    FOREIGN KEY (tanker_id) REFERENCES tankers (tanker_id),
    FOREIGN KEY (driver_id) REFERENCES drivers (driver_id)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    request_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_status_check CHECK (payment_status IN ('Paid', 'Pending')),
    FOREIGN KEY (request_id) REFERENCES requests (request_id)
);

CREATE TABLE tankerassignments (
    assignment_id SERIAL PRIMARY KEY,
    tanker_id INT NOT NULL,
    driver_id INT NOT NULL,
    assignment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT assignment_status_check CHECK (status IN ('Active', 'Completed')),
    FOREIGN KEY (tanker_id) REFERENCES tankers (tanker_id),
    FOREIGN KEY (driver_id) REFERENCES drivers (driver_id)
);

CREATE TABLE water_tanks (
    tank_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    sensor_id INT NOT NULL,
    capacity INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES sensors (sensor_name) ON DELETE CASCADE
);

CREATE TABLE water_tank_status (
    id SERIAL PRIMARY KEY,
    tank_id INT NOT NULL,
    customer_id INT NOT NULL,
    water_level INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Full',
    status_date DATE NOT NULL,
    status_time TIME NOT NULL,
    CONSTRAINT tank_status_check CHECK (status IN ('Full', 'Low', 'Empty')),
    FOREIGN KEY (tank_id) REFERENCES water_tanks (tank_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE
);