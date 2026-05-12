const {

    getDashboardStatsService,
    getCategoryAttemptsService,
    getResultDistributionService

} = require('../services/dashboard.service');


// stats

const getDashboardStats = async (
    req,
    res
) => {

    try {

        const result =
            await getDashboardStatsService();

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



// category attempts

const getCategoryAttempts = async (
    req,
    res
) => {

    try {

        const result =
            await getCategoryAttemptsService();

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



// result distribution

const getResultDistribution = async (
    req,
    res
) => {

    try {

        const result =
            await getResultDistributionService();

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
    getDashboardStats,
    getCategoryAttempts,
    getResultDistribution
};