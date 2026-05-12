const db = require('../config/db');


// dashboard stats

const getDashboardStatsService = async () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                (SELECT COUNT(*) FROM users)
                AS total_users,

                (
                    SELECT COUNT(*)
                    FROM categories
                )
                AS total_categories,

                (
                    SELECT COUNT(*)
                    FROM questions
                )
                AS total_questions,

                (
                    SELECT COUNT(*)
                    FROM users
                    WHERE is_active = 1
                )
                AS active_users,

                (
                    SELECT COUNT(*)
                    FROM users
                    WHERE is_active = 0
                )
                AS inactive_users,

                (
                    SELECT COUNT(*)
                    FROM quiz_list
                )
                AS total_quizzes,

                (
                    SELECT COUNT(*)
                    FROM quiz_attempts
                    WHERE status = 'completed'
                )
                AS completed_attempts,

                (
                    SELECT COUNT(*)
                    FROM quiz_attempts
                    WHERE score < 5
                )
                AS low_score_attempts

        `;

        db.query(query, (error, result) => {

            if (error) {

                return reject({
                    status: 500,
                    message: 'failed to fetch dashboard stats'
                });

            }

            return resolve({
                success: true,
                data: result[0]
            });

        });

    });

};



// category attempts chart

const getCategoryAttemptsService = async () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                categories.category_name,

                COUNT(quiz_attempts.id)
                AS total_attempts

            FROM quiz_attempts

            LEFT JOIN categories
            ON quiz_attempts.category_id = categories.id

            GROUP BY categories.id

            ORDER BY total_attempts DESC

        `;

        db.query(query, (error, result) => {

            if (error) {

                return reject({
                    status: 500,
                    message:
                        'failed to fetch category attempts'
                });

            }

            return resolve({
                success: true,
                data: result
            });

        });

    });

};



// result distribution chart

const getResultDistributionService = async () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                SUM(
                    CASE
                        WHEN score >= 5
                        THEN 1
                        ELSE 0
                    END
                ) AS passed,

                SUM(
                    CASE
                        WHEN score < 5
                        THEN 1
                        ELSE 0
                    END
                ) AS failed

            FROM quiz_attempts

            WHERE status = 'completed'

        `;

        db.query(query, (error, result) => {

            if (error) {

                return reject({
                    status: 500,
                    message:
                        'failed to fetch result distribution'
                });

            }

            return resolve({
                success: true,
                data: result[0]
            });

        });

    });

};


module.exports = {
    getDashboardStatsService,
    getCategoryAttemptsService,
    getResultDistributionService
};