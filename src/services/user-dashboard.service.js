const db = require('../config/db');


// dashboard stats

const getUserDashboardStatsService = async (
    userId
) => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                COUNT(*) AS attempted_quizzes,

                IFNULL(SUM(score), 0)
                AS total_score,

                IFNULL(MAX(score), 0)
                AS best_score,

                ROUND(

                    (
                        SUM(correct_answers)
                        /
                        SUM(attempted_questions)
                    ) * 100

                , 2) AS accuracy

            FROM quiz_attempts

            WHERE user_id = ?

            AND status = 'completed'

        `;

        db.query(
            query,
            [userId],
            (error, result) => {

                if (error) {

                    return reject({
                        status: 500,
                        message:
                            'failed to fetch dashboard stats'
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



// correct vs wrong chart

const getUserResultChartService = async (
    userId
) => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                IFNULL(
                    SUM(correct_answers),
                    0
                ) AS correct_answers,

                IFNULL(
                    SUM(wrong_answers),
                    0
                ) AS wrong_answers

            FROM quiz_attempts

            WHERE user_id = ?

            AND status = 'completed'

        `;

        db.query(
            query,
            [userId],
            (error, result) => {

                if (error) {

                    return reject({
                        status: 500,
                        message:
                            'failed to fetch result chart'
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


module.exports = {
    getUserDashboardStatsService,
    getUserResultChartService
};