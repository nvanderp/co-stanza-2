const router = require('express').Router()
const {User, Poem} = require('../db/models')
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

router.get('/:userId/poems', (req, res, next) => {
  Poem.findAll({
    where: {
      userId: req.params.userId
    }
  })
    .then(poems => res.json(poems))
    .catch(next)
})

router.post('/:userId/poems', (req, res, next) => {
  Poem.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.params.userId
  })
    .then(poem => res.json(poem))
    .catch(next)
})

router.delete('/:userId', (req, res, next) => {
  User.destroy({
    where: {
      id: req.params.userId
    }
  })
    .then(() => res.status(204).end())
    .catch(next)
})
