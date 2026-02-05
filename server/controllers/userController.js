import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import razorpay from 'razorpay';
import transactionModel from "../models/transactionModel.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Please Fill all the details!"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRETKEY)

        res.json({
            success: true,
            token,
            user: { name: user.name }
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist!"
            })
        }
        const checkPass = await bcrypt.compare(password, user.password);
        if (checkPass) {
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRETKEY)

            res.json({
                success: true,
                token,
                user: { name: user.name }
            })
        } else {
            return res.json({
                success: false,
                message: "Wrong password!"
            })
        }

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const userCredits = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        res.json({
            success: true,
            credits: user.creditBalance,
            user: { name: user.name }
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const razorpayPayment = async (req, res) => {
    try {

        const userId = req.userId;
        const { planId } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({
                success: false,
                message: "User not found!",
            });
        }

        let credits, plan, amount, date;

        switch (planId) {
            case "basic":
                plan = "basic";
                credits = 120;
                amount = 10;
                break;

            case "advance":
                plan = "advance";
                credits = 700;
                amount = 50;
                break;

            case "pro":
                plan = "pro";
                credits = 1600;
                amount = 100;
                break;

            default:
                return res.json({
                    success: false,
                    message: "Plan not found!",
                });
        }

        const transactionData = {
            userId, plan, amount, credits, date: Date.now(),
            status: "created",
        }

        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY || "INR",
            receipt: newTransaction._id.toString()
        }

        const order = await razorpayInstance.orders.create(options);

        return res.json({
            success: true,
            order,
            transactionId: newTransaction._id,
        });

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === "paid") {
            const transactionData = await transactionModel.findById(orderInfo.receipt)
            if (transactionData.payment) {
                return res.json({
                    success: false,
                    message: "Payment already verified!"
                })
            }
            const userData = await userModel.findById(transactionData.userId)
            const creditBalance = await userData.creditBalance + transactionData.credits;

            await userModel.findByIdAndUpdate(userData._id, { creditBalance })

            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })
            res.json({
                success: true,
                message: "Credits added successfully!"
            })
        } else {
            res.json({
                success: false,
                message: "Payment Failed..!"
            })
        }

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}


export { registerUser, loginUser, userCredits, razorpayPayment, verifyRazorpay, }