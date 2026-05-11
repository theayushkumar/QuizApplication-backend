const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const db = require('../cofig/db');
const { sendOtpMail } = require('./mail.service');

// signup service

const signupService = async (userData) => {

    const { name, email, password } = userData;

    return new Promise((resolve, reject) => {

        const checkEmailQuery = `
            SELECT id FROM users WHERE email = ?
        `;

        db.query(checkEmailQuery, [email], async (emailError, emailResult) => {

            if (emailError) {
                return reject({
                    status: 500,
                    message: 'database error'
                });
            }

            if (emailResult.length > 0) {
                return reject({
                    status: 409,
                    message: 'email already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertUserQuery = `
                INSERT INTO users (name, email, password)
                VALUES (?, ?, ?)
            `;

            db.query(
                insertUserQuery,
                [name, email, hashedPassword],
                (insertError, insertResult) => {

                    if (insertError) {
                        return reject({
                            status: 500,
                            message: 'failed to create account'
                        });
                    }

                    return resolve({
                        success: true,
                        message: 'account created successfully',
                        data: {
                            user_id: insertResult.insertId,
                            name,
                            email
                        }
                    });

                }
            );

        });

    });

};



// login service

const loginService = async (loginData) => {

    const { email, password } = loginData;

    return new Promise((resolve, reject) => {

        const checkUserQuery = `
            SELECT * FROM users WHERE email = ?
        `;

        db.query(checkUserQuery, [email], async (userError, userResult) => {

            if (userError) {
                return reject({
                    status: 500,
                    message: 'database error'
                });
            }

            if (userResult.length === 0) {
                return reject({
                    status: 401,
                    message: 'invalid email or password'
                });
            }

            const user = userResult[0];

            const isPasswordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordMatch) {
                return reject({
                    status: 401,
                    message: 'invalid email or password'
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }
            );

            return resolve({
                success: true,
                message: 'login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        });

    });

};


// forgot password - send otp service
const sendOtpService = async (email) => {

    return new Promise((resolve, reject) => {

        // check user email

        const checkUserQuery = `
            SELECT id FROM users WHERE email = ?
        `;

        db.query(checkUserQuery, [email], async (userError, userResult) => {

            if (userError) {
                return reject({
                    status: 500,
                    message: 'database error'
                });
            }

            if (userResult.length === 0) {
                return reject({
                    status: 404,
                    message: 'email not found'
                });
            }

            // generate otp

            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            // otp expiry 5 minutes

            const expiresAt = new Date(
                Date.now() + 5 * 60 * 1000
            );

            // save otp

            const insertOtpQuery = `
                INSERT INTO otp_verifications
                (email, otp, expires_at)
                VALUES (?, ?, ?)
            `;

            db.query(
                insertOtpQuery,
                [email, otp, expiresAt],
                async (otpError) => {

                    if (otpError) {
                        return reject({
                            status: 500,
                            message: 'failed to save otp'
                        });
                    }

                    // send email

                    const isMailSent = await sendOtpMail(email, otp);

                    if (!isMailSent) {
                        return reject({
                            status: 500,
                            message: 'failed to send otp email'
                        });
                    }
                    return resolve({
                        success: true,
                        message: 'otp sent successfully'
                    });

                }
            );

        });

    });

};

const verifyOtpService = async (email, otp) => {

    return new Promise((resolve, reject) => {

        const verifyOtpQuery = `
            SELECT * FROM otp_verifications
            WHERE email = ? AND otp = ?
            ORDER BY id DESC
            LIMIT 1
        `;

        db.query(
            verifyOtpQuery,
            [email, otp],
            (otpError, otpResult) => {

                if (otpError) {
                    return reject({
                        status: 500,
                        message: 'database error'
                    });
                }

                if (otpResult.length === 0) {
                    return reject({
                        status: 400,
                        message: 'invalid otp'
                    });
                }

                const otpData = otpResult[0];

                const currentTime = new Date();

                if (currentTime > new Date(otpData.expires_at)) {
                    return reject({
                        status: 400,
                        message: 'otp expired'
                    });
                }

                return resolve({
                    success: true,
                    message: 'otp verified successfully'
                });

            }
        );

    });

};

const resetPasswordService = async (email, password) => {

    return new Promise(async (resolve, reject) => {

        // hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        // update password

        const updatePasswordQuery = `
            UPDATE users
            SET password = ?
            WHERE email = ?
        `;

        db.query(
            updatePasswordQuery,
            [hashedPassword, email],
            (updateError, updateResult) => {

                if (updateError) {
                    return reject({
                        status: 500,
                        message: 'failed to reset password'
                    });
                }

                if (updateResult.affectedRows === 0) {
                    return reject({
                        status: 404,
                        message: 'email not found'
                    });
                }

                return resolve({
                    success: true,
                    message: 'password updated successfully'
                });

            }
        );

    });

};
module.exports = {
    signupService,
    loginService,
    sendOtpService,
    verifyOtpService,
    resetPasswordService
};