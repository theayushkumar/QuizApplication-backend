const express = require('express');

const router = express.Router();

const userDashboardController =
    require(
        '../controllers/user-dashboard.controller'
    );

const verifyToken =
    require('../middlewares/auth.middleware');


// dashboard stats

router.get(
    '/stats',
    verifyToken,
    userDashboardController.getUserDashboardStats
);


// result chart

router.get(
    '/result-chart',
    verifyToken,
    userDashboardController.getUserResultChart
);


module.exports = router;