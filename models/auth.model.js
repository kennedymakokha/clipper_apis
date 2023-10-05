var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
    },
    phone_number: {
        type: String
    },
    email: {
        type: String
    },
    activated: {
        type: Boolean,
        default: false
    },
    verification_code: {
        type: String,
    },
    organisation: {
        type: String,
    },
    interest: {
        type: String,
    },
    comment: {
        type: String,
    },
    hashPassword: {
        type: String,
        required: true
    },

}, { timestamps: true });

UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

module.exports = mongoose.model('user', UserSchema);