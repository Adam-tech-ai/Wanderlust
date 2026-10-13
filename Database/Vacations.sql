-- Wanderlust database export.
-- Includes the current users, vacations and likes.
-- GTID and binary logging settings are omitted for portability.

-- Create and select the project database:
CREATE DATABASE IF NOT EXISTS `vacations`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE `vacations`;

-- Preserve session settings:
SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION;
SET @OLD_TIME_ZONE = @@TIME_ZONE;
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET @OLD_SQL_MODE = @@SQL_MODE;
SET @OLD_SQL_NOTES = @@SQL_NOTES;

-- Configure the import session:
SET NAMES utf8mb4;
SET TIME_ZONE = '+00:00';
SET UNIQUE_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET SQL_NOTES = 0;

-- Remove existing project tables before restoring the export:
DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `vacations`;

-- Create users:
CREATE TABLE `users` (
    `userId` int NOT NULL AUTO_INCREMENT,
    `firstName` varchar(50) NOT NULL,
    `lastName` varchar(50) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` varchar(20) NOT NULL,
    PRIMARY KEY (`userId`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- Restore current users with their existing password hashes:
INSERT INTO `users` (
    `userId`,
    `firstName`,
    `lastName`,
    `email`,
    `password`,
    `role`
) VALUES
(
    1,
    'Adam',
    'Schwarcz',
    'adam@test.com',
    '466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683',
    'user'
),
(
    2,
    'Admin',
    'User',
    'admin@test.com',
    '466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683',
    'admin'
),
(
    4,
    'test',
    'user',
    'test.audit@example.com',
    '466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683',
    'user'
);

-- Create vacations:
CREATE TABLE `vacations` (
    `vacationId` int NOT NULL AUTO_INCREMENT,
    `destination` varchar(100) NOT NULL,
    `description` text NOT NULL,
    `startDate` date NOT NULL,
    `endDate` date NOT NULL,
    `price` decimal(10,2) NOT NULL,
    `imageName` varchar(255) NOT NULL,
    PRIMARY KEY (`vacationId`)
) ENGINE=InnoDB AUTO_INCREMENT=21
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- Restore all 13 current vacations:
INSERT INTO `vacations` (
    `vacationId`,
    `destination`,
    `description`,
    `startDate`,
    `endDate`,
    `price`,
    `imageName`
) VALUES
(
    1,
    'Paris',
    'A romantic vacation in Paris with museums, cafes and famous landmarks.\r\nAwesome for couples.',
    '2026-08-07',
    '2026-08-14',
    1800.00,
    '5572218b-e5cb-4393-9dcd-17781bfd01e9.jpg'
),
(
    2,
    'Rome',
    'Explore ancient Rome, Italian cuisine and historic attractions.',
    '2026-08-20',
    '2026-08-27',
    1600.00,
    'rome.jpg'
),
(
    3,
    'Barcelona',
    'Enjoy beaches, architecture and the vibrant atmosphere of Barcelona.',
    '2026-09-05',
    '2026-09-15',
    1500.00,
    'barcelona.jpg'
),
(
    4,
    'Athens',
    'Discover ancient Greek history, local food and Mediterranean views.',
    '2026-09-10',
    '2026-09-20',
    1300.00,
    'athens.jpg'
),
(
    5,
    'London',
    'Visit London landmarks, museums, markets and traditional neighborhoods.',
    '2026-09-25',
    '2026-10-02',
    1900.00,
    'london.jpg'
),
(
    6,
    'Amsterdam',
    'Experience the canals, museums and unique streets of Amsterdam.',
    '2026-10-05',
    '2026-10-12',
    1700.00,
    'amsterdam.jpg'
),
(
    7,
    'Prague',
    'Explore Prague old town, castles and historic architecture.',
    '2026-10-20',
    '2026-10-27',
    1200.00,
    'prague.jpg'
),
(
    8,
    'Vienna',
    'Enjoy classical culture, palaces and traditional Austrian cuisine.',
    '2026-11-01',
    '2026-11-08',
    1450.00,
    'vienna.jpg'
),
(
    9,
    'Tokyo',
    'Experience modern Tokyo, Japanese culture, food and famous districts.',
    '2026-11-15',
    '2026-11-25',
    3200.00,
    'tokyo.jpg'
),
(
    10,
    'New York',
    'Discover Manhattan, Central Park, museums and iconic city attractions.',
    '2026-12-01',
    '2026-12-10',
    2800.00,
    'new-york.jpg'
),
(
    11,
    'Dubai',
    'Enjoy modern Dubai, desert experiences, shopping and luxury attractions.',
    '2027-01-10',
    '2027-01-17',
    2400.00,
    'dubai.jpg'
),
(
    12,
    'Maldives',
    'Relax on tropical beaches with clear water and island resorts.',
    '2027-02-01',
    '2027-02-08',
    3500.00,
    'maldives.jpg'
),
(
    17,
    'Manaus',
    'Awesome city, the capital of the State of Amazonas in Brazil.',
    '2026-10-14',
    '2026-10-20',
    2900.00,
    'adf81010-d23e-4db5-bf82-367a16dd3bd4.jpg'
);

-- Create likes after the referenced tables:
CREATE TABLE `likes` (
    `userId` int NOT NULL,
    `vacationId` int NOT NULL,
    PRIMARY KEY (`userId`, `vacationId`),
    KEY `vacationId` (`vacationId`),
    CONSTRAINT `likes_ibfk_1`
        FOREIGN KEY (`userId`)
        REFERENCES `users` (`userId`),
    CONSTRAINT `likes_ibfk_2`
        FOREIGN KEY (`vacationId`)
        REFERENCES `vacations` (`vacationId`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- Restore current likes:
INSERT INTO `likes` (`userId`, `vacationId`) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5);

-- Restore the original session settings:
SET TIME_ZONE = @OLD_TIME_ZONE;
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;
SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION;
SET SQL_NOTES = @OLD_SQL_NOTES;

-- Export source: local vacations database, 2026-10-13.