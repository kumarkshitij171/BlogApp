const Razorpay = require('razorpay');
const crypto = require("crypto");
const { Payment } = require('../models/Payment.model');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const createPayment = async (req, res) => {
    // console.log("createPayment")
    // console.log(req.body)
    const { amount } = req.body;
    const amountInPaise = Number(amount) * 100;
    const options = {
        amount: amountInPaise, // amount in the smallest currency unit
        currency: "INR",
    };
    // console.log(options)
    instance.orders.create(options, function (err, order) {
        // console.log(order);
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Something went wrong", err });
        }
        return res.status(200).json({ order });
    });
};

const getRazorPayApiKey = (req, res) => {
    res.json({
        key: process.env.RAZORPAY_API_KEY
    });
};

// After creating the payment, we need to verify and store the payment details in the database.
const storeVerifiedPayment = async (req, res) => {
    // console.log("storeVerifiedPayment")
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // Verify the signature of the payment
        const signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest("hex");

        // If the signature is not matched, return an error
        if (signature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment request" });
        }
        // signature matched, store the payment details in the database

        const sucessPayment = await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        if (!sucessPayment) {
            return res.status(400).json({ message: "Payment failed" });
        }
        // console.log("Success Payment", sucessPayment)
        res.redirect(`${process.env.CLIENT_URL}/payment-success?reference=${razorpay_payment_id}`)
        // return res.status(200).json({ message: "Payment Successful" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    createPayment,
    storeVerifiedPayment,
    getRazorPayApiKey
};