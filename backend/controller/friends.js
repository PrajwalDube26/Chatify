const FriendModel = require('../models/Friends');

// Login required
const add_friend = async (req, res) => {
    try {
        const userId = req.user.id;
        const { friendId } = req.params;

        const new_friend = new FriendModel({
            userId,
            friendId
        });

        const added_friend = await new_friend.save();

        res.status(201).json({
            message: "Friend added successfully",
            friend: added_friend
        });
    }
    catch (error) {
        // Duplicate friendship error
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Friend already added"
            });
        }

        res.status(500).json({
            message: "error occured while adding friend",
            error: error.message
        });
    }
};


// Login required
const get_friends = async (req, res) => {
    try {
        const userId = req.user.id;

        const friends = await FriendModel.find({ userId })
            .populate("friendId", "-password");

        res.status(200).json(friends);
    }
    catch (error) {
        res.status(500).json({
            message: "error occured while fetching friends",
            error: error.message
        });
    }
};


// Login required
const delete_friend = async (req, res) => {
    try {
        const userId = req.user.id;
        const { friendId } = req.params;

        const deleted_friend = await FriendModel.findOneAndDelete({
            userId,
            friendId
        });

        if (deleted_friend) {
            res.status(200).json({
                message: "Friend deleted successfully"
            });
        }
        else {
            res.status(404).json({
                message: "Friend not found"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "error occured while deleting friend",
            error: error.message
        });
    }
};


module.exports = { add_friend, get_friends, delete_friend };