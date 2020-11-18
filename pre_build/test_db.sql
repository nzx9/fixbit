-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 18, 2020 at 05:23 PM
-- Server version: 8.0.22-0ubuntu0.20.04.2
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `pid` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `creator_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `team_id` int DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int NOT NULL,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fullname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `username`, `fullname`, `email`, `password`, `date_created`) VALUES
(4, 'Navindu', 'Dananga', 'navindu@g.com', '$2y$10$5aVf8N7NX68vfuBhw8KN4.uvfySnTR3ZES4B0L.I4mQxS/qo7b13C', '2020-11-01 13:08:57'),
(5, 'Hello', 'World', 'hello23@g.com', '$2y$10$tBA0vDoTTRHEXM9CmPp3deL2Ix2ZrqXLV2o5xrTyYx2nM7gBbtGLK', '2020-11-12 18:00:51'),
(6, 'hello', 'hello', 'hello@g.com', '$2y$10$L.kmnn6p/A0yyJUoWGhtRe8GnsiWN2vk6jeO5v7zr8uwBV08/bMMm', '2020-11-12 18:03:05'),
(7, 'Navindu2', 'Dananga2', 'nav@g.com', '$2y$10$MzUWbs1LOJFEp1rxy.Ae9.CY.cpY4q8abpfUZQ6pjQnvilDaeVQ.C', '2020-11-12 18:04:55'),
(8, 'Navindu', 'Dananga', 'navi@f.com', '$2y$10$YMQanAivOY6SK85kNI6ppuaTMEW.zJ92Umz5uYl3lMvnIT7Yp4hWm', '2020-11-13 06:04:04'),
(9, 'N', 'D', 'nd@g.com', '$2y$10$0knSB7tE5x2I/d3uHwI7Z.Gqy6eCwymoHmiiouAMF9NNcVhYlRL1q', '2020-11-15 03:05:55'),
(10, 'H', 'W', 'hw@g.com', '$2y$10$cTemSOjACj0lPnjhY2fxr.QI25kjZkUveIDymdM0OMZW7q5ywtUuS', '2020-11-15 03:50:59'),
(11, 'H1', 'W1', 'hw@g1.com', '$2y$10$GUe.As5bxlsl5abiG2P8peWoEn/uHa866YTGoBiZLba7SmdEBpZFS', '2020-11-15 03:51:31'),
(12, 'nav', 'Navindu Dananga', 'nav123@g.com', '$2y$10$1LITD2kdX.vllwgkSGCw6OqMY0YsnIfvWuR9PzCpWdGJ1Ikq5rsx6', '2020-11-15 14:16:33'),
(13, 'nav', 'Navindu Dananga', 'nav12@g.com', '$2y$10$ZsfL3H5wsQb/9Zu5tfVFYuigdyCW2vpBdAPr/GCJf8jTV1A2DinGu', '2020-11-15 14:17:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `admin` (`admin_id`),
  ADD KEY `created_by` (`creator_id`),
  ADD KEY `team` (`team_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `pid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`uid`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`uid`) ON DELETE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
