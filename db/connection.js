require("dotenv").config() // load .env variables

//DESTRUCTURE ENV VARIABLES
const {DATABASE_URL} = process.env

// CONNECT TO MONGO
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(DATABASE_URL, {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// EXPORT CONNECTION
module.exports = sequelize;