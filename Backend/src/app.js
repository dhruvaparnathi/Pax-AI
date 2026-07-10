import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import cookieParser from 'cookie-parser';
import validationMiddleware from './middlewares/error.middleware.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);


app.use(validationMiddleware);


const frontendPath = path.join(__dirname, '../public');

if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    app.get('*any', (req, res) => {
        res.sendFile(path.resolve(frontendPath, 'index.html'));
    });
} else {
    console.warn('Warning: No frontend found at', frontendPath);
}

export default app;