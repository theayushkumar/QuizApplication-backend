const {
    createCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
} = require('../services/category.service');


// create category

const createCategory = async (req, res) => {

    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'category name is required'
            });
        }

        const result = await createCategoryService(req.body);

        return res.status(201).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};



// get categories

const getCategories = async (req, res) => {

    try {

        const result = await getCategoriesService();

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });

    }

};


const getCategoryById = async (req, res) => {

    try {

        const result = await getCategoryByIdService(
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


const updateCategory = async (req, res) => {

    try {

        const result = await updateCategoryService(
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

const deleteCategory = async (req, res) => {

    try {

        const result = await deleteCategoryService(
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
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};