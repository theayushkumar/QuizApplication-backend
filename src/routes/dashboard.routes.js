const express = require('express');

const router = express.Router();

const dashboardController =
    require('../controllers/dashboard.controller');

const verifyToken =
    require('../middlewares/auth.middleware');

const isAdmin =
    require('../middlewares/admin.middleware');


// dashboard stats

router.get(
    '/stats',
    verifyToken,
    isAdmin,
    dashboardController.getDashboardStats
);


// category attempts

router.get(
    '/category-attempts',
    verifyToken,
    isAdmin,
    dashboardController.getCategoryAttempts
);


// result distribution

router.get(
    '/result-distribution',
    verifyToken,
    isAdmin,
    dashboardController.getResultDistribution
);


module.exports = router;