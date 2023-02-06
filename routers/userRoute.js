'use strict'
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/aurthorize')
const userController = require(`../controller/userController`);


console.log(authorize)

router.get('/list', authorize, userController.getAlluser)
router.get('/list/:id', authorize, userController.getuserbyId)
router.post('/add', userController.adduser)
router.put('/update/:id', authorize, userController.updateuser)
router.delete('/delete/:id', authorize, userController.deleteuser)

module.exports = router;