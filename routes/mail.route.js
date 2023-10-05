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


router.post("/add-subscriber", async (req, res) => {
    try {
        // const Exists = await Subscribers.findOne({ email: req.body.email })
        // if (Exists) {
        //     return res
        //         .status(200)
        //         .json();
        // }
        const body = req.body;
        const { email } = body
        const { errors, isValid } = await validatSubscriberInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0];
            return res.status(400).json({ message: error });
        }

        let newSubscriber = await new Subscribers(body).save();
        const mailOptions = {
            from: ` <bradcoupers@gmail.com>`,
            to: `${req.body.email}`,
            subject: 'SUbscribtion sign Up',
            template: 'subscriber',
            context: {
                email: `${email}`,

            },
        }
        await transporter.sendMail(mailOptions)
        return res
            .status(200)
            .json(newSubscriber);
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});


router.post("/mail", async (req, res) => {
    try {
        const { to_mail, company, phone, name, email, msg } = req.body;

        const mailOptions = {
            from: `${company} <bradcoupers@gmail.com>`,
            to: `${to_mail}`,
            subject: 'Customer Concern',
            template: 'contact',
            context: {
                email: `${email}`,
                name: `${name}`,
                phone: `${phone}`,
                msg: `${msg}`,
                company: `${company}`
            },
        }
        await transporter.sendMail(mailOptions)
        return res
            .status(200)
            .json({ success: true, message: "Sent Mail sent  " });

    } catch (error) {
        console.log(error)
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});

router.post("/send-subscriptions", async (req, res) => {
    try {
        const { to_mail, company, phone, name, email, msg,image } = req.body;
console.log(req.body)
        const mailOptions = {
            from: `${company} <bradcoupers@gmail.com>`,
            to: `${to_mail}`,
            subject: 'Customer Concern',
            template: 'contact',
            context: {
                email: `${email}`,
                name: `${name}`,
                phone: `${phone}`,
                msg: `${msg}`,
                company: `${company}`
            }, attachments:{}
        }
        await transporter.sendMail(mailOptions)
        return res
            .status(200)
            .json({ success: true, message: "Sent Mail sent  " });

    } catch (error) {
        console.log(error)
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});

module.exports = router;