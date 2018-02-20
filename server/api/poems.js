const router = require('express').Router()
const {User, Poem} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  Poem.findAll()
    .then(poems => res.json(poems))
    .catch(next)
})

router.get('/:poemId', (req, res, next) => {
  Poem.findById(req.params.poemId, {
    include: [
      {model: User}
    ]
  })
    .then(poem => res.json(poem))
    .catch(next)
})

router.put('/:poemId', (req, res, next) => {
  Poem.update(req.body, {
    where: {
      id: req.params.poemId
    }
  })
    .then(poemId => {
      Poem.findById(poemId[0], {
        include: [
          {model: User}
        ]
      })
        .then(poem => res.json(poem))
    })
    .catch(next)
})

router.delete('/:poemId', (req, res, next) => {
  Poem.destroy({
    where: {
      id: req.params.poemId
    }
  })
    .then(() => res.status(204).end())
    .catch(next)
})
