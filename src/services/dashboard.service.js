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


const getUserPerformanceService = async () => {

    // 1. get all users
    const usersQuery = `
        SELECT id, name, email
        FROM users
    `;

    const users = await new Promise((resolve, reject) => {
        db.query(usersQuery, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });

    const finalData = [];

    for (const user of users) {

        // =========================
        // 2. SUMMARY QUERY (FIXED)
        // =========================
        const summaryQuery = `
            SELECT 
                COUNT(*) AS total_quizzes_attempted,

                COALESCE(SUM(correct_answers), 0) AS total_correct,
                COALESCE(SUM(wrong_answers), 0) AS total_wrong,

                ROUND(
                    (COALESCE(SUM(correct_answers), 0) * 100) / 
                    NULLIF(SUM(total_questions), 0),
                0) AS avg_accuracy

            FROM quiz_attempts
            WHERE user_id = ?
        `;

        const summary = await new Promise((resolve, reject) => {
            db.query(summaryQuery, [user.id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });

        // =========================
        // 3. HISTORY QUERY (FIXED)
        // =========================
        const historyQuery = `
            SELECT 
                ql.title AS quiz_title,
                c.category_name,

                qa.score,
                qa.total_questions,
                qa.correct_answers,
                qa.wrong_answers,

                ROUND(
                    (COALESCE(qa.correct_answers,0) * 100) / NULLIF(qa.total_questions,0),
                0) AS accuracy,

                qa.completed_at

            FROM quiz_attempts qa
            JOIN quiz_list ql ON qa.quiz_id = ql.id
            JOIN categories c ON qa.category_id = c.id

            WHERE qa.user_id = ?
            ORDER BY qa.completed_at DESC
        `;

        const history = await new Promise((resolve, reject) => {
            db.query(historyQuery, [user.id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // =========================
        // 4. FINAL RESPONSE
        // =========================
        finalData.push({
            user_id: user.id,
            name: user.name,
            email: user.email,

            summary: {
                total_quizzes_attempted: summary?.total_quizzes_attempted || 0,
                total_correct: summary?.total_correct || 0,
                total_wrong: summary?.total_wrong || 0,
                avg_accuracy: summary?.avg_accuracy || 0
            },

            history: history || []
        });
    }

    return {
        users: finalData
    };
};


module.exports = {
    getDashboardStatsService,
    getCategoryAttemptsService,
    getResultDistributionService,
    getUserPerformanceService
};