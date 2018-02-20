const router = require('express').Router()
const {Quote} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  Quote.findAll()
    .then(quotes => res.json(quotes))
    .catch(next)
})

router.get('/:quoteId', (req, res, next) => {
  Quote.findById(req.params.quoteId)
    .then(quote => res.json(quote))
    .catch(next)
})
