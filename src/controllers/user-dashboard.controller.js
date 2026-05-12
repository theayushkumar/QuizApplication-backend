const {

    getUserDashboardStatsService,
    getUserResultChartService

} = require('../services/user-dashboard.service');


// dashboard stats

const getUserDashboardStats = async (
    req,
    res
) => {

    try {

        const userId = req.user.id;

        const result =
            await getUserDashboardStatsService(
                userId
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



// result chart

const getUserResultChart = async (
    req,
    res
) => {

    try {

        const userId = req.user.id;

        const result =
            await getUserResultChartService(
                userId
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
    getUserDashboardStats,
    getUserResultChart
};