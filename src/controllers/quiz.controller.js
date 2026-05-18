const {

    createQuizService,
    getQuizzesService,
    getQuizByIdService,
    updateQuizService,
    deleteQuizService,
    getQuizzesByCategoryIdService
} = require('../services/quiz.service');


// create quiz

const createQuiz = async (req, res) => {

    try {

        const { category_id, title } = req.body;

        if (!category_id || !title) {

            return res.status(400).json({
                success: false,
                message: 'category_id and title are required'
            });

        }

        const result = await createQuizService(req.body);

        return res.status(201).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// get quizzes

const getQuizzes = async (req, res) => {

    try {

        const result = await getQuizzesService();

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};


// get quizzes by category id

const getQuizzesByCategoryId = async (req, res) => {

    try {

        const result = await getQuizzesByCategoryIdService(
            req.params.category_id
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// get single quiz

const getQuizById = async (req, res) => {

    try {

        const result = await getQuizByIdService(
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



// update quiz

const updateQuiz = async (req, res) => {

    try {

        const result = await updateQuizService(
            req.params.id,
            req.body
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// delete quiz

const deleteQuiz = async (req, res) => {

    try {

        const result = await deleteQuizService(
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


module.exports = {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getQuizzesByCategoryId
};