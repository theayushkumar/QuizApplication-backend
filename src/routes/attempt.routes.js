const express = require('express');

const router = express.Router();

const attemptController = require('../controllers/attempt.controller');

const verifyToken = require('../middlewares/auth.middleware');


// start quiz

router.post(
    '/start-quiz',
    verifyToken,
    attemptController.startQuiz
);


// submit quiz

router.post(
    '/submit-quiz',
    verifyToken,
    attemptController.submitQuiz
);


// get result

router.get(
    '/result/:id',
    verifyToken,
    attemptController.getResult
);


// get history

router.get(
    '/history',
    verifyToken,
    attemptController.getUserHistory
);


router.post(
    '/quiz-questions',
    verifyToken,
    attemptController.getQuizQuestions
);

module.exports = router;