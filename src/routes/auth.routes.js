const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

const verifyToken = require('../middlewares/auth.middleware');


// signup

router.post('/signup', authController.signup);


// login

router.post('/login', authController.login);


// profile

router.get('/profile', verifyToken, (req, res) => {

    return res.status(200).json({
        success: true,
        user: req.user
    });

});


module.exports = router;