const db = require('../config/db');


// create quiz

const createQuizService = async (quizData) => {

    const {
        category_id,
        title,
        description,
        duration_minutes
    } = quizData;

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO quiz_list
            (
                category_id,
                title,
                description,
                duration_minutes
            )
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            query,
            [
                category_id,
                title,
                description,
                duration_minutes
            ],
            (error, result) => {

                if (error) {
                    return reject({
                        status: 500,
                        message: 'failed to create quiz'
                    });
                }

                return resolve({
                    success: true,
                    message: 'quiz created successfully'
                });

            }
        );

    });

};



// get quizzes

const getQuizzesService = async () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                quiz_list.*,
                categories.category_name
            FROM quiz_list

            LEFT JOIN categories
            ON quiz_list.category_id = categories.id

            ORDER BY quiz_list.id DESC
        `;

        db.query(query, (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to fetch quizzes'
                });
            }

            return resolve({
                success: true,
                data: result
            });

        });

    });

};



// get single quiz

const getQuizByIdService = async (id) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT * FROM quiz_list
            WHERE id = ?
        `;

        db.query(query, [id], (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to fetch quiz'
                });
            }

            if (result.length === 0) {
                return reject({
                    status: 404,
                    message: 'quiz not found'
                });
            }

            return resolve({
                success: true,
                data: result[0]
            });

        });

    });

};



// update quiz

const updateQuizService = async (id, quizData) => {

    const {
        category_id,
        title,
        description,
        duration_minutes,
        is_active
    } = quizData;

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE quiz_list
            SET
                category_id = ?,
                title = ?,
                description = ?,
                duration_minutes = ?,
                is_active = ?
            WHERE id = ?
        `;

        db.query(
            query,
            [
                category_id,
                title,
                description,
                duration_minutes,
                is_active,
                id
            ],
            (error, result) => {

                if (error) {
                    return reject({
                        status: 500,
                        message: 'failed to update quiz'
                    });
                }

                if (result.affectedRows === 0) {
                    return reject({
                        status: 404,
                        message: 'quiz not found'
                    });
                }

                return resolve({
                    success: true,
                    message: 'quiz updated successfully'
                });

            }
        );

    });

};



// delete quiz

const deleteQuizService = async (id) => {

    return new Promise((resolve, reject) => {

        const query = `
            DELETE FROM quiz_list
            WHERE id = ?
        `;

        db.query(query, [id], (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to delete quiz'
                });
            }

            if (result.affectedRows === 0) {
                return reject({
                    status: 404,
                    message: 'quiz not found'
                });
            }

            return resolve({
                success: true,
                message: 'quiz deleted successfully'
            });

        });

    });

};


module.exports = {
    createQuizService,
    getQuizzesService,
    getQuizByIdService,
    updateQuizService,
    deleteQuizService
};