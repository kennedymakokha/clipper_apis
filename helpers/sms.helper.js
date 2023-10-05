const credentials = {
    // apiKey: '84fac51ff8e918a3120fc417469c7cfb86dfb5bd1b6bb71abde77fb7c111c73a',         // use your sandbox app API key for development in the test environment
    // username: 'PikUpMtaani',  
    apiKey: 'ed753c432dddaf7c476528f961e839d26699a1a6ab91a77fb0881f3cc9cd526d',         // use your sandbox app API key for development in the test environment
    username: 'kenate',
    // use 'sandbox' for development in the test environment
};
const africastalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = africastalking.SMS
module.exports.SendMessage = async (data) => {

    try {
        const options = {
            to: [`${data.address}`],
            message: `${data.Body}`,
            // from: "PikUpMtaani",
        }
        let r = await sms.send(options)
        console.log(r)
    } catch (error) {
        console.log("ERROR", error)

    }
}