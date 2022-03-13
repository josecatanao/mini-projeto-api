const Sequelize = require('sequelize');
const sequelize = new Sequelize('users','postgres', '0000',{
    dialect:'postgres',
    host:'localhost'
})


module.exports = sequelize;