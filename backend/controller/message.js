const MessageModel = require('../models/Message');

// Login required
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const { text } = req.body;

        const new_message = new MessageModel({
            senderId,
            receiverId,
            text
        });

        const saved_message = await new_message.save();

        res.status(201).json({
            message: "Message sent successfully",
            data: saved_message
        });
    }
    catch (error) {
        res.status(500).json({
            message: "error occured while sending message",
            error: error.message
        });
    }
};


// Login required
const getMessages = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        const messages = await MessageModel.find({
            $or: [
                {
                    senderId: senderId,
                    receiverId: receiverId
                },
                {
                    senderId: receiverId,
                    receiverId: senderId
                }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({
            message: "error occured while fetching messages",
            error: error.message
        });
    }
};

module.exports = { sendMessage, getMessages };