const db = require('../config/db');


// create category

const createCategoryService = async (categoryData) => {

    const { name, description } = categoryData;

    return new Promise((resolve, reject) => {

        const insertQuery = `
            INSERT INTO categories (category_name, description)
            VALUES (?, ?)
        `;

        db.query(
            insertQuery,
            [name, description],
            (error, result) => {

                if (error) {
                    return reject({
                        status: 500,
                        message: 'failed to create category'
                    });
                }

                return resolve({
                    success: true,
                    message: 'category created successfully',
                });

            }
        );

    });

};



// get categories

const getCategoriesService = async () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT * FROM categories
            ORDER BY id DESC
        `;

        db.query(query, (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to fetch categories'
                });
            }

            return resolve({
                success: true,
                data: result
            });

        });

    });

};


// get single category

const getCategoryByIdService = async (id) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT * FROM categories
            WHERE id = ?
        `;

        db.query(query, [id], (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to fetch category'
                });
            }

            if (result.length === 0) {
                return reject({
                    status: 404,
                    message: 'category not found'
                });
            }

            return resolve({
                success: true,
                data: result[0]
            });

        });

    });

};



// update category

const updateCategoryService = async (id, categoryData) => {

    const { category_name, description } = categoryData;

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE categories
            SET category_name = ?, description = ?
            WHERE id = ?
        `;

        db.query(
            query,
            [category_name, description, id],
            (error, result) => {

                if (error) {
                    return reject({
                        status: 500,
                        message: 'failed to update category'
                    });
                }

                if (result.affectedRows === 0) {
                    return reject({
                        status: 404,
                        message: 'category not found'
                    });
                }

                return resolve({
                    success: true,
                    message: 'category updated successfully'
                });

            }
        );

    });

};



// delete category

const deleteCategoryService = async (id) => {

    return new Promise((resolve, reject) => {

        const query = `
            DELETE FROM categories
            WHERE id = ?
        `;

        db.query(query, [id], (error, result) => {

            if (error) {
                return reject({
                    status: 500,
                    message: 'failed to delete category'
                });
            }

            if (result.affectedRows === 0) {
                return reject({
                    status: 404,
                    message: 'category not found'
                });
            }

            return resolve({
                success: true,
                message: 'category deleted successfully'
            });

        });

    });

};

module.exports = {
    createCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
};