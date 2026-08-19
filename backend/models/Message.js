const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        text: {
            type: String,
            default: null,
            trim: true
        },

        // image: {
        //     type: String,
        //     default: null
        // }
    },
    {
        timestamps: true
    }
);

// Indexes
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });
messageSchema.index({ createdAt: 1 });

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;