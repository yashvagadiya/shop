const jwt = require('jsonwebtoken');
const db = require(`../models`);

// module.exports.login = async (request, response) => {

//         const loginData = request.body;
//         const oldetoken =  await db.sequelize.query(`SELECT login_token FROM user WHERE`+ loginData.email)
// }
exports.authorize = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        
        // const loginData = request.body;
        // const oldetoken =  await db.sequelize.query(`SELECT login_token FROM user WHERE`+ loginData.email)


        // if (authorization !== oldetoken){
        //     const error = new Error("Authorization token invalid")
        //     error.statusCode = 422
        //     throw error
        // }
        

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
            decode = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            const err = new Error('Authorization token invalid')
            err.statusCode = 422
            throw err
        }

        const { id } = decode

        const user =await db.user.findOne({
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
