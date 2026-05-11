const {
    signupService,
    loginService,
    sendOtpService,
    verifyOtpService,
    resetPasswordService
} = require('../services/auth.service');


// signup

const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            });
        }

        const result = await signupService(req.body);

        return res.status(201).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// login

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'email and password are required'
            });
        }

        const result = await loginService(req.body);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};


// forgot password 
const sendOtp = async (req, res) => {

    try {

        const { email } = req.body;

        // validate email

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'email is required'
            });
        }

        const result = await sendOtpService(email);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};

const verifyOtp = async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'email and otp are required'
            });
        }

        const result = await verifyOtpService(email, otp);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};

const resetPassword = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'email and password are required'
            });
        }

        const result = await resetPasswordService(email, password);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    signup,
    login,
    sendOtp,
    verifyOtp,
    resetPassword
};