const fetch = require('node-fetch').default
var axios = require("axios");
var moment = require("moment");
const mpesa_logsModel = require("models/mpesa_logs.model");
var { Headers } = fetch;

const validatePhone = (phone) => {
    let raw_phone_number = phone?.trim();
    let valid_phone_number = "";
    if (phone.startsWith("+254")) {
        valid_phone_number = raw_phone_number.replace("+254", "254");
    } else if (phone.startsWith("0")) {
        valid_phone_number = raw_phone_number.replace("0", "254");
    } else {
        valid_phone_number = raw_phone_number;
    }

    return valid_phone_number.replace(" ", "");
};
const Mpesa_stk = async (
    No,
    amount,
    user,
) => {
    let consumer_key = process.env.MPESA_CONSUMER_KEY,
        consumer_secret = process.env.MPESA_CONSUMER_SECRETE,
        passkey = process.env.MPESA_CONSUMER_PASSKEY,
        short_code = parseInt(process.env.MPESA_SHORT_CODE),
        timestamp = moment().format("YYYYMMDDHHmmss");

    let phone = validatePhone(`${No}`);
    let new_amount = parseInt(amount);

    const Authorization = `Bearer ${new Buffer.from(
        `${consumer_key}:${consumer_secret}`,
        "utf-8"
    ).toString("base64")}`;

    // console.log('Generating Token')

    const response = await axios.get(
        `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
            headers: {
                Authorization: `Basic ${new Buffer.from(
                    `${consumer_key}:${consumer_secret}`
                ).toString("base64")}`,
            },
        }
    );

    let token = response.data.access_token;
    console.log(`token: ${phone}`);
    // return
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    const fetch_response = await fetch(
        `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                BusinessShortCode: short_code,
                Password: new Buffer.from(
                    `${short_code}${passkey}${timestamp}`
                ).toString("base64"),
                Timestamp: `${timestamp}`,
                TransactionType: "CustomerPayBillOnline",
                Amount: new_amount,
                PartyA: phone,
                PartyB: 4115395,
                PhoneNumber: phone,
                CallBackURL: `${process.env.MPESA_CALLbACK}`,
                AccountReference: "Mtadao Pack Ltd",
                TransactionDesc: "Payment delivery of  *",
            }),
        }
    );
    const data = await fetch_response.json();

    const body = {
        MerchantRequestID: data.MerchantRequestID,
        CheckoutRequestID: data.CheckoutRequestID,
        phone_number: phone,
        amount: amount,
        ResponseCode: data.ResponseCode,
        user: user,
        log: "",
    };


    return data;
};

module.exports = Mpesa_stk;
