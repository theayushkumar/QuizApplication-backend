const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category.controller');

const verifyToken = require('../middlewares/auth.middleware');

const isAdmin = require('../middlewares/admin.middleware');


// create category

router.post(
    '/',
    verifyToken,
    isAdmin,
    categoryController.createCategory
);


// get categories

router.get(
    '/',
    verifyToken,
    categoryController.getCategories
);

// get single category

router.get(
    '/:id',
    verifyToken,
    categoryController.getCategoryById
);


// update category

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    categoryController.updateCategory
);


// delete category

router.delete(
    '/:id',
    verifyToken,
    isAdmin,
    categoryController.deleteCategory
);

module.exports = router;