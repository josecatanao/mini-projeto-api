const Sequelize = require('sequelize');
const database = require('./db');


const Users = database.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    cod:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    validated:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false
    }

})

module.exports = Users;