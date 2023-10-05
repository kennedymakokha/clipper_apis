const Makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


const MakeActivationCode = (length) => {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const Format_phone_number = (phone_number) => {
    console.log(phone_number)
    let Refined
    if (phone_number.charAt(0) === "0") {
        let newPhone = phone_number.slice(1);
        Refined = "+254".concat(newPhone)
        return Refined
    }
    else if (phone_number.substring(0, 4) === "+254") {
        return phone_number
    }

}
const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}
const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
module.exports = { Makeid, MakeActivationCode, Format_phone_number, emailIsValid, isEmpty }