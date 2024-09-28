
const {getAllUsers,createUser, removeUser, login,updateUser} = require('../controllers/user-controller');

const router = require('express').Router();

// user routes
router.get('/getAllUsers',getAllUsers);
router.post('/signup',createUser);
router.post('/login',login);
router.delete('/delete/:id',removeUser);
router.put('/update/:id',updateUser);

module.exports = router;