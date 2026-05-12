const db = require('../config/db');


// create question

const createQuestionService = async (questionData) => {

    const {
        quiz_id,
        category_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
    } = questionData;

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO questions
            (
                quiz_id,
                category_id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [
                quiz_id,
                category_id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer
            ],
            (error, result) => {

                if (error) {
                    return reject({
                        status: 500,
                        message: 'failed to create question'
                    });
                }

                return resolve({
                    success: true,
                    message: 'question created successfully'
                });

            }
        );

    });

};



// get questions

const getQuestionsService = async () => {

    return new Promise((resolve, reject) => {
        const query = `
    SELECT
        questions.*,
        quiz_list.title AS quiz_title,
        categories.category_name

    FROM questions

    LEFT JOIN quiz_list
    ON questions.quiz_id = quiz_list.id

    LEFT JOIN categories
    ON questions.category_id = categories.id

    ORDER BY questions.id DESC
`;

        db.query(query, (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to fetch questions'
                });
            }

            return resolve({
                success: true,
                data: result
            });

        });

    });

};



// get single question

const getQuestionByIdService = async (id) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT * FROM questions
            WHERE id = ?
        `;

        db.query(query, [id], (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to fetch question'
                });
            }

            if (result.length === 0) {
                return reject({
                    status: 404,
                    message: 'question not found'
                });
            }

            return resolve({
                success: true,
                data: result[0]
            });

        });

    });

};



// update question

const updateQuestionService = async (id, questionData) => {

    const {
        quiz_id,
        category_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
    } = questionData;

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE questions
            SET
                quiz_id = ?,
                category_id = ?,
                question = ?,
                option_a = ?,
                option_b = ?,
                option_c = ?,
                option_d = ?,
                correct_answer = ?
            WHERE id = ?
        `;

        db.query(
            query,
            [
                quiz_id,
                category_id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                id
            ],
            (error, result) => {

                if (error) {
                    return reject({
                        status: 500,
                        message: 'failed to update question'
                    });
                }

                if (result.affectedRows === 0) {
                    return reject({
                        status: 404,
                        message: 'question not found'
                    });
                }

                return resolve({
                    success: true,
                    message: 'question updated successfully'
                });

            }
        );

    });

};



// delete question

const deleteQuestionService = async (id) => {

    return new Promise((resolve, reject) => {

        const query = `
            DELETE FROM questions
            WHERE id = ?
        `;

        db.query(query, [id], (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to delete question'
                });
            }

            if (result.affectedRows === 0) {
                return reject({
                    status: 404,
                    message: 'question not found'
                });
            }

            return resolve({
                success: true,
                message: 'question deleted successfully'
            });

        });

    });

};


module.exports = {
    createQuestionService,
    getQuestionsService,
    getQuestionByIdService,
    updateQuestionService,
    deleteQuestionService
};