const bcrypt = require('bcrypt');

const db = require('../config/db');


// add user

const addUserService = async (userData) => {

    const {
        name,
        email,
        password,
        role
    } = userData;

    return new Promise(async (resolve, reject) => {

        // check email

        const checkEmailQuery = `
            SELECT id
            FROM users
            WHERE email = ?
        `;

        db.query(
            checkEmailQuery,
            [email],
            async (checkError, checkResult) => {

                if (checkError) {

                    return reject({
                        status: 500,
                        message: 'failed to check email'
                    });

                }

                if (checkResult.length > 0) {

                    return reject({
                        status: 400,
                        message: 'email already exists'
                    });

                }

                // hash password

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // insert user

                const insertQuery = `
                    INSERT INTO users
                    (
                        name,
                        email,
                        password,
                        role
                    )
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertQuery,
                    [
                        name,
                        email,
                        hashedPassword,
                        role
                    ],
                    (insertError) => {

                        if (insertError) {

                            return reject({
                                status: 500,
                                message: 'failed to add user'
                            });

                        }

                        return resolve({
                            success: true,
                            message: 'user added successfully'
                        });

                    }
                );

            }
        );

    });

};



// get users

const getUsersService = async (filters) => {

    const {
        page_size,
        page_number,
        sorting_direction,
        searchFilter
    } = filters;

    return new Promise((resolve, reject) => {

        const limit =
            parseInt(page_size) || 10;

        const page =
            parseInt(page_number) || 1;

        const offset =
            (page - 1) * limit;

        const sort =
            sorting_direction === 'ASC'
                ? 'ASC'
                : 'DESC';

        const search =
            searchFilter || '';

        // total count

        const totalQuery = `
            SELECT COUNT(*) AS total
            FROM users
            WHERE
                name LIKE ?
                OR email LIKE ?
                OR role LIKE ?
        `;

        db.query(
            totalQuery,
            [
                `%${search}%`,
                `%${search}%`,
                `%${search}%`
            ],
            (totalError, totalResult) => {

                if (totalError) {

                    return reject({
                        status: 500,
                        message: 'failed to fetch users count'
                    });

                }

                const totalRecords =
                    totalResult[0].total;

                // get users

                const query = `
                    SELECT
                        id,
                        name,
                        email,
                        role,
                        is_active,
                        created_at,
                        updated_at

                    FROM users

                    WHERE
                        name LIKE ?
                        OR email LIKE ?
                        OR role LIKE ?

                    ORDER BY id ${sort}

                    LIMIT ?
                    OFFSET ?
                `;

                db.query(
                    query,
                    [
                        `%${search}%`,
                        `%${search}%`,
                        `%${search}%`,
                        limit,
                        offset
                    ],
                    (error, result) => {

                        if (error) {

                            return reject({
                                status: 500,
                                message: 'failed to fetch users'
                            });

                        }

                        return resolve({
                            success: true,

                            total_records:
                                totalRecords,

                            page_number: page,

                            page_size: limit,

                            data: result
                        });

                    }
                );

            }
        );

    });

};



// update user

const updateUserService = async (userData) => {

    const {
        id,
        name,
        email,
        role
    } = userData;

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE users
            SET
                name = ?,
                email = ?,
                role = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        db.query(
            query,
            [
                name,
                email,
                role,
                id
            ],
            (error, result) => {

                if (error) {

                    return reject({
                        status: 500,
                        message: 'failed to update user'
                    });

                }

                if (result.affectedRows === 0) {

                    return reject({
                        status: 404,
                        message: 'user not found'
                    });

                }

                return resolve({
                    success: true,
                    message: 'user updated successfully'
                });

            }
        );

    });

};



// delete user

const deleteUserService = async (id) => {

    return new Promise((resolve, reject) => {

        const query = `
            DELETE FROM users
            WHERE id = ?
        `;

        db.query(
            query,
            [id],
            (error, result) => {

                if (error) {

                    return reject({
                        status: 500,
                        message: 'failed to delete user'
                    });

                }

                if (result.affectedRows === 0) {

                    return reject({
                        status: 404,
                        message: 'user not found'
                    });

                }

                return resolve({
                    success: true,
                    message: 'user deleted successfully'
                });

            }
        );

    });

};



// change status

const changeUserStatusService = async (
    id,
    is_active
) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE users
            SET
                is_active = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        db.query(
            query,
            [
                is_active,
                id
            ],
            (error, result) => {

                if (error) {

                    return reject({
                        status: 500,
                        message: 'failed to change status'
                    });

                }

                if (result.affectedRows === 0) {

                    return reject({
                        status: 404,
                        message: 'user not found'
                    });

                }

                return resolve({
                    success: true,
                    message: 'status updated successfully'
                });

            }
        );

    });

};


module.exports = {
    addUserService,
    getUsersService,
    updateUserService,
    deleteUserService,
    changeUserStatusService
};