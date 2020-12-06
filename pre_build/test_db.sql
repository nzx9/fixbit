-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 06, 2020 at 07:02 PM
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
  `isPublic` tinyint(1) NOT NULL DEFAULT '1',
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`pid`, `name`, `description`, `creator_id`, `admin_id`, `team_id`, `isPublic`, `date_created`) VALUES
(21, 'test project 21', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-11-24 06:37:01'),
(22, 'test project 22', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-11-24 13:21:28'),
(23, 'test project 23', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-11-24 13:34:43'),
(24, 'test project 24', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-03 17:10:17'),
(25, 'test project 25', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-03 17:10:25'),
(26, 'test project 26', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-03 17:10:46'),
(27, 'test project 27', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:13:03'),
(29, 'test project 28', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:15:03'),
(34, 'test project 30', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:31:19'),
(35, 'test project 31', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:32:43'),
(41, 'test project 34', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:36:53'),
(42, 'test project 42', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:37:22'),
(44, 'test project 43', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:38:32'),
(45, 'test project 44', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:38:55'),
(46, 'test project 45', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:41:16'),
(47, 'test project 47', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:41:46'),
(48, 'test project 48', 'this is test project added using postman by Navindu', 4, 4, NULL, 1, '2020-12-05 05:50:08'),
(49, 'test project 49', 'this is test project added using postman by Navindu', 4, 4, NULL, 0, '2020-12-05 05:50:52');

-- --------------------------------------------------------

--
-- Table structure for table `project_21`
--

CREATE TABLE `project_21` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_21`
--

INSERT INTO `project_21` (`iid`, `title`, `description`, `attachments`, `createdBy`, `assignedTo`, `priority`, `type`, `isOpen`, `date_created`, `comments`) VALUES
(1, 'issue 1', 'this is a description', NULL, 4, NULL, 1, 1, 2, '2020-11-24 06:37:28', NULL),
(2, 'issue 1', 'this is a description', NULL, 4, NULL, 1, 1, 2, '2020-11-24 06:38:06', NULL),
(3, 'issue 1', 'this is a description', NULL, 4, NULL, 1, 1, 2, '2020-11-24 06:38:10', NULL),
(4, 'issue 1', 'this is a description', NULL, 4, NULL, 1, 1, 2, '2020-11-24 06:40:05', NULL),
(5, 'issue 2', 'this is a description', NULL, 4, NULL, 2, 3, 2, '2020-11-25 12:25:04', NULL),
(6, 'issue 3', 'this is a description', NULL, 4, NULL, 3, 3, 2, '2020-11-25 14:27:58', NULL),
(7, 'issue 4', 'this is a description', NULL, 4, NULL, 4, 3, 2, '2020-11-25 14:28:09', NULL),
(8, 'issue 5', 'this is a description', NULL, 4, NULL, 5, 3, 2, '2020-11-25 14:28:16', NULL),
(9, 'dasdasd', 'sadas', NULL, 4, NULL, 3, 1, 2, '2020-11-25 16:45:44', NULL),
(10, 'test', 'test', NULL, 4, NULL, 3, 4, 1, '2020-11-25 16:46:42', NULL),
(11, 'Test 1', 'test 1231', NULL, 4, NULL, 5, 4, 1, '2020-11-25 16:48:04', NULL),
(12, 'Hello World', 'Closed ONE ASSIGNED TO NAVINDU', NULL, 4, NULL, 5, 3, 1, '2020-11-25 16:50:20', NULL),
(13, 'Hello 2', 'adasdasd', NULL, 4, NULL, 3, 1, 2, '2020-11-25 16:53:03', NULL),
(14, 'NAvindu', 'NAvindu', NULL, 4, NULL, 3, 1, 2, '2020-11-25 16:54:38', NULL),
(15, 'dasdasd', 'dsad', NULL, 4, NULL, 3, 1, 2, '2020-11-25 16:55:53', NULL),
(16, 'Navindu', '1232', NULL, 4, 4, 3, 1, 2, '2020-11-25 16:59:17', NULL),
(17, 'jnknk', 'jnjkk', NULL, 4, 4, 1, 4, 2, '2020-11-25 18:15:59', NULL),
(18, 'nkjnnkn', 'asndkasnd', NULL, 4, 4, 1, 4, 2, '2020-11-25 18:16:12', NULL),
(19, 'Navindu', 'Hello World', NULL, 16, 4, 5, 4, 1, '2020-11-28 07:39:00', NULL),
(20, 'idhkahuadh kudas', 'u kqduhas kdh k dhkashdas', NULL, 16, 1, 3, 1, 2, '2020-11-30 02:33:20', NULL),
(21, 'jdashkdjhaskdhk', 'hdjkashdkjh skajdh k', NULL, 16, 4, 2, 1, 2, '2020-11-30 02:34:46', NULL),
(22, 'Navind', 'KLNasn ldnaldnland anl dad akdjlaljdkj alsd adks jdkasj dkasjd kasd akdjka j dkasjd jaksd lsdjak jdklas kdasjkdjas djaksdj ka skjda sjdasjdajsldj aldjlasdjlas jkjs ajdaksd kadlajdj asjdlasjdlajsd jaldalsjdlasjdkasdjasjdasjdjlasjdlaj  dkajldjasldjak  adj sdjalsdjlad  adsj ljdlasdljad  adj sjdkaslajd ka ajdl asjdkalda  aldj lasjd kajldj jakd jasdj asjdj  ads jdlasjl dj aldla jskasdjajsdkasj  k asjd sajajsldj lsjdasjlkdj aksj djasldj asjda ad ldjsa djl', NULL, 16, 1, 2, 2, 2, '2020-12-01 17:05:25', NULL),
(23, 'krypto', 'jndkasjn daada', NULL, 4, 1, 2, 1, 2, '2020-12-02 13:50:13', NULL),
(24, 'sadas', 'asda', NULL, 4, 1, 3, 1, 2, '2020-12-02 13:52:17', NULL),
(25, 'HERO', '123', NULL, 4, 1, 4, 1, 2, '2020-12-02 14:07:42', NULL),
(26, 'kight', 'ads ds', NULL, 4, 4, 3, 1, 2, '2020-12-02 14:16:34', NULL),
(27, 'kngiht', '12312c3 ', NULL, 4, 1, 3, 1, 2, '2020-12-02 14:17:00', NULL),
(28, 'knightt 2', 'ajdh sjjdlkas', NULL, 4, 1, 3, 1, 2, '2020-12-02 14:17:50', NULL),
(29, 'ajkdhs jdajsk hdkjhsk', 'dj sjad lsjdkja lsjd', NULL, 4, 1, 3, 1, 2, '2020-12-02 14:18:01', NULL),
(30, 'Hello world', 'lad slka dksalka sda', NULL, 4, 4, 2, 1, 2, '2020-12-02 14:18:21', NULL),
(31, 'sjnladk ks dlasjdaks dk', 'akljd dkja sdkja lsdjlak sjldja d', NULL, 4, 4, 2, 1, 2, '2020-12-02 14:26:21', NULL),
(32, 'NDLANSn dask', 'sdlks kans', NULL, 4, 1, 5, 1, 2, '2020-12-02 14:30:36', NULL),
(33, 'klasd sndl asdnkas', 'adl sndlka snldasnl d', NULL, 4, 1, 5, 1, 2, '2020-12-02 14:31:51', NULL),
(34, 'Helo2', 'dansl dnaksnd ', NULL, 4, 1, 4, 1, 2, '2020-12-02 14:36:03', NULL),
(35, 'Helo 32', 'iodja djosj', NULL, 4, 1, 4, 1, 2, '2020-12-02 14:36:30', NULL),
(36, 'HElooda sd', 'da sda sd', NULL, 4, 1, 4, 1, 2, '2020-12-02 14:37:45', NULL),
(37, 'HEllo', 'Im closed', NULL, 4, 1, 3, 1, 1, '2020-12-02 15:09:50', NULL),
(38, 'CAN\'T LOGIN', 'I can\'t login', NULL, 4, 4, 3, 1, 2, '2020-12-02 16:28:23', NULL),
(39, '123', '123', NULL, 4, 4, 3, 1, 1, '2020-12-02 17:08:48', NULL),
(40, '1234', '1234', NULL, 4, 4, 2, 2, 1, '2020-12-02 17:09:16', NULL),
(41, '1234567890', 'hello world', NULL, 4, 1, 3, 1, 1, '2020-12-02 18:18:18', NULL),
(42, 'Register issue', 'Can\'t Register', NULL, 4, 1, 4, 2, 2, '2020-12-03 05:16:13', NULL),
(43, 'dkls kas damskd als', 'cklx ldalsd lsakmdlas', NULL, 4, -1, 3, 1, 2, '2020-12-03 15:18:47', NULL),
(44, 'Hdhdjjsjdnd', 'Hshdjjdjdbd', NULL, 4, 1, 3, 1, 2, '2020-12-03 17:34:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_22`
--

CREATE TABLE `project_22` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_22`
--

INSERT INTO `project_22` (`iid`, `title`, `description`, `attachments`, `createdBy`, `assignedTo`, `priority`, `type`, `isOpen`, `date_created`, `comments`) VALUES
(1, 'Hello', 'ads dasdasda ', NULL, 4, 4, 2, 1, 2, '2020-12-03 14:15:47', NULL),
(2, 'hello', 'adsjnd jasndkas', NULL, 4, 1, 3, 1, 2, '2020-12-03 15:12:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_23`
--

CREATE TABLE `project_23` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_23`
--

INSERT INTO `project_23` (`iid`, `title`, `description`, `attachments`, `createdBy`, `assignedTo`, `priority`, `type`, `isOpen`, `date_created`, `comments`) VALUES
(1, 'Issue', 'das das das dasdadas', NULL, 4, 4, 3, 1, 2, '2020-12-03 14:18:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_24`
--

CREATE TABLE `project_24` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_25`
--

CREATE TABLE `project_25` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_25`
--

INSERT INTO `project_25` (`iid`, `title`, `description`, `attachments`, `createdBy`, `assignedTo`, `priority`, `type`, `isOpen`, `date_created`, `comments`) VALUES
(1, 'Issue 1', 'Hdhjd jwhus sjsjhs', NULL, 4, -1, 3, 3, 2, '2020-12-03 17:12:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_26`
--

CREATE TABLE `project_26` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_26`
--

INSERT INTO `project_26` (`iid`, `title`, `description`, `attachments`, `createdBy`, `assignedTo`, `priority`, `type`, `isOpen`, `date_created`, `comments`) VALUES
(1, 'First Issue', 'OK', NULL, 16, 1, 3, 1, 2, '2020-12-04 04:19:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_27`
--

CREATE TABLE `project_27` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_29`
--

CREATE TABLE `project_29` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_41`
--

CREATE TABLE `project_41` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_42`
--

CREATE TABLE `project_42` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_44`
--

CREATE TABLE `project_44` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_45`
--

CREATE TABLE `project_45` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_46`
--

CREATE TABLE `project_46` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_47`
--

CREATE TABLE `project_47` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_48`
--

CREATE TABLE `project_48` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_49`
--

CREATE TABLE `project_49` (
  `iid` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `attachments` json DEFAULT NULL,
  `createdBy` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `priority` tinyint NOT NULL,
  `type` tinyint NOT NULL,
  `isOpen` tinyint NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_users_search_table`
--

CREATE TABLE `project_users_search_table` (
  `pu_search_id` int NOT NULL,
  `pid` int NOT NULL,
  `uid` int NOT NULL,
  `data_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_users_search_table`
--

INSERT INTO `project_users_search_table` (`pu_search_id`, `pid`, `uid`, `data_added`, `isAdmin`, `isPublic`) VALUES
(1, 29, 4, '2020-12-05 05:15:03', 1, 1),
(2, 41, 4, '2020-12-05 05:36:53', 1, 1),
(3, 42, 4, '2020-12-05 05:37:22', 1, 1),
(4, 44, 4, '2020-12-05 05:38:32', 0, 1),
(5, 45, 4, '2020-12-05 05:38:55', 0, 0),
(6, 46, 4, '2020-12-05 05:41:16', 1, 0),
(7, 47, 4, '2020-12-05 05:41:46', 1, 1),
(8, 48, 4, '2020-12-05 05:50:08', 1, 1),
(9, 49, 4, '2020-12-05 05:50:52', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `tid` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `members` json DEFAULT NULL,
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
(4, 'Navindu Dananga', 'Dananga', 'navindu@g.com', '$2y$10$lEfMexAnTFJ7JwenutpYEOPcCprEFh.3AvR6H7iDRmgTcnNpuZJ3W', '2020-11-01 13:08:57'),
(5, 'Hello', 'World', 'hello23@g.com', '$2y$10$tBA0vDoTTRHEXM9CmPp3deL2Ix2ZrqXLV2o5xrTyYx2nM7gBbtGLK', '2020-11-12 18:00:51'),
(6, 'hello', 'hello', 'hello@g.com', '$2y$10$L.kmnn6p/A0yyJUoWGhtRe8GnsiWN2vk6jeO5v7zr8uwBV08/bMMm', '2020-11-12 18:03:05'),
(7, 'Navindu2', 'Dananga2', 'nav@g.com', '$2y$10$MzUWbs1LOJFEp1rxy.Ae9.CY.cpY4q8abpfUZQ6pjQnvilDaeVQ.C', '2020-11-12 18:04:55'),
(8, 'Navindu', 'Dananga', 'navi@f.com', '$2y$10$YMQanAivOY6SK85kNI6ppuaTMEW.zJ92Umz5uYl3lMvnIT7Yp4hWm', '2020-11-13 06:04:04'),
(9, 'N', 'D', 'nd@g.com', '$2y$10$0knSB7tE5x2I/d3uHwI7Z.Gqy6eCwymoHmiiouAMF9NNcVhYlRL1q', '2020-11-15 03:05:55'),
(10, 'H', 'W', 'hw@g.com', '$2y$10$cTemSOjACj0lPnjhY2fxr.QI25kjZkUveIDymdM0OMZW7q5ywtUuS', '2020-11-15 03:50:59'),
(11, 'H1', 'W1', 'hw@g1.com', '$2y$10$GUe.As5bxlsl5abiG2P8peWoEn/uHa866YTGoBiZLba7SmdEBpZFS', '2020-11-15 03:51:31'),
(12, 'nav', 'Navindu Dananga', 'nav123@g.com', '$2y$10$1LITD2kdX.vllwgkSGCw6OqMY0YsnIfvWuR9PzCpWdGJ1Ikq5rsx6', '2020-11-15 14:16:33'),
(13, 'nav', 'Navindu Dananga', 'nav12@g.com', '$2y$10$ZsfL3H5wsQb/9Zu5tfVFYuigdyCW2vpBdAPr/GCJf8jTV1A2DinGu', '2020-11-15 14:17:18'),
(14, 'Navindu2', 'Navindu Dananga', 'navindu@gmail.com', '$2y$10$/F3sbLCdKMfcd9yVbT/nf.th0ZXpcsqv24wMg.NeCFTJFItf/7KoG', '2020-11-19 05:58:54'),
(15, 'malshi', 'Malshika Eranjali', 'malshikaw@sltc.edu.lk', '$2y$10$UQd9X62S8ZtrZXhIeKy2w.D4MpNEveRBGRP4XuY7EgD7IS826hpjG', '2020-11-19 14:32:07'),
(16, 'Root', 'Root Toor', 'root@g.com', '$2y$10$SS/cLc2LBxLT6X4tzK0hnuykySFqnf.oZ5h/Ony2Gje1R6z0NssPC', '2020-11-25 12:50:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`pid`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD KEY `admin` (`admin_id`),
  ADD KEY `created_by` (`creator_id`),
  ADD KEY `team` (`team_id`);

--
-- Indexes for table `project_21`
--
ALTER TABLE `project_21`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_22`
--
ALTER TABLE `project_22`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_23`
--
ALTER TABLE `project_23`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_24`
--
ALTER TABLE `project_24`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_25`
--
ALTER TABLE `project_25`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_26`
--
ALTER TABLE `project_26`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_27`
--
ALTER TABLE `project_27`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_29`
--
ALTER TABLE `project_29`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_41`
--
ALTER TABLE `project_41`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_42`
--
ALTER TABLE `project_42`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_44`
--
ALTER TABLE `project_44`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_45`
--
ALTER TABLE `project_45`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_46`
--
ALTER TABLE `project_46`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_47`
--
ALTER TABLE `project_47`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_48`
--
ALTER TABLE `project_48`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_49`
--
ALTER TABLE `project_49`
  ADD PRIMARY KEY (`iid`);

--
-- Indexes for table `project_users_search_table`
--
ALTER TABLE `project_users_search_table`
  ADD PRIMARY KEY (`pu_search_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`tid`),
  ADD UNIQUE KEY `name` (`name`);

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
  MODIFY `pid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `project_21`
--
ALTER TABLE `project_21`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `project_22`
--
ALTER TABLE `project_22`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `project_23`
--
ALTER TABLE `project_23`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_24`
--
ALTER TABLE `project_24`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_25`
--
ALTER TABLE `project_25`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_26`
--
ALTER TABLE `project_26`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_27`
--
ALTER TABLE `project_27`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_29`
--
ALTER TABLE `project_29`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_41`
--
ALTER TABLE `project_41`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_42`
--
ALTER TABLE `project_42`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_44`
--
ALTER TABLE `project_44`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_45`
--
ALTER TABLE `project_45`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_46`
--
ALTER TABLE `project_46`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_47`
--
ALTER TABLE `project_47`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_48`
--
ALTER TABLE `project_48`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_49`
--
ALTER TABLE `project_49`
  MODIFY `iid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_users_search_table`
--
ALTER TABLE `project_users_search_table`
  MODIFY `pu_search_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `tid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`uid`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`uid`) ON DELETE RESTRICT,
  ADD CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`team_id`) REFERENCES `teams` (`tid`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
