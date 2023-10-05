const express = require("express");
var Message = require("models/message")
var Subscribers = require("models/subscriber")
const { MakeActivationCode, Format_phone_number } = require("../helpers/common.helper");

const router = express.Router();

var {
    authMiddleware,
    authorized,
} = require("middlewares/auth.middleware");
const { validatemsgInput, validatSubscriberInput } = require("../validations/msg.validate");
const transporter = require("../helpers/transporter.helper");


router.post("/send-text", [authMiddleware, authorized], async (req, res) => {
    try {

        const body = req.body;
        const { errors, isValid } = await validatemsgInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0];
            return res.status(400).json({ message: error });
        }
        body.sender_id = req.user._id
        body.createdBy = req.user._id
        let NewUser = await new Message(body).save();
        return res
            .status(200)
            .json(NewUser);
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});


router.get("/messages", [authMiddleware, authorized], async (req, res) => {
    try {
        let msgs = await Message.find({ $or: [{ reciever_id: req.user._id }, { sender_id: req.user._id }] });

        return res
            .status(200)
            .json(msgs);
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});




module.exports = router;