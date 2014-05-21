-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2014-05-13 12:18:55
-- 服务器版本： 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `meta_data`
--

-- --------------------------------------------------------

--
-- 表的结构 `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `category`
--

INSERT INTO `category` (`category_id`, `category`) VALUES
(4, '建筑艺术馆'),
(5, '测试');

-- --------------------------------------------------------

--
-- 表的结构 `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `author` varchar(20) CHARACTER SET utf8 NOT NULL,
  `title` varchar(20) CHARACTER SET utf8 NOT NULL,
  `grade` int(1) NOT NULL,
  `summary` text CHARACTER SET utf8 NOT NULL,
  `score` int(20) NOT NULL,
  `favor` int(20) NOT NULL DEFAULT '0',
  `teacher` varchar(20) CHARACTER SET utf8 NOT NULL,
  `date` varchar(10) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`project_id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=56 ;

--
-- 转存表中的数据 `project`
--

INSERT INTO `project` (`project_id`, `author`, `title`, `grade`, `summary`, `score`, `favor`, `teacher`, `date`) VALUES
(49, '张三', '测试', 1, '测试介绍', 88, 153, '刘', '2014-04-04'),
(50, '张三', '测试2', 1, '测试介绍', 88, 20, '刘', '2014-04-04'),
(51, '张三', '测试3', 1, '测试介绍', 88, 31, '刘', '2014-04-04'),
(52, '1', '1', 1, '空', 90, 0, '刘', '2014-06-01'),
(53, '', '2', 1, '没有', 55, 7, '刘', '2014-05-05'),
(54, '', '测试44', 1, '没有', 55, 0, '刘', '2014-05-05'),
(55, '', '测试555', 1, '没有', 56, 0, '张', '2014-09-09');

-- --------------------------------------------------------

--
-- 表的结构 `project_category`
--

CREATE TABLE IF NOT EXISTS `project_category` (
  `project_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id`,`category_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `project_category`
--

INSERT INTO `project_category` (`project_id`, `category_id`) VALUES
(49, 4),
(50, 4),
(51, 4),
(55, 4),
(55, 5);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
