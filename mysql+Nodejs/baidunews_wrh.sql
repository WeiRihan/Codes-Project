-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-11-28 07:53:00
-- 服务器版本： 10.1.13-MariaDB
-- PHP Version: 5.6.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `baidunews_wrh`
--

-- --------------------------------------------------------

--
-- 表的结构 `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `newstitle` varchar(200) CHARACTER SET utf8 NOT NULL,
  `newstype` varchar(200) CHARACTER SET utf8 NOT NULL,
  `newsimg` varchar(200) CHARACTER SET utf8 NOT NULL,
  `newstime` datetime NOT NULL,
  `newssrc` varchar(200) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `news`
--

INSERT INTO `news` (`id`, `newstitle`, `newstype`, `newsimg`, `newstime`, `newssrc`) VALUES
(33, '精选新闻', '精选', 'img/1.jpg', '2016-11-01 00:00:00', '精选专栏'),
(34, '百家新闻', '百家', 'img/2.jpg', '2016-11-01 00:00:00', '百家专栏'),
(35, '百家新闻第二个', '百家', 'img/1.jpg', '2016-11-01 00:00:00', '百家专栏'),
(36, '本地新闻', '本地', 'img/1.jpg', '2016-11-01 00:00:00', '本地专栏'),
(37, '军事新闻', '军事', 'img/1.jpg', '2016-11-01 00:00:00', '军事日报'),
(38, '精选新闻第二个', '精选', 'img/3.jpg', '2016-11-01 00:00:00', '精选日报'),
(40, '精选新闻第三条', '精选', 'img/2.jpg', '2016-10-17 00:00:00', '精选日报'),
(41, '图片新闻', '图片', 'img/3.jpg', '2016-11-06 00:00:00', '图片');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
