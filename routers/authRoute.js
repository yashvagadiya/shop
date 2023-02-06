'use strict'
const express = require('express');
const router = express.Router();
const authController = require(`../controller/authcontroller`);

router.get('/list',authController.getAlllogin)
router.post('/login',authController.login)
// router.post('/sinup',authController.sinup)




module.exports = router;
