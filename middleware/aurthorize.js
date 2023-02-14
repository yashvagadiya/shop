const jwt = require('jsonwebtoken');
const db = require(`../models`);


exports.authorize = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        
      
        const [oldetoken] =  await db.sequelize.query(`SELECT login_token FROM user`)

        let dbtoken ;
        oldetoken.forEach((token)=>{
            if(token.login_token !== null){
                // console.log(token)
                dbtoken = token.login_token

            }
        })
        // console.log(oldetoken);

        
        

        if (!authorization) {
            const error = new Error("Authorization not found")
            error.statusCode = 422
            throw error
        }

        const splitAuthorization = authorization.split(' ');

        const token = splitAuthorization[1];

        if (token !== dbtoken){
            const error = new Error("Authorization token invalid")
            error.statusCode = 422
            throw error
        }



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
