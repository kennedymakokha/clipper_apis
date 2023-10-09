const Validator = require('validator');

const { UpperCase, NumericalExists, isUpper, isSpecial } = require('./pass.validate');
const { isEmpty, emailIsValid } = require('../helpers/common.helper');


module.exports.validatemsgInput = (data) => {
    let errors = {};

    data.body = !isEmpty(data.body) && data.body !== undefined ? data.body : '';
    if (Validator.isEmpty(data.body)) {
        errors.body = 'Body field is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
module.exports.validatSubscriberInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) && data.email !== undefined ? data.email : '';
    data.company = !isEmpty(data.company) && data.company !== undefined ? data.company : '';

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Kindly Supply an email address';
    }
    if (Validator.isEmpty(data.company)) {
        errors.company = 'The company name is not specified kindly ask the admin to assist if this persists';
    }
    if (!emailIsValid(data.email)) {
        errors.email = 'Kindly Supply a valid  email address';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports.validatMailInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) && data.email !== undefined ? data.email : '';
    data.name = !isEmpty(data.name) && data.name !== undefined ? data.name : '';
    data.msg = !isEmpty(data.msg) && data.msg !== undefined ? data.msg : '';
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Kindly Enter your Name';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Kindly Enter an email address';
    }
    if (!emailIsValid(data.email)) {
        errors.email = 'Kindly Enter a valid  email address';
    }
    if (Validator.isEmpty(data.msg)) {
        errors.msg = 'Kindly Enter The message';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}



