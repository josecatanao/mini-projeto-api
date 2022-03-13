const Sequelize = require('sequelize');
const database = require('./db');

const Contacts = database.define('contacts',{
    idUser:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    contact:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = Contacts;

