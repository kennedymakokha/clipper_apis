const express = require("express");
var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var User = require("models/auth.model")
var jwt = require("jsonwebtoken");

const { MakeActivationCode, Format_phone_number } = require("../helpers/common.helper");
const { validateLoginInput, validateRegisterInput, validateUpdateInput, validatePasswordInput } = require("../validations/auth.validate");
const { SendMessage } = require("../helpers/sms.helper");

const router = express.Router();


router.post("/login", async (req, res) => {
    try {

        req.body.phone_number = await Format_phone_number(req.body.phone_number); //format the phone number
        let user = {};
        let userOBJ = await User.findOne({ phone_number: req.body.phone_number });

        if (!userOBJ) {
            return res
                .status(402)
                .json({ message: "Authentication failed with wrong credentials!!" });
        }
        const { errors, isValid } = validateLoginInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0];
            return res.status(400).json({ message: error });
        }

        if (userOBJ) {
            const password_match = await userOBJ.comparePassword(
                req.body.password,
                userOBJ.hashPassword
            );
            if (!password_match) {
                return res
                    .status(402)
                    .json({ message: "Authentication failed with wrong credentials!!" });
            }
            const token = await jwt.sign(
                { email: userOBJ.email, _id: userOBJ._id },
                process.env.JWT_KEY
            );

            user.token = token;
            user.name = `${userOBJ.name}`;
            user.phone_number = userOBJ.phone_number;
            user._id = userOBJ._id;


            user.token = token


            return res.status(200).json(user);
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});



router.post("/register", async (req, res) => {
    try {

        const body = req.body;
        const { errors, isValid } = await validateRegisterInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0];
            return res.status(400).json({ message: error });
        }



        req.body.phone_number = await Format_phone_number(req.body.phone_number); //format the phone number
        const phone = await User.findOne({ phone_number: req.body.phone_number });
        if (phone) {
            return res.status(402).json({ message: "User Exists !!", });
        }

        body.verification_code = MakeActivationCode(5);
        body.hashPassword = bcrypt.hashSync(body.password, 10);
        let NewUser = await new User(body).save();
        return res
            .status(200)
            .json({ message: "User Saved Successfully !!", NewUser });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.put("/:id/update-info", async (req, res) => {
    try {
        const body = req.body;
        console.log("BODY", body);
        const { errors, isValid } = validateUpdateInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0];
            return res.status(400).json({ message: error });
        }

        await User.findOneAndUpdate(
            { _id: req.params.id },
            body,
            { new: true, useFindAndModify: false }
        );
        let nokBody = {

            name: body.nextkinname,
            phone_number: body.nextkinphone,
            ID_no: body.nextkinID,
            gender: body.nextkingender,
            user: req.params.id,
        }
        await new NOK(nokBody).save()
        return res
            .status(200)
            .json({ success: false, message: "Information updated successfull ", });
    } catch (error) {
        console.log(error)
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});

router.post("/:id/update_password", async (req, res) => {
    try {
        const body = req.body;
        const { errors, isValid } = validatePasswordInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0];
            return res.status(400).json({ message: error });
        }
        const user = await User.findById(req.params.id);
        const password_match = user.comparePassword(
            req.body.password,
            user.hashPassword
        );
        if (!password_match) {
            return res
                .status(401)
                .json({ message: "The Previous Password is incorrect!!" });
        }
        let hashPassword = bcrypt.hashSync(body.new_password, 10);
        const Update = await User.findOneAndUpdate(
            { _id: req.params.id },
            { hashPassword },
            { new: true, useFindAndModify: false }
        );
        return res
            .status(200)
            .json({ success: true, message: "User Updated Successfully ", Update });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.put("/reset-password", async (req, res) => {
    try {
        const body = req.body;

        const { errors, isValid } = validatePasswordInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0];
            return res.status(400).json({ message: error });
        }

        req.body.phone_number = await Format_phone_number(req.body.phone_number); //format the phone number
        let user = (await User.findOne({ phone_number: req.body.phone_number }))
        if (user.verification_code !== body.code) {
            return res
                .status(400)
                .json({ success: false, message: "Incorrect varification code " });
        }

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User Not Found " });
        }
        let hashPassword = bcrypt.hashSync(body.new_password, 10);



        const Update =

            await User.findOneAndUpdate(
                { phone_number: user.phone_number },
                { hashPassword: hashPassword },
                { new: true, useFindAndModify: false }
            );
        return res
            .status(200)
            .json({ success: true, message: "User Updated Successfully ", Update });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.post("/recover_account", async (req, res) => {
    try {
        const body = req.body;

        // let No = req.body.phone_number = await Format_phone_number(
        //     req.body.phone_number
        // );
        // const textbody = {
        //     address: `${No}`,
        //     Body: `Hi Kennedy  \nYour Account Recovery OTP for MaraPesa  is 101 `,
        // };

        // await SendMessage(textbody);
        // return
        if (req.body.phone_number) {
            req.body.phone_number = await Format_phone_number(req.body.phone_number); //format the phone number
            const user =
                (await User.findOne({ phone_number: body.phone_number }))

            if (!user) {
                return res
                    .status(401)
                    .json({ message: "The phone Number you entered is not registered " });
            }

            if (req.body.phone_number.charAt(0) === "0") {
                req.body.phone_number = await Format_phone_number(
                    req.body.phone_number
                ); //format the phone number
            }

            let verification_code = MakeActivationCode(5);
            const userUpdate = await User.findOneAndUpdate(
                { phone_number: req.body.phone_number },
                { verification_code },
                { new: true, useFindAndModify: false }
            );
            const textbody = {
                address: `${user.phone_number}`,
                Body: `Hi ${user.name} \nYour Account Recovery OTP for MaraPesa  is  ${verification_code} `,
            };

            await SendMessage(textbody);
            return res
                .status(200)
                .json({
                    message: `A recovery Text has been sent to  ${req.body.phone_number}`,
                });
        } else if (!req.body.phone_number && !req.body.email) {
            return res
                .status(401)
                .json({ message: "Kindly enter your email or phone number" });
        }
    } catch (error) {

        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});



router.post("/user/delete", async (req, res) => {
    try {
        const user = await User.findOne({ f_name: req.body.f_name });
        if (user == null) {
            return res
                .status(400)
                .json({ success: false, message: "user not found " });
        }

        await User.findOneAndDelete({ f_name: req.body.f_name });
        return res.status(200).json({ message: "User Deleted" });
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/user/:id", async (req, res) => {
    try {
        let user;
        if (await User.findById(req.params.id)) {
            user = await User.findById(req.params.id);
        } else if (await Rider.findById(req.params.id)) {
            user = await Rider.findById(req.params.id);
        }

        return res
            .status(200)
            .json({ message: "User Fetched Successfully !!", user });
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/users", async (req, res) => {

    try {

        const Users = await User.find({});

        return res
            .status(200)
            .json(Users);
    } catch (error) {
        console.log(error)
        return res
            .status(400)
            .json(error);
    }
});

module.exports = router;