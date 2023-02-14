
const { request, response } = require("express");
const express = require("express");
const bcrypt = require('bcrypt');
const db = require(`../models`);
const fs = require("fs");
const saltRounds = 10;
const someOtherPlaintextPassword = 'not_bacon';
const jwt = require("jsonwebtoken")

// var redis = require('redis');
// var JWTR =  require('jwt-redis').default;
// var redisClient = redis.createClient();
// var jwtr = new JWTR(redisClient);



// getdata
module.exports.getAlllogin = async (request, response) => {
    try {
        const [login] = await db.sequelize.query(`SELECT * FROM login`);
        response.json({ status: true, msg: "Successfully get data", data: login });
    }
    catch (e) {
        console.log("Error :", e)
        return response.json({ staus: false, msg: "Something went wrong" });
    }
}

// login
module.exports.login = async (request, response) => {
    const loginData = request.body;
    const existemail = await db.user.findOne({
        where: {
            email: loginData.email
        }
    });
    if (existemail) {

        bcrypt.compare(loginData.password, existemail.dataValues.password, function (err, isPasswordMatch) {
            if (isPasswordMatch == true) {
                // const distroytoken = db.user.update({
                //     login_token: null
                // }, { where: { email: loginData.email } });

                db.sequelize.query(`UPDATE user SET login_token = NULL `);
                


                const payload = {
                    id: existemail.id,
                    email: existemail.email
                }
                const token = jwt.sign(payload, process.env.SECRET_KEY)

                //tokan save in tabal
                existemail.login_token = token
                existemail.save()
                //end tokan save in tabal

                const details = {
                    id: existemail.dataValues.id,
                    email: existemail.dataValues.email,
                    token: token,
                }

                response.json({ status: true, msg: "login successfully....", data: details });

            }
            else {
                return response.json({ staus: false, msg: "Incorrect password!!!!" });
            }
        });
    }
    else {
        return response.json({ staus: false, msg: "Email not exist!" });
    }
}




// signup

module.exports.signup = async (request, response) => {
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
                    email: userData.email, password: hash
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













// 
// module.exports.sinup = async (request, response) => {
    // const loginData = request.body;
    // const existlogin = await db.login.findOne({
        // where: {
            // email: loginData.email,
        // }
    // });
    // if (existlogin == null) {
        // bcrypt.genSalt(saltRounds, function (err, salt) {
            // bcrypt.hash(loginData.password, salt, async function (err, hash) {
                // return await db.login.create({
                    // email: loginData.email, password: hash,
                // }).then(function (logins) {
                    // if (logins) {
                        // response.json({ status: true, msg: "Record inserted successfully.....", data: logins });
// 
                    // }
                    // else {
                        // return response.json({ staus: false, msg: "Record not inserted in database" });
// 
                    // }
                // });
            // });
        // });
    // }
// 
    // else {
        // return response.json({ staus: false, msg: "Email already exist!" });
    // }
// }
// 
// 
// 