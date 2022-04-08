CREATE DATABASE  IF NOT EXISTS `mypms` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_swedish_ci */;
USE `mypms`;
-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: mypms
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `MIGRACAO_USERS`
--

DROP TABLE IF EXISTS `MIGRACAO_USERS`;
/*!50001 DROP VIEW IF EXISTS `MIGRACAO_USERS`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `MIGRACAO_USERS` AS SELECT 
 1 AS `id`,
 1 AS `svr`,
 1 AS `tipo`,
 1 AS `user`,
 1 AS `passwd`,
 1 AS `grp`,
 1 AS `app`,
 1 AS `adm`,
 1 AS `acesso`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `VW_MIG`
--

DROP TABLE IF EXISTS `VW_MIG`;
/*!50001 DROP VIEW IF EXISTS `VW_MIG`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `VW_MIG` AS SELECT 
 1 AS `id`,
 1 AS `svr`,
 1 AS `tipo`,
 1 AS `user`,
 1 AS `passwd`,
 1 AS `grp`,
 1 AS `app`,
 1 AS `adm`,
 1 AS `acesso`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `VW_USER`
--

DROP TABLE IF EXISTS `VW_USER`;
/*!50001 DROP VIEW IF EXISTS `VW_USER`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `VW_USER` AS SELECT 
 1 AS `id`,
 1 AS `svr`,
 1 AS `tipo`,
 1 AS `user`,
 1 AS `passwd`,
 1 AS `grp`,
 1 AS `app`,
 1 AS `adm`,
 1 AS `acesso`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `ambiente`
--

DROP TABLE IF EXISTS `ambiente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ambiente` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `ambiente` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base64_data`
--

DROP TABLE IF EXISTS `base64_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `base64_data` (
  `c` char(1) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `val` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `cliente` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hw_inv`
--

DROP TABLE IF EXISTS `hw_inv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hw_inv` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `svr` smallint(6) DEFAULT NULL,
  `mem` varchar(60) DEFAULT NULL,
  `swap` varchar(60) DEFAULT NULL,
  `cpu` varchar(60) DEFAULT NULL,
  `clock` varchar(60) DEFAULT NULL,
  `os` varchar(100) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=272 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hw_inv_dsk`
--

DROP TABLE IF EXISTS `hw_inv_dsk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hw_inv_dsk` (
  `id` smallint(6) NOT NULL,
  `dsk` varchar(60) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hw_inv_nic`
--

DROP TABLE IF EXISTS `hw_inv_nic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hw_inv_nic` (
  `id` smallint(6) NOT NULL,
  `nic` varchar(60) DEFAULT NULL,
  `macaddr` varchar(18) DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ip`
--

DROP TABLE IF EXISTS `ip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ip` (
  `id` smallint(6) NOT NULL,
  `addr` varchar(25) NOT NULL,
  `tipo` smallint(6) NOT NULL,
  `sid` smallint(6) NOT NULL AUTO_INCREMENT,
  `addrnat` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=MyISAM AUTO_INCREMENT=496 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `jobid` int(11) NOT NULL AUTO_INCREMENT,
  `dateExec` date DEFAULT NULL,
  `rndpwd` tinyint(4) DEFAULT NULL,
  `strpwd` varchar(50) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '99',
  `jobname` varchar(200) DEFAULT NULL,
  `nextRun` date DEFAULT NULL,
  `enabled` tinyint(4) DEFAULT '1',
  `repeatInt` smallint(6) DEFAULT NULL,
  `repeatType` varchar(30) DEFAULT NULL,
  `repeatCustomType` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`jobid`)
) ENGINE=MyISAM AUTO_INCREMENT=1016 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobsParam`
--

DROP TABLE IF EXISTS `jobsParam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobsParam` (
  `jobid` int(11) DEFAULT NULL,
  `paramtype` varchar(10) DEFAULT NULL,
  `paramvalue` varchar(30) DEFAULT NULL,
  `usrExcept` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modulo` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=87 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `os`
--

DROP TABLE IF EXISTS `os`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `os` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `os` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projeto`
--

DROP TABLE IF EXISTS `projeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projeto` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `projeto` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `servidores`
--

DROP TABLE IF EXISTS `servidores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servidores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `host` varchar(20) NOT NULL,
  `ip` varchar(15) NOT NULL,
  `serial` varchar(45) DEFAULT NULL,
  `os` smallint(6) NOT NULL,
  `tipo` tinyint(4) NOT NULL,
  `ambiente` smallint(6) NOT NULL,
  `modulo` smallint(6) NOT NULL,
  `projeto` smallint(6) NOT NULL,
  `cliente` smallint(6) NOT NULL,
  `local` varchar(45) DEFAULT NULL,
  `status` smallint(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1475 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sw_inv`
--

DROP TABLE IF EXISTS `sw_inv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sw_inv` (
  `id` smallint(6) NOT NULL,
  `swid` smallint(6) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sw_name`
--

DROP TABLE IF EXISTS `sw_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sw_name` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `swname` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipo`
--

DROP TABLE IF EXISTS `tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipo_ip`
--

DROP TABLE IF EXISTS `tipo_ip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_ip` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipo_usuario`
--

DROP TABLE IF EXISTS `tipo_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_usuario` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `tipo` smallint(6) DEFAULT NULL,
  `display` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `svr` int(11) DEFAULT NULL,
  `user` varchar(30) DEFAULT NULL,
  `passwd` varchar(128) DEFAULT NULL,
  `grp` int(11) DEFAULT NULL,
  `app` varchar(30) DEFAULT NULL,
  `adm` tinyint(4) DEFAULT NULL,
  `acesso` varchar(150) DEFAULT NULL,
  `type` smallint(6) DEFAULT NULL,
  `icon` varchar(30) DEFAULT NULL,
  `chgpwd` tinyint(4) DEFAULT NULL,
  `chgpwd_msg` varchar(500) DEFAULT NULL,
  `chgpwd_status` tinyint(4) DEFAULT NULL,
  `chgpwd_last` date DEFAULT NULL,
  `chgpwd_next` date DEFAULT NULL,
  `iconAction` varchar(30) DEFAULT NULL,
  `passwdbkp` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4959 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `vw_pwd_audit`
--

DROP TABLE IF EXISTS `vw_pwd_audit`;
/*!50001 DROP VIEW IF EXISTS `vw_pwd_audit`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vw_pwd_audit` AS SELECT 
 1 AS `id`,
 1 AS `host`,
 1 AS `ambiente`,
 1 AS `iconAction`,
 1 AS `user`,
 1 AS `passwd`,
 1 AS `passwdbkp`,
 1 AS `chgpwd`,
 1 AS `chgpwd_msg`,
 1 AS `chgpwd_status`,
 1 AS `chgpwd_last`,
 1 AS `chgpwd_next`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_server`
--

DROP TABLE IF EXISTS `vw_server`;
/*!50001 DROP VIEW IF EXISTS `vw_server`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vw_server` AS SELECT 
 1 AS `hid`,
 1 AS `host`,
 1 AS `ip`,
 1 AS `serial`,
 1 AS `oid`,
 1 AS `os`,
 1 AS `tid`,
 1 AS `tipo`,
 1 AS `aid`,
 1 AS `ambiente`,
 1 AS `mid`,
 1 AS `modulo`,
 1 AS `projid`,
 1 AS `projeto`,
 1 AS `clid`,
 1 AS `cliente`,
 1 AS `local`,
 1 AS `sid`,
 1 AS `status`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'mypms'
--

--
-- Final view structure for view `MIGRACAO_USERS`
--

/*!50001 DROP VIEW IF EXISTS `MIGRACAO_USERS`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `MIGRACAO_USERS` AS select `usuarios`.`id` AS `id`,`usuarios`.`svr` AS `svr`,`usuarios`.`type` AS `tipo`,`usuarios`.`user` AS `user`,`usuarios`.`passwd` AS `passwd`,`usuarios`.`grp` AS `grp`,`usuarios`.`app` AS `app`,`usuarios`.`adm` AS `adm`,`usuarios`.`acesso` AS `acesso` from `usuarios` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `VW_MIG`
--

/*!50001 DROP VIEW IF EXISTS `VW_MIG`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `VW_MIG` AS select `usuarios`.`id` AS `id`,`usuarios`.`svr` AS `svr`,`usuarios`.`type` AS `tipo`,`usuarios`.`user` AS `user`,`usuarios`.`passwd` AS `passwd`,`usuarios`.`grp` AS `grp`,`usuarios`.`app` AS `app`,`usuarios`.`adm` AS `adm`,`usuarios`.`acesso` AS `acesso` from `usuarios` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `VW_USER`
--

/*!50001 DROP VIEW IF EXISTS `VW_USER`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `VW_USER` AS select `usuarios`.`id` AS `id`,`usuarios`.`svr` AS `svr`,`usuarios`.`type` AS `tipo`,`usuarios`.`user` AS `user`,`usuarios`.`passwd` AS `passwd`,`usuarios`.`grp` AS `grp`,`usuarios`.`app` AS `app`,`usuarios`.`adm` AS `adm`,`usuarios`.`acesso` AS `acesso` from `usuarios` where (`usuarios`.`adm` <> 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_pwd_audit`
--

/*!50001 DROP VIEW IF EXISTS `vw_pwd_audit`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_pwd_audit` AS select `s`.`id` AS `id`,`s`.`host` AS `host`,`e`.`ambiente` AS `ambiente`,`u`.`iconAction` AS `iconAction`,`u`.`user` AS `user`,`u`.`passwd` AS `passwd`,`u`.`passwdbkp` AS `passwdbkp`,`u`.`chgpwd` AS `chgpwd`,`u`.`chgpwd_msg` AS `chgpwd_msg`,`u`.`chgpwd_status` AS `chgpwd_status`,`u`.`chgpwd_last` AS `chgpwd_last`,`u`.`chgpwd_next` AS `chgpwd_next` from (((`usuarios` `u` join `servidores` `s` on((`u`.`svr` = `s`.`id`))) join `tipo_usuario` `t` on((`u`.`type` = `t`.`tipo`))) join `ambiente` `e` on((`e`.`id` = `s`.`ambiente`))) where (`t`.`tipo` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_server`
--

/*!50001 DROP VIEW IF EXISTS `vw_server`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_server` AS select `t1`.`id` AS `hid`,`t1`.`host` AS `host`,`t1`.`ip` AS `ip`,`t1`.`serial` AS `serial`,`t1`.`os` AS `oid`,`t8`.`os` AS `os`,`t1`.`tipo` AS `tid`,`t3`.`tipo` AS `tipo`,`t1`.`ambiente` AS `aid`,`t4`.`ambiente` AS `ambiente`,`t1`.`modulo` AS `mid`,`t2`.`modulo` AS `modulo`,`t1`.`projeto` AS `projid`,`t5`.`projeto` AS `projeto`,`t1`.`cliente` AS `clid`,`t6`.`cliente` AS `cliente`,`t1`.`local` AS `local`,`t1`.`status` AS `sid`,`t7`.`status` AS `status` from (((((((`servidores` `t1` left join `modules` `t2` on((`t1`.`modulo` = `t2`.`id`))) left join `tipo` `t3` on((`t1`.`tipo` = `t3`.`id`))) left join `ambiente` `t4` on((`t1`.`ambiente` = `t4`.`id`))) left join `projeto` `t5` on((`t1`.`projeto` = `t5`.`id`))) left join `cliente` `t6` on((`t1`.`cliente` = `t6`.`id`))) left join `status` `t7` on((`t1`.`status` = `t7`.`id`))) left join `os` `t8` on((`t1`.`os` = `t8`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-11  9:32:31
