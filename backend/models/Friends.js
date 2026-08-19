const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        friendId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Individual indexes
friendSchema.index({ userId: 1 });
friendSchema.index({ friendId: 1 });

// Prevent duplicate friendships
friendSchema.index(
    { userId: 1, friendId: 1 },
    { unique: true }
);

const FriendModel = mongoose.model('Friend', friendSchema);

module.exports = FriendModel;