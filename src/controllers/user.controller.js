const {

    addUserService,
    getUsersService,
    updateUserService,
    deleteUserService,
    changeUserStatusService

} = require('../services/user.service');


// add user

const addUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !role
        ) {

            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            });

        }

        const result =
            await addUserService(req.body);

        return res.status(201).json(result);

    } catch (error) {

        return res.status(
            error.status || 500
        ).json({
            success: false,
            message: error.message
        });

    }

};



// get users

const getUsers = async (req, res) => {

    try {

        const result =
            await getUsersService(req.body);

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



// update user

const updateUser = async (req, res) => {

    try {

        const { id } = req.body;

        if (!id) {

            return res.status(400).json({
                success: false,
                message: 'id is required'
            });

        }

        const result =
            await updateUserService(req.body);

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



// delete user

const deleteUser = async (req, res) => {

    try {

        const { id } = req.body;

        if (!id) {

            return res.status(400).json({
                success: false,
                message: 'id is required'
            });

        }

        const result =
            await deleteUserService(id);

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



// change status

const changeUserStatus = async (
    req,
    res
) => {

    try {

        const {
            id,
            is_active
        } = req.body;

        if (!id) {

            return res.status(400).json({
                success: false,
                message: 'id is required'
            });

        }

        const result =
            await changeUserStatusService(
                id,
                is_active
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
    addUser,
    getUsers,
    updateUser,
    deleteUser,
    changeUserStatus
};