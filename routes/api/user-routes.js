const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/users-controller');

router.route('/').get(getAllUsers).post(createUsers);

router.route('/:userId').get(getUsersById).put(updateUsers).delete(deleteUsers);

router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;