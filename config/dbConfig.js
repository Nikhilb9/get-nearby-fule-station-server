/**
 * Used by sequelize-cli tool
 * Not to be used in node application
 * For node application use dbConfig from config.js
 */

require('dotenv').config()
const { dbConfig } = require('./config')
module.exports = dbConfig
