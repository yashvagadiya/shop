const { Sequelize } = require('sequelize');
const fs = require('fs');
const config = require(`../config/config`);

let dbOps = {
    host: config.HOSTNAME,
    port: config.DATABASEPORT || 3306,
    dialect: config.DIALECT,
    operatorsAliases: true,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        freezeTableName: true
     }
};

const sequelize = new Sequelize(
    config.DATABASENAME,
    'root',
    config.PASSWORD,
    dbOps);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const files = fs.readdirSync('./models');
files.forEach(function (file) {
    if (file != 'index.js') {
        let splitFile = file.split('.js');
        let name = splitFile[0];
        let filePath = `./${name}`
        db[name] = require(`${filePath}`)(sequelize, Sequelize);
        if(db[name] == 'user')
        {
            db[name].associate();
            role.associate(); 
        }
        // if(db[name] == 'auth')
        // {
        //     db[name].associate();
        //     role.associate(); 
        // }
    }
});

sequelize.sync({alter: true,force:false})
module.exports = db;