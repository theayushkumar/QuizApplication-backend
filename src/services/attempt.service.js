const db = require('../config/db');


// start quiz

const startQuizService = async (user_id, quiz_id, category_id) => {

    return new Promise((resolve, reject) => {

        // total questions

        const totalQuestionQuery = `
            SELECT COUNT(*) AS totalQuestions
            FROM questions
            WHERE quiz_id = ?
        `;

        db.query(
            totalQuestionQuery,
            [quiz_id],
            (countError, countResult) => {

                if (countError) {

                    return reject({
                        status: 500,
                        message: 'failed to count questions'
                    });

                }

                const totalQuestions =
                    countResult[0].totalQuestions;

                // create attempt

                const insertQuery = `
                    INSERT INTO quiz_attempts
                    (
                        user_id,
                        quiz_id,
                        category_id,
                        total_questions,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.query(
                    insertQuery,
                    [
                        user_id,
                        quiz_id,
                        category_id,
                        totalQuestions,
                        'started'
                    ],
                    (insertError, result) => {

                        if (insertError) {

                            return reject({
                                status: 500,
                                message: 'failed to start quiz'
                            });

                        }

                        return resolve({
                            success: true,
                            message: 'quiz started successfully',
                            attempt_id: result.insertId
                        });

                    }
                );

            }
        );

    });

};



// submit quiz

const submitQuizService = async (
    attempt_id,
    answers
) => {

    return new Promise((resolve, reject) => {

        // get all questions

        const questionIds = answers.map(
            item => item.question_id
        );

        const questionQuery = `
            SELECT
                id,
                correct_answer
            FROM questions
            WHERE id IN (?)
        `;

        db.query(
            questionQuery,
            [questionIds],
            (questionError, questionResult) => {

                if (questionError) {

                    return reject({
                        status: 500,
                        message: 'failed to fetch questions'
                    });

                }

                let correctAnswers = 0;

                let wrongAnswers = 0;

                const userAnswerValues = [];

                answers.forEach(answer => {

                    const question =
                        questionResult.find(
                            q => q.id === answer.question_id
                        );

                    const isCorrect =
                        question.correct_answer ===
                        answer.selected_answer;

                    if (isCorrect) {
                        correctAnswers++;
                    } else {
                        wrongAnswers++;
                    }

                    userAnswerValues.push([
                        attempt_id,
                        answer.question_id,
                        answer.selected_answer,
                        isCorrect
                    ]);

                });

                const attemptedQuestions =
                    answers.length;

                const score = correctAnswers;

                // save user answers

                const insertAnswersQuery = `
                    INSERT INTO user_answers
                    (
                        attempt_id,
                        question_id,
                        selected_answer,
                        is_correct
                    )
                    VALUES ?
                `;

                db.query(
                    insertAnswersQuery,
                    [userAnswerValues],
                    (answerError) => {

                        if (answerError) {

                            return reject({
                                status: 500,
                                message: 'failed to save answers'
                            });

                        }

                        // update attempt

                        const updateAttemptQuery = `
                            UPDATE quiz_attempts
                            SET
                                attempted_questions = ?,
                                correct_answers = ?,
                                wrong_answers = ?,
                                score = ?,
                                status = ?,
                                completed_at = NOW()
                            WHERE id = ?
                        `;

                        db.query(
                            updateAttemptQuery,
                            [
                                attemptedQuestions,
                                correctAnswers,
                                wrongAnswers,
                                score,
                                'completed',
                                attempt_id
                            ],
                            (updateError) => {

                                if (updateError) {

                                    return reject({
                                        status: 500,
                                        message: 'failed to update result'
                                    });

                                }

                                return resolve({
                                    success: true,
                                    message: 'quiz submitted successfully',
                                    result: {
                                        attempted_questions:
                                            attemptedQuestions,

                                        correct_answers:
                                            correctAnswers,

                                        wrong_answers:
                                            wrongAnswers,

                                        score
                                    }
                                });

                            }
                        );

                    }
                );

            }
        );

    });

};



// get result

const getResultService = async (attempt_id) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                qa.*,
                users.name,
                users.email,
                quiz_list.title,
                categories.category_name

            FROM quiz_attempts qa

            LEFT JOIN users
            ON qa.user_id = users.id

            LEFT JOIN quiz_list
            ON qa.quiz_id = quiz_list.id

            LEFT JOIN categories
            ON qa.category_id = categories.id

            WHERE qa.id = ?
        `;

        db.query(
            query,
            [attempt_id],
            (error, result) => {

                if (error) {

                    return reject({
                        status: 500,
                        message: 'failed to fetch result'
                    });

                }

                if (result.length === 0) {

                    return reject({
                        status: 404,
                        message: 'result not found'
                    });

                }

                return resolve({
                    success: true,
                    data: result[0]
                });

            }
        );

    });

};



// get user history

const getUserHistoryService = async (user_id) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                qa.*,
                quiz_list.title,
                categories.category_name

            FROM quiz_attempts qa

            LEFT JOIN quiz_list
            ON qa.quiz_id = quiz_list.id

            LEFT JOIN categories
            ON qa.category_id = categories.id

            WHERE qa.user_id = ?

            ORDER BY qa.id DESC
        `;

        db.query(
            query,
            [user_id],
            (error, result) => {

                if (error) {

                    return reject({
                        status: 500,
                        message: 'failed to fetch history'
                    });

                }

                return resolve({
                    success: true,
                    data: result
                });

            }
        );

    });

};



// get quiz questions

const getQuizQuestionsService = async (
    quiz_id,
    category_id
) => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                id,
                question,

                option_a,
                option_b,
                option_c,
                option_d

            FROM questions

            WHERE
                quiz_id = ?
                AND category_id = ?

            ORDER BY RAND()

            LIMIT 10

        `;

        db.query(
            query,
            [
                quiz_id,
                category_id
            ],
            (error, result) => {

                if (error) {

                    return reject({
                        status: 500,
                        message:
                            'failed to fetch questions'
                    });

                }

                return resolve({
                    success: true,
                    data: result
                });

            }
        );

    });

};

module.exports = {
    startQuizService,
    submitQuizService,
    getResultService,
    getUserHistoryService,
    getQuizQuestionsService
};