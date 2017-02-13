-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-11-25 06:14:54
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
(1, '百家新闻', '百家', 'img/2.jpg', '2016-11-03 00:00:00', '百家aaa'),
(2, '图片新闻', '图片', 'img/1.jpg', '2016-11-06 00:00:00', '11'),
(3, '精选新闻', '精选', 'img/1.jpg', '2016-11-06 00:00:00', '精选频道'),
(4, '精选新闻第二个测试', '精选', 'img/2.jpg', '2016-11-06 00:00:00', '精选频道'),
(5, '精选新闻第三个测试', '精选', 'img/3.jpg', '2016-11-06 00:00:00', '精选频道'),
(6, '社会新闻测试', '社会', 'img/3.jpg', '2016-11-06 00:00:00', '社会'),
(7, '社会新闻测试第二个', '社会', 'img/2.jpg', '2016-11-06 00:00:00', '社会'),
(8, '科技新闻测试', '科技', 'img/3.jpg', '2016-11-06 00:00:00', '科技啊'),
(19, '测试增加', '精选', 'img/1.jpg', '2016-11-03 00:00:00', '啊啊啊'),
(24, '&lt;script&gt;alert(1)&lt;/script&gt;', '本地', 'img/3.jpg', '2016-11-02 00:00:00', 'a'),
(26, '&lt;script&gt;alert(4)&lt;/script&gt;', '军事', 'img/2.jpg', '2016-11-09 00:00:00', 'qq');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
