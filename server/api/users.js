const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

function adminMiddleware(req, res, next) {
  if (req.user.isAdmin) {
    next()
  } else {
    next('Unauthorized access!')
  }
}

router.get('/', adminMiddleware, (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})
