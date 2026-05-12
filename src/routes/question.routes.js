const express = require('express');

const router = express.Router();

const questionController = require('../controllers/question.controller');

const verifyToken = require('../middlewares/auth.middleware');

const isAdmin = require('../middlewares/admin.middleware');


// create question

router.post(
    '/',
    verifyToken,
    isAdmin,
    questionController.createQuestion
);


// get questions

router.get(
    '/',
    verifyToken,
    questionController.getQuestions
);


// get single question

router.get(
    '/:id',
    verifyToken,
    questionController.getQuestionById
);


// update question

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    questionController.updateQuestion
);


// delete question

router.delete(
    '/:id',
    verifyToken,
    isAdmin,
    questionController.deleteQuestion
);


module.exports = router;