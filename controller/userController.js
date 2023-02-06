const { request, response } = require("express");
const express = require("express");
const bcrypt = require('bcrypt');
const db = require(`../models`);
const fs = require("fs");
const saltRounds = 10;
const someOtherPlaintextPassword = 'not_bacon';

// getdata
module.exports.getAlluser = async (request, response) => {
    try {
        const [user] = await db.sequelize.query(`SELECT * FROM user`);
        response.json({ status: true, msg: "Successfully get data", data: user });
    }
    catch (e) {
        console.log("Error :", e)
        return response.json({ staus: false, msg: "Something went wrong" });
    }
}

// getdata by id
module.exports.getuserbyId = async (request, response) => {
    let userId = request.params.id;
    try {
        const [user] = await db.sequelize.query(`SELECT * FROM user where  user.id = ` + userId);
        response.json({ status: true, msg: "Successfully get data", data: user });
    }
    catch (e) {
        console.log("Errroe :", e);
        return response.json({ staus: false, msg: "Something went wrong" });
    }
}

// Add
module.exports.adduser = async (request, response) => {
    const userData = request.body;
    const existuser = await db.user.findOne({
        where: {
            email: userData.email,
        }
    });
    if (existuser == null) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(userData.password, salt, async function (err, hash) {
                return await db.user.create({
                    name: userData.name, email: userData.email, password: hash, price: userData.price, discription: userData.discription
                }).then(function (users) {
                    if (users) {
                        response.json({ status: true, msg: "Record inserted successfully.....", data: users });

                    }
                    else {
                        return response.json({ staus: false, msg: "Record not inserted in database" });

                    }
                });
            });
        });
    }

    else {
        return response.json({ staus: false, msg: "Email already exist!" });
    }
}




// Update 
module.exports.updateuser = async (request, response) => {
    const userData = request.body;
    let userId = request.params.id;
    const existuserId = await db.user.findOne({
        where: {
            id: userId
        }
    });
    if (existuserId) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(userData.password, salt, async function (err, hash) {
                return await db.user.update({
                    name: userData.name, email: userData.email, password: hash, price: userData.price, discription: userData.discription
                }, { where: { id: userId } }).then(function (users) {
                    if (users) {
                        response.json({ status: true, msg: "Record updated successfully....." });
                    } else {
                        return response.json({ staus: false, msg: "Record not updated" });
                    }

                });
            });

        });
    }


    else {
        return response.json({ staus: false, msg: "Something went wrong" });
    }
}





// Delete 
module.exports.deleteuser = async (request, response) => {
    let userId = request.params.id;
    const existuserId = await db.user.findOne({
        where: {
            id: userId
        }
    });
    if (existuserId) {
        return await db.user.destroy({ where: { id: userId } }).then(function (users) {
            if (users) {
                response.json({ status: true, msg: "Record deleted successfully....." });
            } else {
                return response.json({ staus: false, msg: "Record not deleted" });
            }
        });
    }
    else {
        return response.json({ staus: false, msg: "Something went wrong" });
    }

}