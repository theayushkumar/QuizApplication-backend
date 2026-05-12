const {

    startQuizService,
    submitQuizService,
    getResultService,
    getUserHistoryService,
    getQuizQuestionsService

} = require('../services/attempt.service');


// start quiz

const startQuiz = async (req, res) => {

    try {

        const { quiz_id, category_id } = req.body;

        if (!quiz_id || !category_id) {

            return res.status(400).json({
                success: false,
                message: 'quiz_id and category_id are required'
            });

        }

        const result = await startQuizService(
            req.user.id,
            quiz_id,
            category_id
        );

        return res.status(201).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// submit quiz

const submitQuiz = async (req, res) => {

    try {

        const { attempt_id, answers } = req.body;

        if (!attempt_id || !answers) {

            return res.status(400).json({
                success: false,
                message: 'attempt_id and answers are required'
            });

        }

        const result = await submitQuizService(
            attempt_id,
            answers
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// get result

const getResult = async (req, res) => {

    try {

        const result = await getResultService(
            req.params.id
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// get history

const getUserHistory = async (req, res) => {

    try {

        const result = await getUserHistoryService(
            req.user.id
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};


// get quiz questions

const getQuizQuestions = async (
    req,
    res
) => {

    try {

        const {
            quiz_id,
            category_id
        } = req.body;

        if (
            !quiz_id ||
            !category_id
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'quiz_id and category_id are required'
            });

        }

        const result =
            await getQuizQuestionsService(
                quiz_id,
                category_id
            );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(
            error.status || 500
        ).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    startQuiz,
    submitQuiz,
    getResult,
    getUserHistory,
    getQuizQuestions
};