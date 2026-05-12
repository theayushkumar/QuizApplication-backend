const express = require('express');

const router = express.Router();

const userController =
    require('../controllers/user.controller');

const verifyToken =
    require('../middlewares/auth.middleware');

const isAdmin =
    require('../middlewares/admin.middleware');


// add user

router.post(
    '/add',
    verifyToken,
    isAdmin,
    userController.addUser
);


// get users

router.post(
    '/list',
    verifyToken,
    isAdmin,
    userController.getUsers
);


// update user

router.put(
    '/update',
    verifyToken,
    isAdmin,
    userController.updateUser
);


// delete user

router.delete(
    '/delete',
    verifyToken,
    isAdmin,
    userController.deleteUser
);


// change status

router.put(
    '/change-status',
    verifyToken,
    isAdmin,
    userController.changeUserStatus
);


module.exports = router;