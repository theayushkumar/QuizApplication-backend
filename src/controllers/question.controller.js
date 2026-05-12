const {

    createQuestionService,
    getQuestionsService,
    getQuestionByIdService,
    updateQuestionService,
    deleteQuestionService

} = require('../services/question.service');


// create question

const createQuestion = async (req, res) => {

    try {

        const {
            quiz_id,
            category_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer
        } = req.body;

        if (
            !quiz_id ||
            !category_id ||
            !question ||
            !option_a ||
            !option_b ||
            !option_c ||
            !option_d ||
            !correct_answer
        ) {

            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            });

        }

        const result = await createQuestionService(req.body);

        return res.status(201).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// get questions

const getQuestions = async (req, res) => {

    try {

        const result = await getQuestionsService();

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// get single question

const getQuestionById = async (req, res) => {

    try {

        const result = await getQuestionByIdService(
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



// update question

const updateQuestion = async (req, res) => {

    try {

        const result = await updateQuestionService(
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



// delete question

const deleteQuestion = async (req, res) => {

    try {

        const result = await deleteQuestionService(
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
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};