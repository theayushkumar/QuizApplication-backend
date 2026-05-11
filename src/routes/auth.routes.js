const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

const verifyToken = require('../middlewares/auth.middleware');


// auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// forgot password 
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

// profile
router.get('/profile', verifyToken, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
});


module.exports = router;