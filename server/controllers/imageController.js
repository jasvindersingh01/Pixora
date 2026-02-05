import FormData from 'form-data';
import userModel from '../models/userModel.js';
import axios from 'axios';

export const generateImage = async (req, res) => {
    try {

        const { prompt } = req.body;
        const userId = req.userId;

        if (!prompt) {
            return res.json({
                success: false,
                message: "Prompt is required!"
            })
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found!"
            })
        }

        if (user.creditBalance <= 0) {
            return res.json({
                success: false,
                message: "Insufficient credits!"
            })
        }
        const form = new FormData();
        form.append("prompt", prompt);

        const response = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            form,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                },
                responseType: "arraybuffer",
            }
        );

        const base64Image = Buffer.from(response.data).toString("base64");

        const resultImage = `data:image/png;base64,${base64Image}`;

        user.creditBalance -= 1;
        await user.save();

        res.json({
            success: true,
            message: "Image Generated",
            creditBalance: user.creditBalance,
            image: resultImage,
        })

    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message: "Image generation failed!"
        })
    }
}