const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const db = require('../cofig/db');


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


module.exports = {
    signupService,
    loginService
};