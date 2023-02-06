const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("user", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name:
        {
            type: Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        password:{
            type:Sequelize.STRING
        },
        price: {
            type: Sequelize.STRING
        },
        discription: {
            type: Sequelize.STRING
        }
    });

    return user;
}