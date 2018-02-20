const Sequelize = require('sequelize')
const db = require('../db')

const Quote = db.define('quote', {
  content: {
    type: Sequelize.TEXT
  }
})

module.exports = Quote
