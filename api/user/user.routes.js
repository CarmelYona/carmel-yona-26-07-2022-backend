const express = require('express')
const { getUser, getUsers, deleteUser, updateUser, addUser } = require('./user.controller')
const router = express.Router()
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')

router.get('/', requireAuth, getUsers)
router.get('/:id', requireAuth, getUser)
router.post('/add', requireAuth, requireAdmin, addUser)
router.put('/:id', requireAuth, requireAdmin, updateUser)
router.put('/friendsAndMsg/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

module.exports = router