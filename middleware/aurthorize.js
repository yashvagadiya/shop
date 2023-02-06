const jwt = require('jsonwebtoken');
const db = require(`../models`);

exports.authorize =  (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];

        if (!authorization) {
            const error = new Error("Authorization not found")
            error.statusCode = 422
            throw error
        }

        const splitAuthorization = authorization.split(' ');

        const token = splitAuthorization[1];

        if (!token) {
            const error = new Error("Authorization token invalid")
            error.statusCode = 422
            throw error
        }
        let decode

        try {
            decode =  jwt.verify(token, "yashvagadiya")
        } catch (error) {
            const err = new Error('Authorization token invalid')
            err.statusCode = 422
            throw err
        }

        const { id } = decode

        const user =  db.user.findOne({
                where: {
                        id: id
                    }
                });  

                        // db.user.findoneById(id).lean()

        req.user = user

        next();

    } catch (error) {
        const status = error.statusCode || 500
        return res.status(status).json({
            success: false,
            message: error.message
        })
    }
}