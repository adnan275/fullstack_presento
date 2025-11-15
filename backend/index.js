import express from 'express';
import cors from 'cors'; //connects backend and frontend
import dotenv from 'dotenv'; //securely manage environment variables
dotenv.config();
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes)

app.get("/", (req,res)=>{
    res.send("API is running...");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
