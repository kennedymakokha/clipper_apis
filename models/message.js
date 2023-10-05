var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

var {
    authMiddleware,
    authorized,
} = require("middlewares/auth.middleware");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    body: {
        type: String,
    },
    sender_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reciever_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },


}, { timestamps: true });

UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

module.exports = mongoose.model('message', UserSchema);