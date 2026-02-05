import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connetToDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
await connetToDB();

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

app.get("/", (req, res) => {
    res.send("API Working")
});

app.listen(PORT,() => console.log(`Server in running on ${PORT}`))

