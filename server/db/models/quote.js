const Sequelize = require('sequelize')
const db = require('../db')

const Quote = db.define('quote', {
  quote: {
    type: Sequelize.TEXT
  }
})

module.exports = Quote
