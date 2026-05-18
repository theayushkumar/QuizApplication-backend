const express = require('express');

const router = express.Router();

const quizController = require('../controllers/quiz.controller');

const verifyToken = require('../middlewares/auth.middleware');

const isAdmin = require('../middlewares/admin.middleware');


// create quiz

router.post(
    '/',
    verifyToken,
    isAdmin,
    quizController.createQuiz
);


// get quizzes

router.get(
    '/',
    verifyToken,
    quizController.getQuizzes
);


// get single quiz

router.get(
    '/:id',
    verifyToken,
    quizController.getQuizById
);


// update quiz

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    quizController.updateQuiz
);


// delete quiz

router.delete(
    '/:id',
    verifyToken,
    isAdmin,
    quizController.deleteQuiz
);

// get quizzes by category id

router.get(
    '/category/:category_id',
    verifyToken,
    quizController.getQuizzesByCategoryId
);


module.exports = router;