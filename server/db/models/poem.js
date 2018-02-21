const Sequelize = require('sequelize')
const db = require('../db')

const Poem = db.define('poem', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  quote: {
    type: Sequelize.STRING
  }
})

module.exports = Poem
